import { $uid } from '../src/pk';

describe('pk', () => {
    test('$uid', () => {
        expect($uid()).toBe(0);
        expect($uid() !== $uid()).toBe(true);
    });
});
