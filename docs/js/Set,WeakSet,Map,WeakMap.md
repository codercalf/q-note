# 相关代码

## Set、WeakSet区别

1. set内可以放置任何数据类型，WeakSet内只能放置对象数据类型

2. WeakSet是一个弱引用，不会阻止垃圾回收

   测试代码：

   ```js
   let weakSetObj = new WeakSet()
   let obj = {name: 'yh'}
   console.log(weakSetObj) // WeakSet {}
   weakSetObj.add(obj)
   console.log(weakSetObj) // WeakSet {obj: {name: 'yh'}}
   obj = null
   setTimeout(() => {
     console.log(weakSetObj)   // WeakSet {} 垃圾回收由延时，需要设置一个演示，
   }, 30000)
   ```

   