# Koa

只能通过use的方式注册中间件，

没有，下面方法都不行

1. 请求方法：app.get/post, 
2. 路径匹配：app.use('./xxx', () => {}), 
3. 连续注册：

## koa demo

```js
const Koa = require('koa')
const app = new Koa()

app.use((content, next) => {
    console.log('exe')
    content.response.body = 'hello yh'
})
app.listen(8888, () => {
    console.log('start success')
})
```

