# try catch

```js
function foo() {
  console.log('foo start')
  throw new error('error message')
  console.log('foo end')  // 此代码不执行
}
function bar() {
  console.log('bar start')
  try{
    foo()
  } catch {}
  console.log('bar end')
}
bar()
```

