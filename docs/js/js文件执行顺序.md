# 调用栈

## 常见函数作用域问题

1. 注：函数的父级作用域在函数的定义时就决定了

```js
let message = 'Hello Global'
function foo() {	// 父级作用域为GO
    console.log('foo', message)
}
function bar() {	// 父级作用域为GO
    let message = 'Hello Bar'
    foo()
}
bar();  
```

```
run:
Hello Global
```

2. 变量为定义和为初始化的区别

   - 未定义

     ```js
     function test(){
     	console.log(message)
     }
     test()
     ```

     ```
     error: message is not defined at test
     ```

     

   - 未初始化

     ```js
     function test(){
     	console.log(xx)
     	var xx;
     }
     test()
     ```

     ```js
     undefined
     ```
     
   
3. 在函数外没有定义，在函数内直接赋值的函数，会直接定义为全局变量

   ```js
   function foo() {
     function bar() {
       n = 200
     }
     bar()
   }
   foo()
   console.log(n)	// 200
   ```

4. 关于var a=b=10

   js 的解释方式

   ```js
   var a = 10
   b = 10
   ```


## 函数参数作用

当函数参数有默认值时，会多一层参数作用域

![image-20220319205324524](C:\Users\echo\AppData\Roaming\Typora\typora-user-images\image-20220319205324524.png)

**但是测试代码，不行**

```js
// 无默认值
function foo(x) {
  console.log(x)
  var x = 8
  console.log(x)
}
foo(0)
// 0 8

// 有默认值
let x = 2
function foo(x=0, y= () => {x=3; console.log(x)}) {
  y() // 3
  console.log(x) // 2  ????
  var x = 1
  console.log(x)  // 1
  y() // 3
  console.log(x)  // 1
}
foo(2)
```





## 函数调用栈

1. 学习目的

   - js文件的执行以及定义顺序

2. 执行顺序

   函数执行上下文：创建AO对象、按照顺序执行代码

   函数