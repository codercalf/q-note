> 参考文件：
>
> node官方文档：https://nodejs.cn/api/
>
> 网道js知识点：https://wangdoc.com/



根据一个最简单的项目启动，很多判断并不会走进去

```js
#!/usr/bin/env node
// 写法见：
// https://nodejs.cn/api/esm.html 
// esm导入：node导入部分，
// performance：node 一个性能监视api
import { performance } from 'node:perf_hooks'
// meta见网道，es6 module部分，不进判断
if (!import.meta.url.includes('node_modules')) {
  try {
    // only available as dev dependency
    await import('source-map-support').then((r) => r.default.install())
  } catch (e) {}
}
// global node 全局变量
global.__vite_start_time = performance.now()
// check debug mode first before requiring the CLI.
// debug、filter这两个参数见vite官网用处，此处不走
// -1
const debugIndex = process.argv.findIndex((arg) => /^(?:-d|--debug)$/.test(arg))
// -1
const filterIndex = process.argv.findIndex((arg) =>
  /^(?:-f|--filter)$/.test(arg)
)
//  不知道干啥的，但是暂时不敲这个命令
const profileIndex = process.argv.indexOf('--profile')

if (debugIndex > 0) {
  let value = process.argv[debugIndex + 1]
  if (!value || value.startsWith('-')) {
    value = 'vite:*'
  } else {
    // support debugging multiple flags with comma-separated list
    value = value
      .split(',')
      .map((v) => `vite:${v}`)
      .join(',')
  }
  process.env.DEBUG = `${
    process.env.DEBUG ? process.env.DEBUG + ',' : ''
  }${value}`

  if (filterIndex > 0) {
    const filter = process.argv[filterIndex + 1]
    if (filter && !filter.startsWith('-')) {
      process.env.VITE_DEBUG_FILTER = filter
    }
  }
}

function start() {
  return import('../dist/node/cli.js')
}

// 走else判断
if (profileIndex > 0) {
  process.argv.splice(profileIndex, 1)
  const next = process.argv[profileIndex]
  if (next && !next.startsWith('-')) {
    process.argv.splice(profileIndex, 1)
  }
  const inspector = await import('node:inspector').then((r) => r.default)
  const session = (global.__vite_profile_session = new inspector.Session())
  session.connect()
  session.post('Profiler.enable', () => {
    session.post('Profiler.start', start)
  })
} else {
  start()
}

```

去掉不走的判断

```
function start() {
  return import('../dist/node/cli.js')
}
start()
```



