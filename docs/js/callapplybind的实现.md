# call/apply/bind的js实现

主要是实现思路，不考虑边界情况，v8使用c++实现

## call的实现

```js
// 在函数的原型链上添加hycall
var name = 'window'
function foo() {
  console.log(this.name)
  return this.name + ' test'
}
var obj = {
  name: 'obj'
}
// 需要做的事
// 1、拿到需要执行的函数
// 2、处理绑定的this
// 3、处理函数参数
// 4、返回原函数的值
Function.prototype.hycall = function(thisArg, ...args) {
  // 获取被执行函数
  // 处理绑定的对象 
  // 1.为空时，绑定window  
  // 2.不是对象，转换为对象
  // if (!thisArg) thisArg = window
  // thisArg = Object(thisArg)
  thisArg = thisArg ? Object(thisArg) : window
  var fn = this

  thisArg.fn = fn
  var result = thisArg.fn(...args)
  delete thisArg.fn
  return result
}
foo.hycall(obj)
```

## apply函数的实现

```js
Function.prototype.hyapply = function(thisArg, argArray) {
  var fn = this
  thisArg = thisArg ? Object(thisArg) : window
  thisArg.fn = fn
  argArray = argArray || []
  var result = thisArg.fn(...argArray)
  delete thisArg.fn
  return result
}
```

## bind函数的实现

**注：bind的参数传递，拼接的**

```js
Function.prototype.hybind = function (thisArg, ...argArray) {
  var fn = this
  thisArg = (thisArg !== null && thisArg !== undefined) ? Object(thisArg) : window
  return function (...args) {
    thisArg.fn = fn
    var result = thisArg.fn(...argArray, ...args)
    delete thisArg.fn
    return result
  }
}
```

