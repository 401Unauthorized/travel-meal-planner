const { dateDifference, chooseAtRandom } = require('./index');

test('date difference when 2 days apart', () => {
    expect(dateDifference(1675167347, 1675340147)).toBe(2);
});

test('date difference when the same time', () => {
    expect(dateDifference(1675167347, 1675167347)).toBe(0);
});

test('choose random item', () => {
    const options = [{ id: 1 }, { id: 2 }];
    const res = chooseAtRandom(options, 1);
    expect(res.id).toBe(2);
});

test('choose random item - alternate', () => {
    const options = [{ id: 1 }, { id: 2 }];
    const res = chooseAtRandom(options, 2);
    expect(res.id).toBe(1);
});

test('choose random item - no options', () => {
    const options = [];
    const res = chooseAtRandom(options);
    expect(res).toBe(undefined);
});

test('choose random item - only one option', () => {
    const options = [{ id: 1 }];
    const res = chooseAtRandom(options);
    expect(res.id).toBe(1);
});

test('choose random item - only one option - will not skip itself', () => {
    const options = [{ id: 1 }];
    const res = chooseAtRandom(options, 1);
    expect(res.id).toBe(1);
});