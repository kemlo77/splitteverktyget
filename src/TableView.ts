export class TableView {

    private theTableDiv: HTMLElement = document.getElementById('right');



    updateTableView(rowsOfCellValues: string[][], checkedLengthDiffArray: number[]): void {

        this.removeChildrenOfElement(this.theTableDiv);
        const doTransposedTable: boolean = (document.getElementById('transposeCheckBox') as HTMLInputElement).checked;
        let table: HTMLTableElement;

        if (doTransposedTable) {
            table = this.createTransposedTable(rowsOfCellValues, checkedLengthDiffArray);
        }
        else {
            table = this.createRegularTable(rowsOfCellValues, checkedLengthDiffArray);
        }
        this.theTableDiv.appendChild(table);

    }

    //--------------------------------------------------
    private createTransposedTable(rowsOfCellValues: string[][], checkedLengthDiffArray: number[]): HTMLTableElement {
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

    //-----------------------------------------------

    createRegularTable(rowsOfCellValues: string[][], checkedLengthDiffArray: number[]): HTMLTableElement {
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
        for (let rowNumber: number = 0; rowNumber < table.rows.length; rowNumber++) {
            table.rows[rowNumber].prepend(this.createLengthDiffTdNode(lengthDiffs[rowNumber]));
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




    //--------------------------------------------

    createRawHtmlTable(rowsOfCellValues: string[][]): HTMLTableElement {
        const newTable: HTMLTableElement = document.createElement('table');
        rowsOfCellValues.forEach(row => {
            var newTrNode: HTMLTableRowElement = document.createElement('tr');
            newTable.appendChild(newTrNode);
            row.forEach(cell => {
                newTrNode.appendChild(this.createTdNode(cell));
            });
        });
        return newTable;
    }

    transposeArrayOfArrays(inputArrayOfArrays: string[][]): string[][] {
        const newArrayOfArrays: string[][] = [];
        for (let column: number = 0; column < inputArrayOfArrays[0].length; column++) {
            const newRow: string[] = [];
            for (let row: number = 0; row < inputArrayOfArrays.length; row++) {
                newRow.push(inputArrayOfArrays[row][column]);
            }
            newArrayOfArrays.push(newRow);
        }
        return newArrayOfArrays;
    }





    createLengthDiffTdNode(lengthDiff: number): HTMLTableCellElement {
        const newTdNode: HTMLTableCellElement = document.createElement('td');
        if (lengthDiff != 0) {
            newTdNode.innerText = Math.abs(lengthDiff) + (lengthDiff > 0 ? ' lång' : ' kort');
            newTdNode.setAttribute('id', 'wrongLength');
        }
        else {
            newTdNode.innerText = 'längd ok';
            newTdNode.setAttribute('id', 'rightLength');
        }
        return newTdNode;
    }

    createTdNode(cellValue: string): HTMLTableCellElement {
        const justZeroes: RegExp = /^\+?0*$/g; //example  000 or +00000
        const newTdNode: HTMLTableCellElement = document.createElement('td');
        newTdNode.innerText = String(cellValue);
        if (!justZeroes.test(cellValue)) {
            newTdNode.setAttribute('id', 'darker');
        }
        return newTdNode;
    }

    removeChildrenOfElement(elementId: HTMLElement): void {
        while (elementId.firstChild) {
            elementId.removeChild(elementId.firstChild);
        }
    }



    tdIsntHighlighted(td: HTMLTableCellElement): boolean {
        return td.style.backgroundColor !== 'powderblue';
    }

    highlightTdsWithMatchingText(tds: HTMLTableCellElement[], text: string): void {
        tds.filter(td => this.tdHasInnerText(td, text))
            .forEach(td => td.style.backgroundColor = 'powderblue');
    }

    tdHasInnerText(td: HTMLTableCellElement, text: string): boolean {
        return td.innerText == text;
    }


    removeHighlightingFromTDs(tds: HTMLTableCellElement[]): void {
        tds.forEach(td => td.style.backgroundColor = '');
    }

    getIndexOfElementRelativeToSiblings(elm: HTMLElement): number {
        return Array.from(elm.parentNode.children).indexOf(elm);
    }



}
