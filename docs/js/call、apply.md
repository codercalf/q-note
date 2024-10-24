# call、apply

实质是调用Function.prototype.call

**因此使用条件，必须是函数调用。**

obj.call or  obj.apply 报错 obj.call is not a function

当call apply 大于等于两个连用是 第一个参数一定要是函数 否则报错

```js
let a = function a() { console.log('a:', this) }
let b = function b() { console.log("b:", this) }
let obj = {}
a.call.apply(a, [this])		//a:window

// 
// 原因：本质调用 (a.call).apply(obj, [this]) 即 
// 即 funcAddress.call(thisArg, [arguments]) =》 thisArg.function(arguments)
// 实质： call apply 调用时无论前面有多长，只取最后的函数地址
// 分析本例： (a.call).apply(obj, [this]) => obj.call(this) => this.obj() 不是函数，不可执行，
// 本例中 报错原因和实际产生错误的原因 不太一样，可能是因为，chrome的报错机制问题
a.call.apply(obj, [this])		//Uncaught TypeError: a.call.apply is not a function

// 验证
a.apply.apply(b, obj)		//b:obj
a.apply(b, 1)	//Uncaught TypeError: CreateListFromArrayLike called on non-object
a.apply(b, [1])		//a: f b
a.apply.apply(b, [1])		// b: Number{1}
a.apply.apply.apply(b, [1])		// b: Number{1}
a.apply.apply.apply.apply.apply(b, [1])		// b: Number{1}
```
test
