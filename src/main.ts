import './style.css';
import { TableView } from './view/TableView';
import { UseCase } from './usecase';

const useCaseArrays: UseCase[] = [];
const theTableDiv: HTMLElement = document.getElementById('right');;
const tableView: TableView = new TableView(theTableDiv);
useCaseArrays.push({
    namn: 'Exempel 1',
    beskrivning: 'Beskrivning 1',
    delningslangder: [3, 4, 3, 4, 2, 3, 3, 4, 2]
});
useCaseArrays.push({
    namn: 'Exempel 2',
    beskrivning: 'Beskrivning 2',
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


//Texten i boxen textinput bearbetas (splittas) givet dom längder som står i boxen "fieldLengthInput"
function delaUppText(tableView: TableView): void {

    var delimiterChar: string = getValueFromInputElement('delimiterBox');

    //dom fältlängder som står i textboxen "fieldLengthInput" används. (även om användaren angivit dom själv)
    const textInfieldLengthInput: string = getValueFromInputElement('fieldLengthInput');
    const desiredStringLengths: number[] = textInfieldLengthInput.split(',').map(a => Number(a));


    const expectedRowLength: number = desiredStringLengths
        .map(a => Number(a))
        .reduce((a, b) => a + b, 0);

    //läser in texten i input-lådan och delar radvis
    var inputText: string = getValueFromTextAreaElement('textinput');
    var rowsOfStrings: string[] = inputText.split('\n').filter(rowString => rowString != '');

    //delar upp varje sträng i dom givna längderna (resultatet blir en array of arrays)
    const rowsOfSplitStrings: string[][] = [];

    //längden på varje sträng kontrolleras och diffen sparas i en array
    const rowLengthDiffs: number[] = [];

    //kolla om texten ska delas m.a.p nåt tecken. T.ex CSV filer m.a.p ","
    if (delimiterChar == '') {
        if (textInfieldLengthInput !== '') {
            rowsOfStrings
                .forEach(rowString => {
                    rowLengthDiffs.push(rowString.length - expectedRowLength);
                    rowsOfSplitStrings.push(stringSplitter(rowString, desiredStringLengths));
                });
            tableView.updateTableView(rowsOfSplitStrings, rowLengthDiffs);

        }
        else { alert('Välj ett användningsfall på knapparna till vänster'); }
    }
    else {
        rowsOfStrings
            .forEach(rowString => {
                rowsOfSplitStrings.push(rowString.split(delimiterChar));
            });

        tableView.updateTableView(rowsOfSplitStrings, rowLengthDiffs);
    }

}



function stringSplitter(inputString: string, partLengthArray: number[]): string[] {
    var stringSlices: string[] = [];
    var slicePosition: number = 0;
    partLengthArray
        .map(it => Number(it))
        .forEach(sliceSize => {
            var currentSlice: string = inputString.slice(slicePosition, slicePosition + sliceSize);
            stringSlices.push(currentSlice);
            slicePosition += sliceSize;
        });
    return stringSlices;
}

function cleanfieldLengthInput(): void {
    var stringToClean: string = getValueFromInputElement('fieldLengthInput');
    //byter ut alla tecken mellan siffrorna mot ett ","
    var regex1: RegExp = /\D+/g;
    var cleanedString: string = stringToClean.replace(regex1, ',');
    //rensar start och slut från eventuella ","
    var regex2: RegExp = /,?([\d,]+\d),?$/g;
    var result: RegExpExecArray = regex2.exec(cleanedString);
    var trimmedCleanedString: string = result[1];
    setValueForInputElement('fieldLengthInput', trimmedCleanedString);
}

function enterTestText(): void {
    const cleanedString: string =
        'abcdefghijklmnopqrstuvxyzåäö\nabcdefghijklmnopqrstuvxyzåä\nabcdefghijklmnopqrstuvxyzåäö1';
    setValueForInputElement('textinput', cleanedString);
}


document.getElementById('splittaKnapp').addEventListener('click', () => delaUppText(tableView));
document.getElementById('fyllITestText').addEventListener('click', () => enterTestText());
document.getElementById('fieldLengthInput').addEventListener('click', () => cleanfieldLengthInput());
window.onload = (): void => createUseCaseButtons(useCaseArrays, 'left');

