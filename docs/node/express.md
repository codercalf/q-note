# express

## 简介

1. web框架
2. 总结：express核心就是中间件，中间件就是回调函数
3. 按照顺序匹配

## 最简单的中间件

```js
const express = require('express')
const app = express()

app.use((req, res, next) => {
    console.log('1 exe')
    // 可以在任何一个中间件执行，但是只可以执行一次，重复执行，报错
    res.end('hello yh')
    // 执行下一个中间件 
    next()
})

app.use((req, res, next) => {
    console.log('2 exe')
    next()
})

app.use((req, res, next) => {
    console.log('3 exe')
})

app.listen(8888, () => {
    console.log('server start success')
})
```

