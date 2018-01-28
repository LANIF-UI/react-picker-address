# react-picker-address
自定义模块与组件的基础工程,来自[generator-rc](https://github.com/react-component/generator-rc)

## 使用

```
$ git clone https://github.com/LANIF-UI/react-picker-address.git
$ cd react-picker-address
$ yarn
$ yarn start
```

### 文件结构

```
- examples
 - index.html
 - index.js
- src
 - Component.js
 - index.js
- index.js
- tests
  - index.js
- package.json
```

#### package.json

#### tests/index.js

```js
import expect from 'expect.js';
import * as React from 'react';
import Component from 'rc-test';

describe('it', function(){
    it('works', function(){
        const component = (<Component/><a></a></Component>);
        expect(component).to.be(component);
    });
});
```

#### index.html

```
placeholder
```

### 启动

```
yarn
yarn start
```

* run `yarn run chrome-test` to see test
* open [http://localhost:8000/examples/](http://localhost:8000/examples/) to see demo
