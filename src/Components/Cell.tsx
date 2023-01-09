import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../app/hooks';
import { canMoveSelector, changeCellState, selectCellValue } from '../features/tictactoe/desk';
import styles from '../Styles/Cell.module.css'
export enum CellValue {
    NONE,
    CROSS,
    CIRCLE
}
export interface CellCoordinate {
    X: number;
    Y: number;
}
interface CellProps {
    position: CellCoordinate,
}
interface CellState {
    cellValue: CellValue;
    cellPosition: CellCoordinate;
}


export const Cell = (props: CellProps) => {

    const [cellState, setCellState] = useState({ cellValue: CellValue.NONE, cellPosition: props.position } as CellState);

    const dispatch = useDispatch();
    const cellValue: CellValue = useAppSelector(selectCellValue);
    const canMove: boolean = useAppSelector(canMoveSelector);

    const CellClick = () => {
        if (!canMove || cellState.cellValue !== CellValue.NONE) return;
        setCellState({ ...cellState, cellValue: cellValue });
        dispatch(changeCellState(cellState.cellPosition));
    }

    return (
        <div onClick={CellClick} className={`${styles.cell} ${(((cellState.cellValue === CellValue.CROSS) && styles.cellCross) || ((cellState.cellValue == CellValue.CIRCLE) && styles.cellCircle))}`} />
    )

}

