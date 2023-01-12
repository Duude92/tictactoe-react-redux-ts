import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { CellCoordinate, CellValue } from "../../Components/Cell"



interface PlayerScore {
    player1: number;
    player2: number;
}


export interface DeskState {
    isFirstUser: boolean;
    desk: CellValue[][];
    canMove: boolean;
    Score: PlayerScore;
    lastPlayer: boolean; //used to determine the player, who moved last
}
const initCellArray = (): CellValue[][] => {
    let cells: CellValue[][] = [];
    for (let index = 0; index < 3; index++) {
        let row: CellValue[] = [];
        for (let index2 = 0; index2 < 3; index2++) {
            row.push(CellValue.NONE);
        }
        cells.push(row);
    }
    return cells;

}
const initialState: DeskState = {
    isFirstUser: true,
    desk: initCellArray(),
    canMove: true,
    Score: {
        player1: 0,
        player2: 0,
    },
    lastPlayer: false,

}
export enum WinningLine {
    NONE,
    COLUMN,
    ROW,
    PRIMARYDIAGONAL,
    SECONDARYDIAGONAL
}
export interface WinningLineType {
    Line: WinningLine;
    index: number;
    draw: boolean;
}
interface ObjectResult {
    result: number;
    then: (callback: Function) => WinningLineType;
}
const checkGameForEnd = (state: Draft<DeskState>) => {
    const checkLine = (array: CellValue[]): boolean => { return array[0] !== CellValue.NONE && array.every(element => element === array[0]) }
    const checkMatrix = (array: CellValue[][]): ObjectResult => { const result = (array.map(element => checkLine(element)).findIndex((element) => element === true)); return { result: result, then: (callback: Function): WinningLineType => { return callback(result) } } };
    const invertMatrix = (array: CellValue[][]): CellValue[][] => array.map((element, index) => array.map(row => row[index]))
    const getPrimaryDiagonal = (array: CellValue[][]): CellValue[] => array.map((element, index) => element[index]);
    const getSecondaryDiagonal = (array: CellValue[][]): CellValue[] => array.map((element, index) => element[2 - index]);
    const countFilledCells = (array: CellValue[][]): number => array.flat().reduce<number>((acc, val) => (acc + Number(val !== CellValue.NONE)), 0);
    // (acc, val) => acc + val.reduce(
    //     (acc1, val1) => acc1 + val1 !== CellValue.NONE))

    let resultLine: WinningLineType = { Line: WinningLine.NONE, index: -1, draw: false };
    const desk = state.desk.map(element => Array.from(element));
    const newState = { ...state, desk: desk };

    let checkResult: WinningLineType = checkMatrix(newState.desk).then((result: number) => result > -1 ? { Line: WinningLine.COLUMN, index: result } :
        checkMatrix(invertMatrix(newState.desk)).then((result: number) => result > -1 ? { Line: WinningLine.ROW, index: result } :
            ((checkLine(getPrimaryDiagonal(newState.desk)) && { Line: WinningLine.PRIMARYDIAGONAL }) || (checkLine(getSecondaryDiagonal(newState.desk)) && { Line: WinningLine.SECONDARYDIAGONAL })) || resultLine
        ));
    const count = countFilledCells(newState.desk);
    if (checkResult.Line !== WinningLine.NONE || count === 9) {
        checkResult.draw = checkResult.Line === WinningLine.NONE; //additional checking if we got here without winning
        const customevent = new CustomEvent('onGameEnded', { 'detail': checkResult });
        window.dispatchEvent(customevent);
    }
    return checkResult;
}
const updateScore = (state: Draft<DeskState>) => {
    !state.isFirstUser ?
        state.Score.player1 = state.Score.player1 + 1
        :
        state.Score.player2 = state.Score.player2 + 1
    return state;
}

export const deskSlice = createSlice({
    name: 'desk',
    initialState,
    reducers: {
        //:  DeskState | void | Draft<DeskState> | CellValue
        changeCellState: (state, action: PayloadAction<CellCoordinate>) => {
            if (state.desk[action.payload.Y][action.payload.X] !== CellValue.NONE) return state;
            const result: CellValue = state.isFirstUser ? CellValue.CROSS : CellValue.CIRCLE;
            state.desk[action.payload.Y][action.payload.X] = result;
            state.isFirstUser = !state.isFirstUser;
            const endResult = checkGameForEnd(state);
            if (endResult.Line !== WinningLine.NONE) {
                state.lastPlayer = !state.isFirstUser;
                (state.canMove = false);
                updateScore(state);
            }
            return state;
        },
        resetDesk: (state, action: PayloadAction<Boolean>) => {
            return action.payload ?
                initialState :
                { ...initialState, Score: state.Score, lastPlayer: state.lastPlayer }
        },



    }
})
export const selectCellValue = (state: RootState): CellValue.CROSS | CellValue.CIRCLE => state.desk.isFirstUser ? CellValue.CROSS : CellValue.CIRCLE;
export const selectPlayer = (state: RootState): boolean => state.desk.isFirstUser;
export const canMoveSelector = (state: RootState): boolean => state.desk.canMove;
export const lastPlayerSelector = (state: RootState): boolean => state.desk.lastPlayer;
// export const roundDrawSelector = (state: RootState): boolean => state.desk.draw;
export const { changeCellState, resetDesk } = deskSlice.actions;
export const scoreSelector = (state: RootState) => state.desk.Score;

export default deskSlice.reducer;