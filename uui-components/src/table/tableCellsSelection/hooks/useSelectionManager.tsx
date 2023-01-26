import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataTableSelectedCellData, useDebounce, useForceUpdate } from '@epam/uui-core';
import type { SelectionManager, SelectionManagerProps, DataTableSelectionRange, CopyOptions } from '../types';
import { getCell, getCellPosition, getCellToCopyFrom, getNormalizedLimits } from './helpers';

export const useSelectionManager = <TItem, TId, TFilter>({ rows, columns }: SelectionManagerProps<TItem, TId>): SelectionManager<TItem> => {
    const rowsRef = useRef(rows);

    const forceUpdate = useForceUpdate();

    useEffect(() => {
        rowsRef.current = rows;
        forceUpdate();
    }, [rows]);

    const [selectionRange, setSelectionRange] = useState<DataTableSelectionRange>(null);
    const setSelectionRangeDebounced = useDebounce(setSelectionRange, 0);

    const cellToCopyFrom = useMemo(
        () => getCellToCopyFrom<TItem, TId, TFilter>(selectionRange, rowsRef.current, columns),
        [selectionRange?.startColumnIndex, selectionRange?.startRowIndex, columns],
    );

    const canBeSelected = useCallback((rowIndex: number, columnIndex: number, { copyFrom, copyTo }: CopyOptions) => {
        const cell = getCell(rowIndex, columnIndex, rowsRef.current, columns);
        if (!cell) return false;
        if (!cellToCopyFrom && copyTo) return false;
        if (copyFrom) return !!cell.column.canCopy?.(cell);

        return !!cell.column.canAcceptCopy?.(cellToCopyFrom, cell);
    }, [cellToCopyFrom, columns]);

    const shouldSelectCell = useCallback((row: number, column: number) => {
        if (selectionRange.startRowIndex === row && selectionRange.startColumnIndex === column) {
            return canBeSelected(row, column, { copyFrom: true });
        }
        return canBeSelected(row, column, { copyTo: true });
    }, [canBeSelected, selectionRange]);

    const getSelectedCells = useCallback((): DataTableSelectedCellData<TItem>[] => {
        if (!selectionRange) return [];

        const { startRowIndex, startColumnIndex, endRowIndex, endColumnIndex } = selectionRange;
        const [startRow, endRow] = getNormalizedLimits(startRowIndex, endRowIndex);
        const [startColumn, endColumn] = getNormalizedLimits(startColumnIndex, endColumnIndex);

        const selectedCells = [];
        for (let row = startRow; row <= endRow; row++) {
            for (let column = startColumn; column <= endColumn; column++) {
                if (shouldSelectCell(row, column)) {
                    const cell = getCell(row, column, rowsRef.current, columns);
                    selectedCells.push(cell);
                }
            }
        }

        return selectedCells;
    }, [selectionRange, columns, shouldSelectCell]);

    const getCellSelectionInfo = useCallback((row: number, column: number) => {
        const { isCopying } = selectionRange || {};
        const { isTop, isBottom, isLeft, isRight, isSelected, isStartCell } = getCellPosition(row, column, selectionRange);
        const canCopyFrom = canBeSelected?.(row, column, { copyFrom: true });
        const canAcceptCopy = canBeSelected?.(row, column, { copyTo: true });

        const showBorder = (isBorderPosition: boolean, neighborRow: number, neighborColumn: number) => {
            if (isStartCell) return true;
            if (!isSelected) return false;
            if (!isCopying) {
                return isBorderPosition;
            }
            return canAcceptCopy && (isBorderPosition || !canBeSelected?.(neighborRow, neighborColumn, { copyTo: true }));
        };

        const showTopBorder = showBorder(isTop, row - 1, column);
        const showRightBorder = showBorder(isRight, row, column + 1);
        const showBottomBorder = showBorder(isBottom, row + 1, column);
        const showLeftBorder = showBorder(isLeft, row, column - 1);

        return {
            isSelected, canCopyFrom, canAcceptCopy, isStartCell,
            showTopBorder, showRightBorder, showBottomBorder, showLeftBorder,
        };
    }, [selectionRange, canBeSelected]);

    return { selectionRange, setSelectionRange: setSelectionRangeDebounced, canBeSelected, getSelectedCells, cellToCopyFrom, getCellSelectionInfo };
};
