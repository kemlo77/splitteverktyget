import { OrientationState } from './OrientationState';

export class TransposedOrientationState extends OrientationState {

    public createTable(rowsOfCellValues: string[][], checkedLengthDiffArray: number[]): HTMLTableElement {
        const theTable: HTMLTableElement = this.createRawHtmlTable(this.transposeArrayOfArrays(rowsOfCellValues));
        this.addHorizontalHighlighting(theTable);
        this.prependDeleteColumnButtonsRow(theTable);
        this.prependLengthDiffsRow(theTable, checkedLengthDiffArray);
        return theTable;
    }

    private addHorizontalHighlighting(table: HTMLTableElement): void {
        for (let rowNumber: number = 0; rowNumber < table.rows.length; rowNumber++) {
            for (let cellIndex: number = 0; cellIndex < table.rows[rowNumber].cells.length; cellIndex++) {
                table.rows[rowNumber].cells[cellIndex]
                    .addEventListener('click', (event) => {
                        this.toggleHighligtingForCellsInRowWithSameText(<HTMLTableCellElement>event.target);
                    });
            }
        }
    }

    private prependDeleteColumnButtonsRow(table: HTMLTableElement): void {
        const deleteCellsRow: HTMLTableRowElement = document.createElement('tr');
        for (let x: number = 0; x < table.rows[0].cells.length; x++) {
            deleteCellsRow.appendChild(this.createDeleteColumnCell());
        }
        table.prepend(deleteCellsRow);
    }

    private prependLengthDiffsRow(table: HTMLTableElement, lengthDiffs: number[]): void {
        const diffCellsRow: HTMLTableRowElement = document.createElement('tr');
        lengthDiffs.forEach(diffValue => diffCellsRow.appendChild(this.createLengthDiffTdNode(diffValue)));
        table.prepend(diffCellsRow);
    }

    private createDeleteColumnCell(): HTMLTableCellElement {
        const newTdNode: HTMLTableCellElement = document.createElement('td');
        newTdNode.innerText = 'radera';
        newTdNode.addEventListener('click', (event) => { this.eraseColumn(<HTMLTableCellElement>event.target); });
        return newTdNode;
    }

    private toggleHighligtingForCellsInRowWithSameText(element: HTMLTableCellElement): void {
        const valdText: string = element.innerText;
        const addColorMode: boolean = this.tdIsntHighlighted(element);

        const tableCells: HTMLTableCellElement[] = this.getAllCellsInRow(element);
        this.removeHighlightingFromTDs(tableCells);
        if (addColorMode) {
            this.highlightTdsWithMatchingText(tableCells, valdText);
        }
    }

    private getAllCellsInRow(cell: HTMLTableCellElement): HTMLTableCellElement[] {
        const theCellRow: HTMLTableRowElement = cell.parentElement as HTMLTableRowElement;
        const tableCells: HTMLTableCellElement[] = [];
        for (let cellIndex: number = 0; cellIndex < theCellRow.cells.length; cellIndex++) {
            tableCells.push(theCellRow.cells[cellIndex]);

        }
        return tableCells;
    }

    private eraseColumn(element: HTMLTableCellElement): void {
        const columnToRemove: number = this.getIndexOfElementRelativeToSiblings(element);
        const table: HTMLTableElement = element.parentNode.parentNode as HTMLTableElement;
        for (let rowIndex: number = 0; rowIndex < table.rows.length; rowIndex++) {
            table.rows[rowIndex].cells[columnToRemove].remove();
        }
    }

}