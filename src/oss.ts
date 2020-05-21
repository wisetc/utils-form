import { Base64 } from 'js-base64';
import { Crypto } from 'ezcrypto';
import axios from 'axios';
import { v1 as uuid } from 'uuid';
import urljoin from 'url-join';

export interface IPolicyText {
    expiration: string;
    conditions: [any[]];
}

export interface IOptions {
    host: string;
    accessid: string;
    accesskey: string;
    policyText?: IPolicyText;
    basePath?: string;
}

export namespace OSSAPI {
    let _host: string = '';
    let _accessid: string = '';
    let _accesskey: string = '';
    let _policyText: IPolicyText = {
        expiration: '2050-01-01T12:00:00.000Z', //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
        conditions: [
            ['content-length-range', 0, 1048576000], // 设置上传文件的大小限制
        ],
    };
    // 上传的文件保存的默认路径
    let _basePath: string = '';

    interface IStaticConfig {
        policy: string;
        signature: string;
        success_action_status: string;
    }

    interface IParams extends IStaticConfig {
        key: string;
        OSSAccessKeyId: string;
    }

    let staticConfig: IStaticConfig | null = null;

    function setOptions(opts: IOptions) {
        _host = opts.host;
        _accessid = opts.accessid;
        _accesskey = opts.accesskey;
        if (opts.policyText) {
            _policyText = opts.policyText;
        }

        if (typeof opts.basePath === 'string') {
            _basePath = opts.basePath;
        }
    }

    export function bootstrap(opts: IOptions) {
        if (_host === '') {
            setOptions(opts);
        }
    }

    export async function upload(file: File): Promise<string> {
        const name = (function (s) {
            const execResult = /\..+$/.exec(s);
            const ext = execResult ? execResult[0] : '';
            return uuid() + ext;
        })(file.name);

        const params = getParams(name);
        if (params === null) {
            return Promise.reject(new Error('未初始化。'));
        }

        const formData = new FormData();
        for (const k in params) {
            formData.append(k, params[k]);
        }
        formData.append('file', file);

        const headers = {
            'Content-Type': 'multipart/form-data;',
        };

        try {
            await axios.post(_host, formData, {
                headers,
            });

            return urljoin(_host, params.key);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    function getStaticConfig(): IStaticConfig {
        const policy = Base64.encode(JSON.stringify(_policyText));
        const bytes = Crypto.HMAC(Crypto.SHA1, policy, _accesskey, {
            asBytes: true,
        });
        const signature = Crypto.util.bytesToBase64(bytes);
        return {
            policy,
            signature,
            success_action_status: '200', //让服务端返回200,不然，默认会返回204, https://help.aliyun.com/document_detail/31988.html?spm=a2c4g.11186623.2.4.1Khbil#reference_smp_nsw_wdb
        };
    }

    export function getParams(name?: string): IParams | null {
        if (_host === '') return null;

        if (staticConfig === null) {
            staticConfig = getStaticConfig();
        }

        const key =
            name && name.includes('/')
                ? name
                : urljoin(_basePath, name || uuid());

        return {
            key,
            OSSAccessKeyId: _accessid,
            ...staticConfig,
        };
    }
}
