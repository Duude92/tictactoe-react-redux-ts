import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { CellCoordinate, CellValue } from "../../Components/Cell"

export interface DeskState {
    isFirstUser: boolean;
    desk: CellValue[][];
    canMove: boolean;
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

    let resultLine: WinningLineType = { Line: WinningLine.NONE, index: -1 };
    const desk = state.desk.map(element => Array.from(element));
    const newState = { ...state, desk: desk };

    let checkResult: WinningLineType = checkMatrix(newState.desk).then((result: number) => result > -1 ? { Line: WinningLine.COLUMN, index: result } :
        checkMatrix(invertMatrix(newState.desk)).then((result: number) => result > -1 ? { Line: WinningLine.ROW, index: result } :
            checkLine(getPrimaryDiagonal(newState.desk)) && { Line: WinningLine.PRIMARYDIAGONAL } || checkLine(getSecondaryDiagonal(newState.desk)) && { Line: WinningLine.SECONDARYDIAGONAL } || resultLine
        ));
    if (checkResult.Line !== WinningLine.NONE) {
        const customevent = new CustomEvent('onGameEnded', { 'detail': checkResult });
        window.dispatchEvent(customevent);
    }
    return checkResult;
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
            endResult.Line !== WinningLine.NONE && (state.canMove = false);
            return state;
        },


    }
})
export const selectCellValue = (state: RootState): CellValue.CROSS | CellValue.CIRCLE => state.desk.isFirstUser ? CellValue.CROSS : CellValue.CIRCLE;
export const selectPlayer = (state: RootState): boolean => state.desk.isFirstUser;
export const canMoveSelector = (state: RootState): boolean => state.desk.canMove;
export const { changeCellState } = deskSlice.actions;
export default deskSlice.reducer;