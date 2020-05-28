# 表单工具方法。

这个前端的工具包中包含了一些与表单相关的方法，其中有 ali-oss 上传文件的封装，可用于浏览器。

## API 列表

- oss
  - OSSAPI
    - bootstrap
    - upload
- pk
  - `create$uid`
  - `$uid`
  - `$KEY`

```ts
function upload(file: File): Promise<string>;
```

## 安装

```bash
$ npm i -S @wisetc/utils-form@latest
```

## 使用方法

从包中引入 oss,

```js
// lib/a.js

import { oss } from '@wisetc/utils-form';

const { OSSAPI } = oss;

const accessid = 'id';
const accesskey = 'key';
const host = 'http://example.oss-cn-hangzhou.aliyuncs.com';

OSSAPI.bootstrap({
  accessid,
  accesskey,
  host,
  basePath: 'dingtalk/uploads'
});

export const uploadFile = OSSAPI.upload;
```

使用 uploadFile,

```js
// app.js
import { uploadFile } from './lib/a';

function onChange(e) {
  // assume there is a file input.
  const files = this.input.files;
  const [file] = files;
  console.log({ loadingState: 'LOADING_STATE.LOADING' });
  console.log({ filename: '上传中...' });
  uploadFile(file)
    .then(url => {
      console.log({ loadingState: 'LOADING_STATE.LOADED' });
      console.log(file.name);

      // 得到了 url
      console.log(url);
    })
    .catch(err => {
      console.error(err.message);
      console.log({ loadingState: 'LOADING_STATE.LOAD_ERROR' });
      console.log({ filename: '' });
    });
}
```
