# symbol

## 历史

obj存储时，都是key：value，key存储时都是字符串，缺点：同名属性，会覆盖前面的值

es6之后，对象的key可以使用字符串或者symbol

## 用法

```js
// symbol 值的生成
const s1 = Symbol('foo')
const s2 = Symbol()
console.log(s1.description) // foo
console.log(s2.description) // undefined

// 对象的属性为symbol值的，几种定义方式
// 1、对象定义时
const obj = {
  [s1]: 'foo',
  [s2]: 'xx'
}

// 2、新增属性时
obj[s3] = 'xxx'
// 3、新增属性时
Object.defineProperty(obj, s2, {  })

// 获取，不可以通过点语法获取
obj[s1]
```

// 获取对象属性的symbol值

Object.getOwnPropertySymbols(obj)