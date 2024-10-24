# Promise

## Promise结构的设计

## 手写promise

```js
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'



class HyPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []
    const resolve = (value) => {
      // 状态改变后 不可再次调用 resolve或者reject
      if (this.status === PROMISE_STATUS_PENDING) {
        // 需要在本轮同步状态下改变状态
        // 将函数加入到微任务中，要不然拿不到then方法的值
        queueMicrotask(() => {
          // 需要放入微队列里面 解决问题：放在外面，then会直接执行
          if (this.status === PROMISE_STATUS_PENDING) {
            this.status = PROMISE_STATUS_FULFILLED
            this.value = value
            this.onFulfilledFns.forEach(fn => {
              fn(this.value)
            })
          }
        })
      }
    }
    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {  
          if (this.status === PROMISE_STATUS_PENDING) {
            this.status = PROMISE_STATUS_REJECTED     
            this.reason = reason
            this.onRejectedFns.forEach(fn => {
              fn(this.reason)
            })
          }
        })
      }
    }
    // 捕获执行器里面的错误
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
    
  }
  then(onFulfilled, onRejected) {
    // 处理catch方法，当then 方法没有传入第二个参数，确保catch可以拿到，前面的值
    // 处理 .then(onFulfilled, undefined).catch() 问题
    onRejected = onRejected || (err => { throw err })
    // 处理finally，确保catch().finally() 调用正常
    onFulfilled = onFulfilled || (value => value)
    // then的链式调用
    return new HyPromise((resolve, reject) => {
      // 调用then时，状态已经改变 需要直接调用函数
      if (this.status === PROMISE_STATUS_FULFILLED && onFulfilled) {
        if (onFulfilled) execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
      } else if (this.status === PROMISE_STATUS_REJECTED && onRejected) {
        if (onRejected) execFunctionWithCatchError(onRejected, this.reason, resolve, reject)
      } else if (this.status === PROMISE_STATUS_PENDING) {
        if (onFulfilled) this.onFulfilledFns.push(() => {
          execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
        })
        if (onRejected) this.onRejectedFns.push(() => {
          execFunctionWithCatchError(onRejected, this.reason, resolve, reject)
        })
      }
    })

  }
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  finally(onFinally) {
    this.then(onFinally, onFinally)
  }

  static resolve(value) {
    return new HyPromise((resolve) => { resolve(value) })
  }

  static reject(reason) {
    return new HyPromise((resolve, reject) => { reject(reason) })
  }

  static all(promises) {
    return new HyPromise((resolve, reject) => {
      let length = promises.length
      let results = new Array()
      let successCount = 0
      results.length = length
      function myResolve(index, value) {
        successCount++
        results[index] = value
        if (successCount === length) {
          resolve(results)
        }
      } 
      promises.forEach((promise, index) => {
        promise.then(
          (value) => { console.log('---', value); myResolve(index, value) }, 
          (err) => { reject(err) }
        )
      })
    })
  }
  // 返回最先拿到结果的一个，不论成功失败
  static race(promises) {
    return new HyPromise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(resolve, reject)
      })
    })
  }
}

// 工具函数
function execFunctionWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = execFn(value)
    resolve(result)
  } catch (err) {
    reject(err)
  }
}

const promise = new HyPromise((resolve, reject) => {
  resolve('success message')

  reject('error message')
})

// promise可调用多次
// promise.then( (res) => { console.log('res1:', res) }, (error) => { console.log('error1:', error) } )
// promise.then( (res) => { console.log('res2:', res) }, (error) => { console.log('error2:', error) } )
// // 异步调用测试，直接执行then
// setTimeout(() => {
//   promise.then((res) => { console.log('settimout:', res) }, (error) => { console.log('settimout:', error) })
// }, 2000)
// 链式调用测试
// promise.then( 
//   (res) => { 
//     console.log('res1:', res) 
//     return 'then success res'
//   }, 
//   (error) => {
//     console.log('error1:', error) 
//     return 'then error res'
//   } 
// )
// .then( (res) => { console.log('res2:', res) }, (error) => { console.log('error2:', error) } )

// catch 方法测试
// promise.then(
//   (res) => {
//     console.log('then', res)
//   }
// ).catch(
//   (err) => {
//     console.log(err)
//   }
// )


// finally方法测试
// promise.then(
//   (res) => {
//     console.log('then', res)
//     return 'return then'
//   }
// ).catch(
//   (err) => {
//     console.log(err)
//     return 'catch'
//   }
// ).finally(
//   (res) => {
//     console.log('finally', res)
//   }
// )

// 静态方法测试
// Promise.reject('reject test').catch(err => { console.log('err:', err) })
// Promise.resolve('resolve test').then(res => { console.log('res:', res) })

// all测试
let p1 = new HyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('p1')
  }, 2000)
})
let p2 = new HyPromise((resolve, reject) => {
  setTimeout(() => {
    reject('p2')
  }, 1000)
})
let p3 = new HyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('p3')
  }, 3000)
})
HyPromise.all([p1, p2, p3]).then((res) => { console.log('all', res) }, (err) => { console.log('err', err) })

```

## Promise常见面试题

