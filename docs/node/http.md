# http

## 简单示例

```js
const http = require('http')
// 创建一个web服务器
const server = http.createServer((req, res) => {
    res.end('hello ser2ve')
})
server.listen(8888, '0.0.0.0', () => {
    console.log('serve start success')
})
```

