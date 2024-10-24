# module

## 基本使用

**node环境运行**

在node运行环境中，每个文件就相当于一个module对象，

在node环境中，重新定义exports会报错，可知：在每个js文件执行前，node会在此js作用域，已经定义了exports



```js
// moduleA.js
function sum(num1, num2) {
  return num1 + num2
}
let name = 'why'
let age = 18

module.exports = {
  name,
  age,
  sum
}

// main.js
const { name , age, sum } = require('./moduleA.js')
console.log(name, age, sum(10, 20))	// why 18 30
```



```js
let age = 18
let sex = 'male'
module.exports = {
    sex,
}
exports.age = 18

// 导出内容为 { sex: 'male' }
// 可知：在js文件执行前（重点：前）
// node会执行
// 见下基本原理
```



## 基本原理，

两种用法

```js
module.exports = {}
exports = module.exports
```

本质是将module.exports 指向的对象传出去，

## 引入规则

1、首先查找核心模块

2、按照路径查找，没有文件，查找对应文件夹下的index.js

1. 当作文件查找
   1. 有后缀名，直接查找
   2. 无后缀名，是否存在无后缀名的此文件，如果没有，后缀则匹配：js，json，node
2. 查找对应文件夹下的index文件，

3、逐层向上找node_module下文件

## 模块加载细节

1、模块在第一次引入时，其中的js代码会被执行一次

2、多次引用，会缓存，最终只会执行一次

- 每个模快module有一个属性：loaded
- false表示没有加载，true表示已经加载了，true：完全加载，本文件执行完了

3、循环引入，加载顺序

- 引用关系是一种图结构
- 图结构的遍历方式：深度优先搜索、广度优先搜索
- node使用深度优先搜索，就是代码执行顺序（同步执行）

## commonjs优缺点

1. 同步加载执行，可能会阻塞程序
   - 使用同步原因：适用场景多为服务器，多为本地文件，一般不影响性能
   - es module为异步，原因：多为网络请求，

## es6中模块的this

ES6 的模块自动采用严格模式，不管你有没有在模块头部加上`"use strict";`

严格模式：禁止`this`指向全局对象，

在chrome中，模块的this为undefined

但是在html中，以普通js引入则为window

```
<script src="./test.js" type="module"></script>	// 文件中this为undefined
<script src="./test.js"></script>	// 文件中this为window在chrome，或者浏览器中
```

