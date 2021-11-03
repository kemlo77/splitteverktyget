import { OrientationState } from './OrientationState';

export class OriginalOrientationState extends OrientationState {

    public createTable(rowsOfCellValues: string[][], checkedLengthDiffArray: number[]): HTMLTableElement {
        const theTable: HTMLTableElement = this.createRawHtmlTable(rowsOfCellValues);
        this.addVerticalHighlighting(theTable);
        this.prependDeleteRowButtonsColumn(theTable);
        this.prependLengthDiffColumn(theTable, checkedLengthDiffArray);
        return theTable;
    }

    private addVerticalHighlighting(table: HTMLTableElement): void {
        for (let rowNumber: number = 0; rowNumber < table.rows.length; rowNumber++) {
            for (let cellIndex: number = 0; cellIndex < table.rows[rowNumber].cells.length; cellIndex++) {
                table.rows[rowNumber].cells[cellIndex]
                    .addEventListener('click', (event) => {
                        this.toggleHighlightingForCellsInColumnWithSameText(<HTMLTableCellElement>event.target);
                    });
            }
        }
    }

    private prependDeleteRowButtonsColumn(table: HTMLTableElement,): void {
        for (let rowIndex: number = 0; rowIndex < table.rows.length; rowIndex++) {
            table.rows[rowIndex].prepend(this.createDeleteRowCell());
        }
    }

    private prependLengthDiffColumn(table: HTMLTableElement, lengthDiffs: number[]): void {
        if (lengthDiffs.length > 0) {
            for (let rowNumber: number = 0; rowNumber < table.rows.length; rowNumber++) {
                table.rows[rowNumber].prepend(this.createLengthDiffTdNode(lengthDiffs[rowNumber]));
            }
        }
    }

    private createDeleteRowCell(): HTMLTableCellElement {
        const newTdNode: HTMLTableCellElement = document.createElement('td');
        newTdNode.innerText = 'radera';
        newTdNode.addEventListener('click', (event) => {
            this.eraseRow(<HTMLTableCellElement>event.target);
        });
        return newTdNode;
    }

    private toggleHighlightingForCellsInColumnWithSameText(element: HTMLTableCellElement): void {
        const valdText: string = element.innerText;
        const addColorMode: boolean = this.tdIsntHighlighted(element);
        const tableCells: HTMLTableCellElement[] = this.getAllCellsInColumn(element);
        this.removeHighlightingFromTDs(tableCells);
        if (addColorMode) {
            this.highlightTdsWithMatchingText(tableCells, valdText);
        }
    }

    private getAllCellsInColumn(td: HTMLTableCellElement): HTMLTableCellElement[] {
        const tdChildNumber: number = this.getIndexOfElementRelativeToSiblings(td);
        const table: HTMLTableElement = td.parentElement.parentElement as HTMLTableElement;
        const cellsInColumn: HTMLTableCellElement[] = [];
        for (let rowIndex: number = 0; rowIndex < table.rows.length; rowIndex++) {
            cellsInColumn.push(table.rows[rowIndex].cells[tdChildNumber]);
        }
        return cellsInColumn;
    }

    private eraseRow(element: HTMLTableCellElement): void {
        element.parentElement.remove();
    }

}