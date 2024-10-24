# generator自动执行方法

参考文章：wangdoc.com

async函数是generator的语法糖，是可以自动执行的generator函数

原理：当异步操作有了结果，能够自动交回执行权，即异步操作完成后，自动执行next方法，同时判断执行是否结束

判断异步操作是否结束两种方法：回调，promise

## 1 thunkify

### 1.1 thunkify函数介绍

#### 1.1.1 函数作用，

特殊的函数柯里化，

原函数：最后一个函数参数为回调函数，

封装之后的函数：返回一个函数，传入参数除回调函数以外的参数，执行后，再返回一个传入回调函数的函数

#### 1.1.2 thunkify源码

```js
/**
 * Module dependencies.
 */

var assert = require('assert');

/**
 * Expose `thunkify()`.
 */

module.exports = thunkify;

/**
 * Wrap a regular callback `fn` as a thunk.
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

function thunkify(fn) {
    assert('function' == typeof fn, 'function required');

    return function () {
        var args = new Array(arguments.length);
        var ctx = this;

        for (var i = 0; i < args.length; ++i) {
            args[i] = arguments[i];
        }

        return function (done) {
            var called;	// 确保回调函数只运行一次，针对generator的

            args.push(function () {
                if (called) return;
                called = true;
                done.apply(null, arguments);
            });

            try {
                fn.apply(ctx, args);
            } catch (err) {
                done(err);
            }
        }
    }
};
```

#### 1.1.3 总结

将函数执行，疯转为两次执行，同时对回调函数封装，确保回调函数执行一次

```
foo(args, callback) ==> thunkifyFoo(args)(newCallback)
thunk函数为：thunkifyFoo(args)，也就是thunk函数需要传入callback
```

### 1.2 自动执行generator

重写回调函数，回调函数作用：自动执行next，同时判断是否结束

#### 1.2.1 源码

```
function run(fn) {
    var gen = fn();

    function next(err, data) {
    	// rusult为{done: , value: thunk函数}
        var result = gen.next(data);
        if (result.done) return;
        // result.value为thunk函数，yield后面的函数执行到next(也是callback)处，
        result.value(next);
    }

    next();
}
// 条件：yield后面必须为thunk函数
function* g() {
    // ...
}

run(g);
```

#### 1.2.2 总结

将thunk函数的callback重写为特定的next函数，

next函数：执行gen.next()，判断gen是否执行完，执行完则返回，没有执行完则执行yield后函数

当函数的执行完毕，即函数执行到next处，调用next函数

## 2.co

### 2.1总结

将yield后面的值，封装为promise，重写then里面的参数方法，

onFulfilled：异步操作完成，执行gen.next方法，