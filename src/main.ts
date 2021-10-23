import './style.css';
import { UseCase } from './usecase';

const useCaseArrays: UseCase[] = [];
useCaseArrays.push({
    namn: 'Exempel 1',
    beskrivning: 'Beskrivning 1',
    delningslangder: [1, 12, 4, 1, 1, 12, 12, 12, 12, 12, 12, 12, 12, 2]
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


//Texten i boxen textinput bearbetas (splittas) givet dom längder som står i boxen "fieldLengthInput"
function delaUppText(): void {
    var delimiterChar: string = (document.getElementById('delimiterBox') as HTMLInputElement).value;

    //dom fältlängder som står i textboxen "fieldLengthInput" används. (även om användaren angivit dom själv)
    const textInfieldLengthInput: string = (document.getElementById('fieldLengthInput') as HTMLInputElement).value;
    const textLengthArray: number[] = textInfieldLengthInput.split(',').map(a => Number(a));


    const kommaStringLength: number = textLengthArray
        .map(a => Number(a))
        .reduce((a, b) => a + b, 0);

    //läser in texten i input-lådan och delar radvis
    var inputText: string = (document.getElementById('textinput') as HTMLTextAreaElement).value;
    var inputRowsArray: string[] = inputText.split('\n');

    //delar upp varje sträng i dom givna längderna (resultatet blir en array of arrays)
    const splittedInputRowsArraysArray: string[][] = [];

    //längden på varje sträng kontrolleras och diffen sparas i en array
    const checkedLengthDiffArray: number[] = [];

    //kolla om texten ska delas m.a.p nåt tecken. T.ex CSV filer m.a.p ","
    if (delimiterChar == '') {
        if (textInfieldLengthInput !== '') {
            for (let i: number = 0; i < inputRowsArray.length; i++) {
                //kollar att det inte bara är en tom sträng
                if (inputRowsArray[i] != '') {
                    //kollar längden på strängen jämfört med komma-strängens summa
                    var checkLengthDiff: number = inputRowsArray[i].length - kommaStringLength;
                    checkedLengthDiffArray.push(checkLengthDiff);
                    //sparar strängen
                    splittedInputRowsArraysArray.push(stringSplitter(inputRowsArray[i], textLengthArray));
                }
            }
            //skriv ut resultatet som en <table>
            removeChildNodes('right');
            createHtmlTable(splittedInputRowsArraysArray, checkedLengthDiffArray, 'right', true);
        }
        else { alert('Välj ett användningsfall på knapparna till vänster'); }
    }
    else {
        for (let i: number = 0; i < inputRowsArray.length; i++) {
            //kollar att det inte bara är en tom sträng
            if (inputRowsArray[i] != '') {
                //sparar strängen
                const splittedInputRowArray: string[] = inputRowsArray[i].split(delimiterChar);
                splittedInputRowsArraysArray.push(splittedInputRowArray);
                //kollar längden på strängen jämfört med komma-strängens summa
                const numberOfDelimiterChars: number = splittedInputRowArray.length - 1;
                let checkLengthDiff: number = 0;
                //om det finns fältlängder (komma-värden) så kan man jämföra och se.
                if (kommaStringLength != 0) {
                    checkLengthDiff = inputRowsArray[i].length - numberOfDelimiterChars - kommaStringLength;
                }
                checkedLengthDiffArray.push(checkLengthDiff);
            }
        }
        //skriv ut resultatet som en <table>
        removeChildNodes('right');
        createHtmlTable(splittedInputRowsArraysArray, checkedLengthDiffArray, 'right', false);
    }

}

//skapar en table under angivet element (en div?!)
function createHtmlTable(arrayOfArrays: string[][], checkedLengthDiffArray: number[], divId: string
    , includeLengthDiff: boolean): void {

    const doTransposedTable: boolean = (document.getElementById('transposeCheckBox') as HTMLInputElement).checked;


    //hitta den array i arrayOfArrays som är längst
    var largestArrayLength: number = 0;
    for (let z: number = 0; z < arrayOfArrays.length; z++) {
        if (arrayOfArrays[z].length > largestArrayLength) {
            largestArrayLength = arrayOfArrays[z].length;
        }
    }

    //om lengthDiff ska visas behöver th-raden ha extra colspan
    var extraColspan: number = 0;
    if (includeLengthDiff) { extraColspan += 1; }


    //skapar "table"-elementet
    var rightDiv: HTMLElement = document.getElementById(divId);
    var theTableNode: HTMLTableElement = document.createElement('table');
    rightDiv.appendChild(theTableNode);

    //skapar första raden med TH-element
    var firstTrNode: HTMLTableRowElement = document.createElement('tr');
    theTableNode.appendChild(firstTrNode);
    var newThNode: HTMLTableCellElement = document.createElement('th');
    newThNode
        .setAttribute('colspan', (doTransposedTable ? arrayOfArrays.length : largestArrayLength + extraColspan) + '');
    firstTrNode.appendChild(newThNode);
    newThNode.innerText = 'Output:';

    if (doTransposedTable) {
        //skapar andra raden med TD-element (feedback på längd)				
        if (includeLengthDiff) {
            var secondTrNode: HTMLTableRowElement = document.createElement('tr');
            theTableNode.appendChild(secondTrNode);
            for (let p: number = 0; p < checkedLengthDiffArray.length; p++) {
                secondTrNode.appendChild(createLengthDiffTdNode(checkedLengthDiffArray[p]));
            }
        }

        //skapar tredje raden med TD-element (radera-knappar)
        var thirdTrNode: HTMLTableRowElement = document.createElement('tr');
        theTableNode.appendChild(thirdTrNode);
        for (let x: number = 0; x < arrayOfArrays.length; x++) {
            thirdTrNode.appendChild(createDeleteTdNode());
        }

        //skapar rader med nya td-element
        for (let q: number = 0; q < largestArrayLength; q++) {
            var newTrNode: HTMLTableRowElement = document.createElement('tr');
            theTableNode.appendChild(newTrNode);
            for (let z: number = 0; z < arrayOfArrays.length; z++) {
                newTrNode.appendChild(createTdNode(arrayOfArrays[z][q], doTransposedTable));
            }
        }
    }
    else {
        for (let r: number = 0; r < arrayOfArrays.length; r++) {
            var newTrNode: HTMLTableRowElement = document.createElement('tr');
            theTableNode.appendChild(newTrNode);

            //lägger till längd-diff-td
            if (includeLengthDiff) {
                newTrNode.appendChild(createLengthDiffTdNode(checkedLengthDiffArray[r]));
            }

            //lägger in td-element med värden
            for (let t: number = 0; t < arrayOfArrays[r].length; t++) {
                newTrNode.appendChild(createTdNode(arrayOfArrays[r][t], doTransposedTable));
            }
        }
    }
}

function createDeleteTdNode(): HTMLTableCellElement {
    var newTdNode: HTMLTableCellElement = document.createElement('td');
    newTdNode.innerText = 'radera';
    newTdNode.onclick = raderaKolumn;
    return newTdNode;
}

function createLengthDiffTdNode(lengthDiff: number): HTMLTableCellElement {
    var newTdNode: HTMLTableCellElement = document.createElement('td');
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

function createTdNode(cellValue: string, tableIsTransposed: boolean): HTMLTableCellElement {
    //regex för att kolla om värdet i cellen är typ 00000 eller +00000
    var patt: RegExp = /^\+?0*$/g;
    var newTdNode: HTMLTableCellElement = document.createElement('td');
    newTdNode.innerText = String(cellValue);
    if (tableIsTransposed) {
        newTdNode.onclick = hittaLikaIRad;
    }
    else {
        newTdNode.onclick = hittaLikaIKolumn;
    }
    if (!patt.test(cellValue)) {
        newTdNode.setAttribute('id', 'darker');
    }
    return newTdNode;
}

function removeChildNodes(elementId: string): void {
    var myNode: HTMLElement = document.getElementById(elementId);
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

}




//om man klickar i en cell så körs denna funktion
//den kollar i genom andra td-celler på samma rad i table. Celler som har samma värde som den valda får blå bakgrund
//klickar man på en cell som redan har blå bakgrund så tas ändras hela raden till normal bakgrund igen
function hittaLikaIRad(): void {
    var highlightColor: string = 'powderblue';
    var valdText: string = this.innerText;
    var tdNodes: HTMLTableCellElement[] = this.parentElement.getElementsByTagName('td');
    if (this.style.backgroundColor == highlightColor) {
        for (let j: number = 0; j < tdNodes.length; j++) {
            tdNodes[j].style.backgroundColor = '';
        }
    }
    else {
        for (let i: number = 0; i < tdNodes.length; i++) {
            if (tdNodes[i].innerText == valdText) {
                tdNodes[i].style.backgroundColor = highlightColor;
            }
            else {
                tdNodes[i].style.backgroundColor = '';
            }
        }
    }
}

//om man klickar i en cell så körs denna funktion
//den kollar i genom andra td-celler på samma kolumn i table. Celler som har samma värde som den valda får blå bakgrund
//klickar man på en cell som redan har blå bakgrund så tas ändras hela kolumnen till normal bakgrund igen			
function hittaLikaIKolumn(): void {
    var highlightColor: string = 'powderblue';
    var valdText: string = this.innerText;
    var tdChildNumber: number = getIndex(this);
    var trNodes: HTMLTableRowElement[] = this.parentElement.parentElement.getElementsByTagName('tr');
    if (this.style.backgroundColor == highlightColor) {
        for (let y: number = 1; y < trNodes.length; y++) {
            (trNodes[y].children[tdChildNumber] as HTMLTableCellElement).style.backgroundColor = '';
        }
    }
    else {
        for (let y: number = 1; y < trNodes.length; y++) {
            if ((trNodes[y].children[tdChildNumber] as HTMLTableCellElement).innerText == valdText) {
                (trNodes[y].children[tdChildNumber] as HTMLTableCellElement).style.backgroundColor = highlightColor;
            }
            else {
                (trNodes[y].children[tdChildNumber] as HTMLTableCellElement).style.backgroundColor = '';
            }
        }
    }
}


//raderar en kolumn.
function raderaKolumn(): void {
    var tdChildNumber: number = getIndex(this);
    var trNodes: HTMLTableRowElement[] = this.parentElement.parentElement.getElementsByTagName('tr');
    //hoppar över första TR eftersom den innehåller TH-elementet
    for (let y: number = 1; y < trNodes.length; y++) {
        trNodes[y].removeChild(trNodes[y].children[tdChildNumber]);
    }
    //ändrar bredden på th-elementet (colspan)
    var thElementet: HTMLTableCellElement = trNodes[0].getElementsByTagName('th')[0];
    thElementet.setAttribute('colspan', String(Number(thElementet.getAttribute('colspan')) - 1));
}


//returnerar ett elements index i förhållande till element på samma nivå (som har samma parent)
function getIndex(elm: HTMLElement): number {
    return Array.from(elm.parentNode.children).indexOf(elm);
}


//Splittar upp en sträng enligt längder givet i en array. Returnerar en array med delarna
function stringSplitter(dataString: string, partLengthArray: number[]): string[] {
    var infoArray: string[] = [];
    var slicePosition: number = 0;
    for (let j: number = 0; j < partLengthArray.length; j++) {
        var currentSlice: string = dataString.slice(slicePosition, slicePosition + partLengthArray[j] * 1);
        infoArray.push(currentSlice);
        slicePosition += partLengthArray[j] * 1;
    }
    return infoArray;
}


//Kollar i boxen för komma-värden och städar bort text/whitespace. Separerar nummer med ","
function cleanfieldLengthInput(): void {
    var stringToClean: string = (document.getElementById('fieldLengthInput') as HTMLInputElement).value;
    //byter ut alla tecken mellan siffrorna mot ett ","
    var regex1: RegExp = /\D+/g;
    var cleanedString: string = stringToClean.replace(regex1, ',');
    //rensar start och slut från eventuella ","
    var regex2: RegExp = /,?([\d,]+\d),?$/g;
    var result: RegExpExecArray = regex2.exec(cleanedString);
    var trimmedCleanedString: string = result[1];
    (document.getElementById('fieldLengthInput') as HTMLInputElement).value = trimmedCleanedString;
}


//när textboxen "fieldLengthInput" uppdaterats körs denna funktion
function fieldLengthInputChanged(): void {
    cleanfieldLengthInput();
}





//rensar upp det trace man får när testkörningen inte hittar förväntad sträng
function cleanTheTrace(): void {
    var stringToClean: string = (document.getElementById('textinput') as HTMLInputElement).value;
    //byter ut futt och komma mot ny rad
    var regex1: RegExp = /[',]/g;
    var cleanedString: string = stringToClean.replace(regex1, '\n');
    //tar bort alla rader efter "	at ..."
    var regex2: RegExp = /\s+at\s+.+/g;
    cleanedString = cleanedString.replace(regex2, '');
    //Tar bort två ytterligare strängar
    cleanedString = cleanedString.replace('java.lang.AssertionError: Raden ', '');
    cleanedString = cleanedString.replace(' ska finnas i resultatet rader som finns ', '');
    (document.getElementById('textinput') as HTMLInputElement).value = cleanedString;
}




document.getElementById('splittaKnapp').addEventListener('click', () => delaUppText());
document.getElementById('rensaTraceKnapp').addEventListener('click', () => cleanTheTrace());
document.getElementById('fieldLengthInput').addEventListener('click', () => fieldLengthInputChanged());
window.onload = (): void => createUseCaseButtons(useCaseArrays, 'left');
















