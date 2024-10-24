# this

## this的作用

让编写代码更加方便

## this在全局作用域中的指向

浏览器中：window（global object）

node环境中：空对象（{}）

## this的绑定规则

1. 默认绑定

   函数独立调用，

   本质：直接使用函数所在地址进行调用

   绑定this：window

   ```js
   function foo() {
     console.log(this)
   }
   var obj = {
     name: 'echo',
     foo: function() {
       console.log(this)
     }
   };
   (obj.foo || obj.foo)();	// window
   (obj.foo)()		// obj
   ```

   

2. 隐式绑定

   对象的属性为函数，通过对象，调用属性函数

   eg： obj.property()

3. 显式绑定

   通过call、apply、bind

   注：传入null、undefined时，里面的this为window，自动将this绑定为全局对象

4. new绑定



## 其他情况this的绑定

### setTimeout

里面this的指向是全局对象

### 点击事件

```js
dom.onclick = fn
or
dom.addEventListener('click', fn)
```

里面的this是，前面的dom对象

### 数组forEach、map等方法内this的指向

this指向全局对象，一般后面会有一个参数，可传this

## this绑定的优先级顺序

1. 默认规则的优先级最低

2. 显式绑定的优先级高于隐式绑定

   ```js
   function fn() {
     console.log(this)
   }
   var obj1 = {
     name: 'obj1',
     bar: fn
   }
   var obj2 = {
     name: 'obj2',
     bar: fn
   }
   obj1.bar()	// obj1
   fn.call(obj2)	// obj2
   obj1.bar.call(obj2)	// obj2
   ```

3. new绑定优先级高于隐式绑定

   ```js
   var obj = {
     foo: function() {
       console.log(this)	// {}空对象
     }
   }
   var f = new obj.foo()
   ```

4. new优先级高于显式绑定

   ```js
   function foo() {
     console.log(this)	// 空对象{}
   }
   var bar = foo.bind('aaa')
   var obj = new bar()
   ```

5. 总结

   new > 显示 > 隐式 > 默认

## 箭头函数this的绑定，arrow function

### 介绍

不会绑定this, arguments

- 根据外层作用域来决定this，
- 确定箭头函数内部的this，找外层作用域

不能作为构造函数使用

### 简写

1. 只有一个参数时，括号可以省略
2. 函数体只有一行代码时，大括号可以省略，且默认将此代码的执行结果作为返回值返回
3. 只有一行代码，且返回值为对象时，省略大括号时，需要添加小括号

# this面试题

1. 面试题1

   ```js
   // 面试题1
   var name = 'window'
   var person = {
     name: 'person',
     sayName: function() {
       console.log(this.name)
     }
   }
   function sayName() {
     var sss = person.sayName
     sss() // window
     person.sayName(); // person
     (person.sayName)(); // person		圆括号之改变优先级，没有求值作用
     (b = person.sayName)()  // window
   }
   sayName()
   ```

2. 面试题2

   ```js
   // 面试题2
   var name = 'window'
   var person1 = {
     name: 'person1',
     foo1: function() {
       console.log(this.name)
     },
     foo2: () => console.log(this.name),
     foo3: function () {
       return function () {
         console.log(this.name)
       }
     },
     foo4: function () {
       return () => console.log(this.name)
     }
   }
   var person2 = { name: 'person2' }
   
   person1.foo1()  // person1
   person1.foo1.call(person2)  // person2
   
   person1.foo2()  // window
   person1.foo2.call(person2)  // window
   
   // 注： 不会
   // person1.foo3() 返回一个函数后调用此函数； 独立函数调用
   person1.foo3()()  // window	
   // 调用foo3时使用call调用，然后返回一个函数；独立函数调用
   person1.foo3.call(person2)()  // window
   person1.foo3().call(person2)  // person2
   
   person1.foo4()()  // person1
   // 注：不会！！！
   // 箭头函数内的this为：箭头函数的外部作用域
   person1.foo4.call(person2)()  // person2 
   person1.foo4().call(person2)  // person1
   ```

3. this面试题3

   ```js
   var name = 'window'
   function Person(name) {
     this.name = name;
     this.foo1 = function () {
       console.log(this.name)
     };
     this.foo2 = () => console.log(this.name);
     this.foo3 = function () {
       return function () {
         console.log(this.name)
       }
     };
     this.foo4 = function () {
       return () => { console.log(this.name) }
     }
   }
   
   var person1 = new Person('person1')
   var person2 = new Person('person2')
   
   person1.foo1()  // person1
   person1.foo1.call(person2)  // person2
   
   // 注
   // 箭头函数内部的this为，外部的作用域this
   person1.foo2()  // person1
   person1.foo2.call(person2)  // person1
   
   person1.foo3()()  // window
   person1.foo3.call(person2)()  // window
   person1.foo3().call(person2)  // person2
   
   person1.foo4()()  // person1
   person1.foo4.call(person2)()  // person2
   person1.foo4().call(person2)  // person1
   ```

4. this面试题4

   ```js
   var name = 'window'
   function Person(name) {
     this.name = name
     this.obj = {
       name: 'obj'
       foo1: function () {
         return function () {
           console.log(this.name)
         }
       },
       foo2: function () {
         return () => { console.log(this.name) }
       }
     }
   }
   
   var person1 = new Person('person1')
   var person2 = new Person('person2')
   
   person1.obj.foo1()()  // window
   person1.obj.foo1.call(person2)()  // window
   person1.obj.foo1().call(person2)  // person2
   
   person1.obj.foo2()()  // obj
   person1.obj.foo2.call(person2)()  // person2
   person1.obj.foo2().call(person2)  // obj
   ```

   