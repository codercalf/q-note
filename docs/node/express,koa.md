# express koa区别

1. express集成的东西比较多，koa更加轻量级，
2. 代码执行顺序不一样

## express和koa代码执行顺序

示例代码：

在中间件1中给req.message添加aaa

在中间件2中给req.message添加bbb

在中间件3中给req.message添加ccc

最终在中间件一中返回结果

express

同步执行，异步很难处理

```js
const express = require('express')

const app = express()

const middleware1 = (req, res, next) => {
    req.message = 'aaa'
    next()	//代码同步执行
    res.end(req.message)
}

const middleware2 = (req, res, next) => {
    req.message += 'bbb'
    next()
}

const middleware3 = (req, res, next) => {
    req.message += 'ccc'
}

app.use(middleware1, middleware2, middleware3)

app.listen(8888, () => {
    console.log('启动成功')
})


```

koa

同步时

```js
const Koa = require('koa')

const app = new Koa()

const middleware1 = (ctx, next) => {
    ctx.message = 'aaa'
    next()
    ctx.body = ctx.message
}

const middleware2 = (ctx, next) => {
    ctx.message += 'bbb'
    next()
}

const middleware3 = (ctx, next) => {
    ctx.message += 'ccc'
}

app.use(middleware1)
app.use(middleware2)
app.use(middleware3)

app.listen(8888, () => {
    console.log('启动成功')
})
```

存在异步代码

```j
const Koa = require('koa')
const axios = require('axios')

const app = new Koa()

const middleware1 = async (ctx, next) => {
    ctx.message = 'aaa'
    await next()
    ctx.body = ctx.message
}

const middleware2 = async (ctx, next) => {
    ctx.message += 'bbb'
    await next()
}

const middleware3 = async (ctx, next) => {
    let result = await axios.get('http://123.207.32.32:9001/lyric?id=167676')
    ctx.message += result.data.lrc.lyric
}

app.use(middleware1)
app.use(middleware2)
app.use(middleware3)

app.listen(8888, () => {
    console.log('启动成功')
})


```

