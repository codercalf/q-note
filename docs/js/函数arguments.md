# 函数arguments

## 简介

1. 类数组对象，可以通过下边获取参数，**但是是一个对象**，没有数组常见的方法
2. arguments对象和命名参数可以同时使用，**arguments对象和命名参数可以同步改变**，一个改变另一个跟着改变

## 常见属性

```
arguments.length	// 参数长度
arguments[index]	// 通过下标获取参数
arguments.callee	// 获取函数本身
```

## 将arguments转化为数组的方式

```js
Array.prototype.slice.call(arguments)
Array.from(arguments)
[...arguments]
```

### 箭头函数没有arguments

箭头函数内的arguments不存在，会从上层作用域内找arguments

```js
// 这样可以拿到arguments，从上层作用域中
function foo() {
  return function () {
    console.log(arguments)
  }
}
```

