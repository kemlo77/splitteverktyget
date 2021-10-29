export class Model {

    private _rowsOfSplitStrings: string[][] = [];
    private _rowLengthDiffs: number[] = [];

    public splitUsingGivenLengths(rowsOfStrings: string[], givenLengths: number[]): void {
        const newRowsOfSplitStrings: string[][] = [];
        const newRowLengthDiffs: number[] = [];
        const expectedTotalRowLength: number = givenLengths
            .reduce((a, b) => a + b, 0);
        rowsOfStrings
            .forEach(rowString => {
                newRowsOfSplitStrings.push(this.stringSplitter(rowString, givenLengths));
                newRowLengthDiffs.push(rowString.length - expectedTotalRowLength);
            });
        this._rowsOfSplitStrings = newRowsOfSplitStrings;
        this._rowLengthDiffs = newRowLengthDiffs;
    }

    private stringSplitter(inputString: string, partLengthArray: number[]): string[] {
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

    public splitUsingDelimeter(rowsOfStrings: string[], delimiterChar: string): void {
        const newRowsOfSplitStrings: string[][] = [];
        rowsOfStrings
            .forEach(rowString => {
                newRowsOfSplitStrings.push(rowString.split(delimiterChar));
            });
        this._rowsOfSplitStrings = newRowsOfSplitStrings;
        this._rowLengthDiffs = [];
    }

    get rowsOfSplitStrings(): string[][] {
        return this._rowsOfSplitStrings;
    }

    get rowLengthDiffs(): number[] {
        return this._rowLengthDiffs;
    }

}