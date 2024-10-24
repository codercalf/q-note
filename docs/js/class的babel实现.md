---
typora-copy-images-to: img
---

# class的babel实现

注： 关于class的constructor，

父类和子类可以都没有constructor，

父类有，子类没有，可，参数也可传递到父类			见babel转码后

父类无，子类有，可，数不会自动传递到父类，必须通过super传参

父类有，子类有，可，参数不会自动传递到父类，必须通过super传参

报错情况：子类存在constructor，且没有调用super，或者super没有在this之前调用

原因：原因就在于 ES6 的继承机制，与 ES5 完全不同。ES5 的继承机制，是先创造一个独立的子类的实例对象，然后再将父类的方法添加到这个对象上面，即“实例在前，继承在后”。ES6 的继承机制，则是先将父类的属性和方法，加到一个空的对象上面，然后再将该对象作为子类的实例，即“继承在前，实例在后”。这就是为什么 ES6 的继承必须先调用super()方法，因为这一步会生成一个继承父类的this对象，没有这一步就无法继承父类。（https://wangdoc.com/es6/class-extends.html）

## 单个继承

### 父类子类都为空

```js
class Parent {}
class Children extends Parent {}
```

babel转化后，简易实现

```js
function _inheritLoose(subClass, superClass) {
    // 不可以subclass.prototype = superClass.prototype 修改子类原型会影响到父类原型
    subClass.prototype = Object.create(superClass.prototype);       //继承父类原型方法
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);      //继承静态方法 和属性
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p, return o}
    return _setPrototypeOf(o, p)
}
var Parent = function Parent {}
var Child = function Child(_Parent){
    _inheritsLoose(Child, _Parent)
    function Child() {	// 子类没有constructor，使用apply直接调用，父类可以拿到传递进来的参数
        return _Parent.apply(this, arguments) || this		// 
    }
    return Child;
}(Parent)
```

_inheritLoose实现的内容图

![image-20220216222739616](X:\学习笔记\js\img\image-20220216222739616.png)



---

```js
class Parent {
	constructor() {}
}
class Children extends Parent {
  
}
// babel后同上
```



```js
class Parent {

}
class Children extends Parent {
  	constructor() {
      super()
    }
}
```

or

```js
class Parent {
  	constructor() {}
}
class Children extends Parent {
  	constructor() {
      super()
    }
}
```

转码后

```js
var Parent = function Parent() {};
var Children = (function (_Parent) {
  _inheritsLoose(Children, _Parent);
  function Children() {
    return _Parent.call(this) || this;
  }
  return Children;
})(Parent);
```





---



### 子类为空，父类内有东西

// class 中实例属性的新写法 与在constructor中定义实例属性的区别

// 通过babel转码后可以看出，construcor 函数中参数，被自动加到构造函数参数中

// 因此 实例属性的新写法，在class中没有constructor时，没办法通过参数传输初始化，只可以固定值

// 实例属性要想 通过参数初始化，只能在class 中定义constructor方法，在参数中书写需要初始化的变量

//  实例属性的新写法，在外层作用域没有值的情况，会报错，外层作用域有值，从外层作用域取值，总是拿不到传递的值，从babel转码可以看出

```js
var age = 19			// 这种情况不会报错，age会从外层作用域拿到，还是拿不到传递的_age值
class Parent {
  	age = age		// constructor语法糖写法，缺点：不可以传参  会直接报错
  	sex = 'male'
  	constructor(name, age) {
    	this.name = name
    }
	foo() {}	// 当类上定义方法是，会包裹一层再返回
}
class Children extends Parent {

}
```

=> 这种写法会直接报错，但是可以看到转码后的值，age是拿不到传递的age值的，age经检测后后变为_age

```js
var Parent = /*#__PURE__*/ (function () { 	// 当类上定义方法是，会包裹一层再返回
  function Parent(name, _age) {
    this.age = age;
    this.sex = "male";	// 这种写法不可传参
    this.name = name;
  }

  var _proto = Parent.prototype;

  _proto.foo = function foo() {};

  return Parent;
})();

var Children = /*#__PURE__*/ (function (_Parent) {
  "use strict";

  _inheritsLoose(Children, _Parent);

  function Children() {
    return _Parent.apply(this, arguments) || this;
  }

  return Children;
})(Parent);
```

---

### 子类内有内容

```js
class Parent {
  constructor() {			// super 没有传递值的情况
    this.name = name		// window顶层对象有name属性，可以拿到值
    this.test = test		// 如果外层作用域没有test变量，则报错
  }
  foo() {}// 当类上定义方法是，会包裹一层再返回
}
Parent.pp = 'pp'
class Children extends Parent {
  sex = 'male'
  constructor(age) {
    super()
    this.age = age
  }
  bar() {}
}

```

```js

var Parent = /*#__PURE__*/ (function () {

  function Parent() {
    this.name = name;
    this.test = test;
  }

  var _proto = Parent.prototype;

  _proto.foo = function foo() {};

  return Parent;
})();

Parent.pp = "pp";

var Children = /*#__PURE__*/ (function (_Parent) {
  "use strict";

  _inheritsLoose(Children, _Parent);

  function Children(age) {
    var _this;
	// 如果super后调用，则先执行_this.age = age，_this此时值为undefined
    _this = _Parent.call(this, name) || this;	
    _this.sex = "male";
    _this.age = age;
    return _this;
  }

  var _proto2 = Children.prototype;

  _proto2.bar = function bar() {};

  return Children;
})(Parent);
```



## 类内构造函数的转化方式

1. constructor内		可以通过传参定义值

2. 直接再类内定义  不可通过传参定义值，

   1. 直接写死
   2. 变量赋值，变量需要在外层作用域外定义

   例子见上

## 类内3中方法的转化

不影响babel继承

```js
class Parent {
  constructor() {
    this.name = name
    this.test = test
  }
  foo() {}
  static bar() {}
  get getParentFn() {}
  set setParentFn(parentParams) {}
  static get getfn() {}
}
```

转化后

```js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}

var Parent = /*#__PURE__*/ (function () {
  "use strict";

  function Parent() {
    this.name = name;
    this.test = test;
  }

  var _proto = Parent.prototype;

  _proto.foo = function foo() {};	// 原型上的方法

  Parent.bar = function bar() {};	// 静态方法

  _createClass(
    Parent,
    [		// 原型上的get/set方法
      {
        key: "getParentFn",
        get: function get() {}
      },
      {
        key: "setParentFn",
        set: function set(parentParams) {}
      }
    ],
    [		// 静态作为对象的get/set方法
      {
        key: "getfn",
        get: function get() {}
      }
    ]
  );

  return Parent;
})();
```

## 类继承：super的使用，

使用位置：

1. constructor中
2. 静态方法中 注：只可以调用父类的静态方法，属性
3. 原型方法中 注：只可以调用父类原型上方法，属性

```js
// demo
class Parent {

}

class Children extends Parent {
  childPrototypeFn() {super.fn();super._attribute}
  static childStaticFn() {super.fn();super._attribute}
}
```

转babel后

```js
var Parent = function Parent() {
  "use strict";
};

var Children = /*#__PURE__*/ (function (_Parent) {
  "use strict";

  _inheritsLoose(Children, _Parent);

  function Children() {
    return _Parent.apply(this, arguments) || this;
  }

  var _proto = Children.prototype;

  _proto.childPrototypeFn = function childPrototypeFn() {
     // 此处可以看出 子类原型上 只能调用父类原型的方法、属性
    _Parent.prototype.fn.call(this);

    _Parent.prototype._attribute;
  };

  Children.childStaticFn = function childStaticFn() {
      // 此处可以看出 子类的静态上 只能调用父类静态的方法、属性
    _Parent.fn.call(this);

    _Parent._attribute;
  };

  return Children;
})(Parent);
```

## 继承的广义用法

例：

```js
class myArray extends Array {
    myFn() {}
}
```

## 类不支持多个继承，只能通过混入实现类似效果

