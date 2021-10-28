export abstract class OrientationState {

    public abstract createTable(rowsOfCellValues: string[][], checkedLengthDiffArray: number[]): HTMLTableElement;

    protected createRawHtmlTable(rowsOfCellValues: string[][]): HTMLTableElement {
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

    protected transposeArrayOfArrays(inputArrayOfArrays: string[][]): string[][] {
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

    protected createLengthDiffTdNode(lengthDiff: number): HTMLTableCellElement {
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

    protected createTdNode(cellValue: string): HTMLTableCellElement {
        const justZeroes: RegExp = /^\+?0*$/g; //example  000 or +00000
        const newTdNode: HTMLTableCellElement = document.createElement('td');
        newTdNode.innerText = String(cellValue);
        if (!justZeroes.test(cellValue)) {
            newTdNode.setAttribute('id', 'darker');
        }
        return newTdNode;
    }

    public removeChildrenOfElement(elementId: HTMLElement): void {
        while (elementId.firstChild) {
            elementId.removeChild(elementId.firstChild);
        }
    }

    protected tdIsntHighlighted(td: HTMLTableCellElement): boolean {
        return td.style.backgroundColor !== 'powderblue';
    }

    protected highlightTdsWithMatchingText(tds: HTMLTableCellElement[], text: string): void {
        tds.filter(td => this.tdHasInnerText(td, text))
            .forEach(td => td.style.backgroundColor = 'powderblue');
    }

    protected tdHasInnerText(td: HTMLTableCellElement, text: string): boolean {
        return td.innerText == text;
    }

    protected removeHighlightingFromTDs(tds: HTMLTableCellElement[]): void {
        tds.forEach(td => td.style.backgroundColor = '');
    }

    protected getIndexOfElementRelativeToSiblings(elm: HTMLElement): number {
        return Array.from(elm.parentNode.children).indexOf(elm);
    }

}