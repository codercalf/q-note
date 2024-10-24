# mysql

## 基础使用方法

```sql
const  mysql = require('mysql2');
// 创建数据库连接
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'w180282?',
  database: 'echo'
});
// 写mysql语句
const testSta = `select * from products`
// 执行sql语句
connection.query(testSta, (err, results, fields) => {
  console.log(results)
  // 结束连接
  connection.end()
  // 强制结束连接
  connection.destroy()
})
// 结束连接发生错误时，end方法执行错误，在这里监控
connection.on('error', () => {

})


```

## prepared statement 预处理语句

### 优点

1. 提高性能：将创建的语句模块发送给MySQL，然后MySQL编译（解析、优化、转换）语句模块，并且存储 它但是不执行，之后我们在真正执行时会给?提供实际的参数才会执行；就算多次执行，也只会编译一次，所 以性能是更高的；
2. 防止SQL注入：之后传入的值不会像模块引擎那样就编译，那么一些SQL注入的内容不会被执行；or 1 = 1不 会被执行

### 简单使用

```sql
const  mysql = require('mysql2');
// 创建数据库连接
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'w180282?',
  database: 'echo'
});
// ? 占位符
const testSta = `select * from products where id = ?`
// 数组替换占位符内容
connection.execute(testSta, [1], (err, results) => {
  console.log(results)
})
```

## Connection Pools 连接池

### 作用

前面我们是创建了一个连接（connection），但是如果我们有多个请求的话，该连接很有可能正在被占用，那么 我们是否需要每次一个请求都去创建一个新的连接呢？

1. 事实上，mysql2给我们提供了连接池（connection pools）；
2. 连接池可以在需要的时候自动创建连接，并且创建的连接不会被销毁，会放到连接池中，后续可以继续使用；
3. 我们可以在创建连接池的时候设置LIMIT，也就是最大创建个数

```
const  mysql = require('mysql2');
// 创建连接池
const connections = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'w180282?',
  database: 'echo',
  connectionLimit: 10
});

const testSta = `select * from products where id = ?`
// 使用连接池
connections.execute(testSta, [1], (err, results) => {
  console.log(results)
})
```

## promise

```
connections.promise().execute(testSta, [1]).then().catch()
```

