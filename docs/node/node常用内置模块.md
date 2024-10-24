# node常用内置模块

## path

常用的path方法

```js
let path = require('path')
let basePath = 'X:\学习笔记\node\code\01_js代码执行'
let fileName = 'main.js'

// 路径拼接 rosolve
// 会对传入的参数进行处理，当以 /, ./, ../, 开头，处理时以当前文件路径进行处理
let filePath = path.resolve(basePath, fileName)

console.log(path.dirname(filePath))     // 文件外面路径
console.log(path.basename(filePath))    // 文件名
console.log(path.extname(filePath))     // 文件扩展名

// 路径拼接 join
// 在两个之间，添加对应操作系统的分隔符
const filePath2 = path.join(basePath, fileName)
```



## File System

### 一般fs使用的三种方式

大多数API提供三种调用方式

1. 同步执行：代码阻塞
2. 异步回调：传入回调函数
3. 异步promise：

```js
const fs = require('fs')

// 读取文件信息
// 1、同步操作
let filePath = './test.txt'
let info1 = fs.statSync(filePath)
console.log(info1)

// 方式二，异步回调
fs.stat(filePath, (err, info) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('async:', info)
})

// 方式三：promise
fs.promises.stat(filePath).then((info) => {
    console.log('promise:', info)
}).catch(err => {
    console.log(err)
})

console.log('end')
```

### 文件描述符

node中，将不同系统调用文件，进行封装

```
const fs = require('fs')
// 文件描述符 fd

fs.open('./test.txt', (err, fd) => {
    if (err) {
        console.log(err)
        return
    }
    console.log(fd)
    fs.fstat(fd, (err, info) => {
        console.log(info)
    })
})
```

### 文件的读写

```js
// 写入文件
const content = 'hello echo'
fs.writeFile('./test.txt', content, (err) => {
    console.log(err)
})
```

```js
// 读取文件
fs.readFile('./test.txt', { encoding: 'utf-8' }, (err, data) => {
    console.log(data)
})
```

### 读取文件的相对路径

文件读取的相对路径，是相对于process.cwd()

## events

基础使用方法

```
const EventEmitter = require('events')
// 创建发射器（有点像事件总线）
const emitter = new EventEmitter()

// 监听某一个事件
let listener1 = (args) => {
    console.log('监听到click，1')
}
emitter.on('click', listener1)

let listener2 = (args) => {
    console.log('监听到click，2')
}
emitter.on('click', listener2)

// 发射事件
setTimeout(() => {
    emitter.emit('click', 'echo')
    emitter.off('click', listener2)
}, 2000)

// 不常用方法
console.log(emitter.eventNames())   // 绑定的事件名
console.log(emitter.listenerCount('click')) // 此事件绑定了几个函数
console.log(emitter.listeners('click')) // 此事件绑定的函数
```

