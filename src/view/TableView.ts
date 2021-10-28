import { OriginalOrientationState } from './OriginalOrientationState';
import { OrientationState } from './OrientationState';
import { TransposedOrientationState } from './TransposedOrientationState';

export class TableView {

    private theTableDiv: HTMLElement;

    private orientationState: OrientationState;

    constructor(element: HTMLElement) {
        this.theTableDiv = element;
        //this.orientationState = new OriginalOrientationState();
        this.orientationState = new TransposedOrientationState();
    }

    updateTableView(rowsOfCellValues: string[][], checkedLengthDiffArray: number[]): void {

        this.orientationState.removeChildrenOfElement(this.theTableDiv);

        this.theTableDiv.appendChild(this.createToggleOrientationButton());


        const doTransposedTable: boolean = (document.getElementById('transposeCheckBox') as HTMLInputElement).checked;
        let table: HTMLTableElement;

        if (doTransposedTable) {
            table = this.orientationState.createTable(rowsOfCellValues, checkedLengthDiffArray);
        }
        else {
            table = this.orientationState.createTable(rowsOfCellValues, checkedLengthDiffArray);
        }
        this.theTableDiv.appendChild(table);


    }

    toggleOrientationState(): void {
        if (this.orientationState instanceof OriginalOrientationState) {
            this.orientationState = new TransposedOrientationState();
        } else {
            this.orientationState = new OriginalOrientationState();
        }
    }

    createToggleOrientationButton(): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button');
        button.innerText = 'Transpose table';
        button.addEventListener('click', () => {
            this.toggleOrientationState();
        });
        return button;
    }

}
