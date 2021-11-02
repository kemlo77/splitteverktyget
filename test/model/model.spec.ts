import { expect } from 'chai';
import { Model } from '../../src/model/Model';

describe('Model', () => {

    it('splitUsingGivenLengths', () => {
        const model: Model = new Model();
        const rowsOfStrings: string[] = ['asdfghjkl', 'qwertyuio'];
        const givenLengths: number[] = [2, 3, 4];
        model.splitUsingGivenLengths(rowsOfStrings, givenLengths);
        expect(model.rowsOfSplitStrings.length).to.equal(2);
        expect(model.rowsOfSplitStrings[0]).to.deep.equal(['as', 'dfg', 'hjkl']);
        expect(model.rowsOfSplitStrings[1]).to.deep.equal(['qw', 'ert', 'yuio']);
    });




});