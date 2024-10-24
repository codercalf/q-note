# token

## demo

### 默认对称加密

```js
const Koa = require('koa')
const Router = require('koa-router')
const jwt = require('jsonwebtoken')

const app = new Koa()
const testRouter = new Router()
const SERCET_KEY = 'abccba123'

testRouter.post('/test', (ctx, next) => {
    const user = {id: 100, name: 'why'}
    const token = jwt.sign(user, SERCET_KEY, {
        expiresIn: 50
    })
    ctx.body = token
})

testRouter.get('/demo', (ctx, next) => {
    const authorization = ctx.headers.authorization
    const token = authorization.replace('Bearer ', '')
    try {
        const result = jwt.verify(token, SERCET_KEY)
        ctx.body = result
    } catch(err) {
        ctx.body = 'token无效'
    }
})

app.use(testRouter.routes())
app.use(testRouter.allowedMethods())

app.listen(8888, () => {
    console.log('项目启动成功')
})
```

## 非对称加密

### SSL生成

环境：window，git bash

1. 进入SSL的REPL

   ```cmd
   openssl
   ```

2. 生成非对称加密的私钥，长度随意，此处为1024，私钥保存文件名为private.key

   ```ssl
   genrsa -out private.key 1024
   ```

3. 根据私钥生成公钥，公钥保存文件名为private.kye

   ```ssl
   rsa -in private.key -pubout -out public.key
   ```

   

### 代码

```js
const Koa = require('koa')
const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const app = new Koa()
const testRouter = new Router()
// 获取私钥
const PRIVATE_KEY = fs.readFileSync('./keys/private.key')
// 获取公钥
const PUBLIC_KEY = fs.readFileSync('./keys/public.key')

testRouter.post('/test', (ctx, next) => {
    const user = {id: 100, name: 'why'}
    const token = jwt.sign(user, PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: 50
    })
    ctx.body = token
})

testRouter.get('/demo', (ctx, next) => {
    const authorization = ctx.headers.authorization
    const token = authorization.replace('Bearer ', '')
    try {
        const result = jwt.verify(token, PUBLIC_KEY, {
            algorithms: ['RS256']
        })
        ctx.body = result
    } catch(err) {
        ctx.body = 'token无效'
    }
})

app.use(testRouter.routes())
app.use(testRouter.allowedMethods())

app.listen(8888, () => {
    console.log('项目启动成功')
})
```

