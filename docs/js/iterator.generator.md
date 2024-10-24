# iterator generator

## iterator

### 随手写的代码，重写Array原生迭代器，变成倒叙

作用数据遍历时倒序

```js
let arr = [1, 2, 3]
Array.prototype[Symbol.iterator] = function () {
  // 如果没有赋值，实际调用时this指向return 的对象
  // 一直走else 死循环
  let _this = this	// 闭包
  let count = 0
  return {		// 每次生成新的迭代器
    next() {
      count++
      console.log(this.length)
      if (count > _this.length) {
        return {value: undefined, done: true}
      } else {
        return {value: _this[_this.length-count], done: false}
      }
    }
  }
}

for (let item of arr) {
  console.log(item) // 3 2 1
}


// 或者
let arr = [1, 2, 3]
Array.prototype[Symbol.iterator] = function () {
  // 如果没有赋值，实际调用时this指向return 的对象
  // 一直走else 死循环
  let count = 0
  return {
    next: () => {
      count++
      if (count > this.length) {
        return {value: undefined, done: true}
      } else {
        return {value: this[this.length-count], done: false}
      }
    }
  }
}

for (let item of arr) {
  console.log(item) // 3 2 1
}
```

### 概念

可迭代对象：有[[Iteration]]接口

迭代器：返回一个有next方法对象的函数

## generator

### 基本用法

```js
function* foo() {
  console.log('foo start')
  yield 1

  const value1 = 100
  console.log('value1', value1)
  yield 2

  const value2 = 200
  console.log('value2', value2)
  yield 3

  console.log('foo end')
  yield 4

}
let fooGenerator = foo()
console.log(fooGenerator.next())  // foo start {value: 1, done: false}

console.log(fooGenerator.next()) // value 100 {value: 2, done: false}
console.log(fooGenerator.next()) // value2 200 {value: 3, done: false}
console.log(fooGenerator.next()) // foo end {value: 4, done: false}
console.log(fooGenerator.next())  // {value: undefined, done: true}
```

### throw

内部捕获到错误，不影响后续执行

```js
function* generatorFn() {
  for (const x of [1, 2, 3]) {
    try {
      yield x
    } catch(err) {
      console.log('err:', err)
    }
  }
}
let g = generatorFn() 
// 第一次调用throw 错误传向外部，内部捕获不到
console.log('res1:', g.next())  // res1: {value: 1, done: false}
console.log('res2:', g.throw('err message'))    // err: err message  res2: {value: 2, done: false}
console.log('res3:', g.next())    // res3: {value: 3, done: false}
console.log(g.next()) // {value: undefined, done: true}
```

### 重写Array原生迭代器，变成倒叙，使用生成器函数

```js
Array.prototype[Symbol.iterator] = function* () {
  for (let i=0; i<this.length; i++) {
    yield this[this.length - i -1]
  }
}
let arr = [11, 22, 33]
for (const item of arr) {
  console.log(item) // 33 22 11
}
```

