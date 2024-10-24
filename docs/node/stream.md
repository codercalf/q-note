# Stream

## 流读取常见方法

```js
const fs = require('fs')
const reader = fs.createReadStream('./test.txt', {
    start: 2,
    end: 5,
    highWaterMark: 2
})
// 打开文件
reader.on('open', () => {
    console.log('file open')
})

reader.on('data', (data) => {
    console.log(data)
    // 暂停读取
    reader.pause()
    setTimeout(() => {
        // 继续读取文件
        reader.resume()
    }, 1000)
})
// 关闭文件
reader.on('close', () => {
    console.log('文件被关闭')
})
```

## 流写入常见方法

```js
const fs = require('fs')
const writer = fs.createWriteStream('./test.txt', {
    flags: 'a',
    start: 4
})
// 写入流
writer.write('你好', (err) => {
    if (err) return
    console.log('wirte succes')
})

writer.write('袁大头', (err) => {
    if (err) return
    console.log('wirte succes')
})

// 关闭文件
// writer.close()
writer.end('close')
writer.on('close', (err) => {
    if (err) return
    console.log('closed')
})
```

## 通过流复制文件

```js
const fs = require('fs')

const reader = fs.createReadStream('./test.txt')
const writer = fs.createWriteStream('./foo.txt')
reader.pipe(writer)
```

