# Buffer

```
const message = 'hello echo'

// 创建方式1，不推荐
const buffer = new Buffer(message)
console.log(buffer)

// 创建方式二
const buffer = Buffer.from(message)
console.log(buffer)
console.log(buffer.toString())

// 创建方式三
const buffer = Buffer.alloc(8)
buffer[0] = 0xaf
console.log(buffer)
```

## 关于编码

注意：假如有两个编码，A和B，A编码转为B编码，再从B编码转回A编码，不可

code

```js
// 测试时默认编码 utf8
const buf = Buffer.allocUnsafe(3)
for (let i=0; i<3; i++) {
    buf[i] = i + 97;
}

console.log(buf)	// <Buffer 61 62 63>
console.log(buf.toString())	// abc
// 改为无效的 utf8 编码
buf[0] = 0xb0
buf[2] = 0xa5
// 修改之后
console.log(buf)	// <Buffer b0 62 a5>
console.log(buf.toString())	// �b�

let str = buf.toString()
// 编码已经变了
console.log(Buffer.from(str))	// <Buffer ef bf bd 62 ef bf bd>
console.log(str)	// �b�

```

**编码转为二进制格式不会失真**

例子：复制一个图片

```js
const fs = require('fs')

fs.readFile('./image.png', (err, data) => {
    if (err) throw err
    let body = '' + data.toString('binary')	// 此处和下面都要用binary编码
    fs.writeFile('./image_copy.png', body, 'binary', (err1) => {
        if (err1) throw err1
        console.log('file copy success')
    })
})
```

## 文件上传

根据上面，可以进行binary编码，进行处理数据

```js
const fs= require('fs')
const http = require('http')
const qs = require('querystring')
// 创建一个web服务器
const server = http.createServer((req, res) => {
    let count = 1
    let body = '';
    // 此处设置编码，下面的data，会自动解码
    req.setEncoding('binary')
    req.on('data', (data) => {  // 根据上面设置，data解码为binary数据，不是buffer了
        body += data
    })
    req.on('end', () => {
        // 文件较大，传输时分多次
        // 第一次的头需要截掉
        // 最后一个的尾部也需要截取
        // 中间获取到的数据不用处理
        const boundary = req.headers['content-type'].split('; ')[1].
            split('=')[1]
        const payload = qs.parse(body, '\r\n', ': ')
        const type = payload['Content-Type']

        const typeIndex = body.indexOf(type)
        const typeLength = type.length
        
        let imageData = body.substring(typeIndex + typeLength)
        imageData = imageData.replace(/^\s\s*/, '')
        imageData = imageData.substring(0, imageData.indexOf(`--${boundary}`))
        // 写入数据时需要指定编码方式binary
        fs.writeFile('./image_copy.png', imageData, 'binary', (err) => {
            if (err) throw err
            console.log('image copy success')
        })
        console.log('data trans end')
    })
    res.end('hello serve')
})
// 启动服务
server.listen(8888, '0.0.0.0', () => {
    console.log('serve start success')
})


```

