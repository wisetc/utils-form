import { OSSAPI } from '../src/oss';

describe('oss', () => {
    test('sample', () => {
        expect('sample').toBeTruthy();
    });

    test('getParams', () => {
        expect(OSSAPI.getParams('name.pdf')).toBe(null);

        OSSAPI.bootstrap({
            accessid: 'id',
            accesskey: 'key',
            host: 'http://test.oss-cn-hangzhou.aliyuncs.com',
            basePath: 'dingtalk/uploads'
        });
        expect(
            OSSAPI.getParams('name.pdf').key.startsWith('dingtalk/uploads')
        ).toBe(true);
    });
});
