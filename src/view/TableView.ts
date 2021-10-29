import { OriginalOrientationState } from './OriginalOrientationState';
import { OrientationState } from './OrientationState';
import { TransposedOrientationState } from './TransposedOrientationState';
import { Model } from '../model/Model';

export class TableView {

    private theTableDiv: HTMLElement;
    private _model: Model;
    private orientationState: OrientationState;

    constructor(element: HTMLElement, model: Model) {
        this.theTableDiv = element;
        this._model = model;
        this.orientationState = new TransposedOrientationState();
    }

    updateTableView(): void {
        this.orientationState.removeChildrenOfElement(this.theTableDiv);
        const button: HTMLButtonElement = this.createToggleOrientationButton();
        this.theTableDiv.appendChild(button);
        const table: HTMLTableElement =
            this.orientationState.createTable(this._model.rowsOfSplitStrings, this._model.rowLengthDiffs);
        this.theTableDiv.appendChild(table);
    }

    createToggleOrientationButton(): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button');
        button.innerText = 'Transpose table';
        button.addEventListener('click', () => {
            this.toggleOrientationState();
        });
        return button;
    }

    toggleOrientationState(): void {
        if (this.orientationState instanceof OriginalOrientationState) {
            this.orientationState = new TransposedOrientationState();
        } else {
            this.orientationState = new OriginalOrientationState();
        }
        this.updateTableView();
    }

}
