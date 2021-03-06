import './style.css';
import { TableView } from './view/TableView';
import { UseCase } from './usecase';
import { Model } from './model/Model';

const useCaseArrays: UseCase[] = [];
const theTableDiv: HTMLElement = document.getElementById('right');;
const model: Model = new Model();
const tableView: TableView = new TableView(theTableDiv, model);

useCaseArrays.push({
    namn: 'Example 1',
    beskrivning: 'Description 1',
    delningslangder: [3, 4, 3, 4, 2, 3, 3, 4, 2]
});
useCaseArrays.push({
    namn: 'Example 2',
    beskrivning: 'Description 2',
    delningslangder: [1, 12, 4, 1, 1, 12, 12, 12, 12, 12, 11, 11, 11, 2]
});


function createUseCaseButtons(useCases: UseCase[], divId: string): void {
    var div: HTMLElement = document.getElementById(divId);

    useCases.forEach(useCase => {
        var buttonNode: HTMLButtonElement = document.createElement('button');
        buttonNode.setAttribute('id', 'sidebutton');
        buttonNode.value = useCase.namn;
        buttonNode.textContent = useCase.namn;
        buttonNode.onclick = (): void => updateUseCaseInfo(useCase);
        div.appendChild(buttonNode);
    });
}

function updateUseCaseInfo(useCase: UseCase): void {
    document.getElementById('useCaseRubrik').textContent = useCase.namn;
    document.getElementById('useCaseBeskrivandeText').textContent = useCase.beskrivning;
    const asdf: HTMLTextAreaElement = document.getElementById('fieldLengthInput') as HTMLTextAreaElement;
    asdf.value = useCase.delningslangder.map((it) => String(it)).join(',');
}

function getValueFromInputElement(id: string): string {
    return (document.getElementById(id) as HTMLInputElement).value;
}

function setValueForInputElement(id: string, text: string): void {
    (document.getElementById(id) as HTMLInputElement).value = text;
}

function getValueFromTextAreaElement(id: string): string {
    return (document.getElementById(id) as HTMLTextAreaElement).value;
}

function lengthSplittingChosen(): boolean {
    return (document.getElementById('lengthsAlternative') as HTMLInputElement).checked;
}


function delaUppText(tableView: TableView, model: Model): void {

    var inputText: string = getValueFromTextAreaElement('textinput');
    var rowsOfStrings: string[] = inputText.split('\n').filter(rowString => rowString != '');

    if (lengthSplittingChosen()) {
        const textInfieldLengthInput: string = getValueFromInputElement('fieldLengthInput');
        if (textInfieldLengthInput !== '') {
            const desiredStringLengths: number[] = textInfieldLengthInput.split(',').map(a => Number(a));
            model.splitUsingGivenLengths(rowsOfStrings, desiredStringLengths);
            tableView.updateTableView();
        }
        else { alert('V??lj ett anv??ndningsfall p?? knapparna till v??nster'); }
    }
    else {
        var delimiterChar: string = getValueFromInputElement('delimiterBox');
        if (delimiterChar !== '') {
            model.splitUsingDelimeter(rowsOfStrings, delimiterChar);
            tableView.updateTableView();
        } else {
            alert('Enter delimeter character(s)');
        }
    }
}

function toggleInputChoice(event: MouseEvent): void {
    const clickedRadioButton: HTMLInputElement = event.target as HTMLInputElement;
    const lengthsFieldset: HTMLFieldSetElement = document.getElementById('fieldsetLengths') as HTMLFieldSetElement;
    const delimeterFieldset: HTMLFieldSetElement = document.getElementById('fieldsetDelimeter') as HTMLFieldSetElement;
    if (clickedRadioButton.id == 'lengthsAlternative') {
        lengthsFieldset.disabled = false;
        delimeterFieldset.disabled = true;
    } else {
        lengthsFieldset.disabled = true;
        delimeterFieldset.disabled = false;
    }

    console.log(clickedRadioButton.id);
}




function cleanfieldLengthInput(): void {
    var stringToClean: string = getValueFromInputElement('fieldLengthInput');
    //byter ut alla tecken mellan siffrorna mot ett ","
    var regex1: RegExp = /\D+/g;
    var cleanedString: string = stringToClean.replace(regex1, ',');
    //rensar start och slut fr??n eventuella ","
    var regex2: RegExp = /,?([\d,]+\d),?$/g;
    var result: RegExpExecArray = regex2.exec(cleanedString);
    if (result) {
        var trimmedCleanedString: string = result[1];
        setValueForInputElement('fieldLengthInput', trimmedCleanedString);
    }
}

function enterTestText(): void {
    const cleanedString: string =
        'abcdefghijklmnopqrstuvxyz??????\nabcdefghijklmnopqrstuvxyz????\nabcdefghijklmnopqrstuvxyz??????1';
    setValueForInputElement('textinput', cleanedString);
}


document.getElementById('splittaKnapp').addEventListener('click', () => delaUppText(tableView, model));
document.getElementById('fyllITestText').addEventListener('click', () => enterTestText());
document.getElementById('fieldLengthInput').addEventListener('click', () => cleanfieldLengthInput());
document.getElementById('fieldLengthInput').addEventListener('blur', () => cleanfieldLengthInput());
document.getElementById('lengthsAlternative').addEventListener('click', (event) => toggleInputChoice(event));
document.getElementById('delimeterAlternative').addEventListener('click', (event) => toggleInputChoice(event));
window.onload = (): void => createUseCaseButtons(useCaseArrays, 'left');

