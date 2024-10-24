---
typora-copy-images-to: img
---

referren policy

具体详见mdn

目的：处理http中referrer的值的不同策略

chrome默认值：strict-origin-when-cross-origin

![image-20220616093606792](.\img\image-20220616093606792.png)

查看浏览器使用

各种文件，css、js等文件的加载可以设置，整个文档可以设置，也可以通过http返回的csp设置

详情见mdn

eg

html中添加meta标签

![image-20220616094031179](.\img\image-20220616094031179.png)

发出的网络请求中就无referrer字段

![image-20220616094219379](.\img\image-20220616094219379.png)



cors

具体文档详见wangdoc：https://wangdoc.com/javascript/bom/cors.html

文章代码为最简demo，详细信息及字段见上链接 

当是同源请求时：没有cors，即不会发送origin，也不会预请求

```
// 使用浏览器xmlHttpRequest发送求情
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function(){
  // 通信成功时，状态值为4
  if (xhr.readyState === 4){
    if (xhr.status === 200){
      console.log(xhr.responseText);
    } else {
      console.error(xhr.statusText);
    }
  }
};

xhr.onerror = function (e) {
  console.error(xhr.statusText);
};

xhr.open('GET', 'https://www.baidu.com', true);
xhr.send(null);
```

![image-20220616101337366](.\img\image-20220616101337366.png)

同源，没有origin，也没有预请求



使用cors

简单请求

```
// 代码更改：打开网址部分更改为
xhr.open('GET', 'https://cn.bing.com/', true);
```

![image-20220616101645900](.\img\image-20220616101645900.png)

![image-20220616104755365](.\img\image-20220616104755365.png)

不同源，且为简单请求，请求头中添加origin字段

非简单请求，chrome发送预请求，请求方法为OPTIONS

```
// 请求网址代码更改为
xhr.open('PUT', 'https://cn.bing.com/', true);
```

![image-20220616104158269](.\img\image-20220616104158269.png)

上面的为本来的要发送的请求，下面的是chrome自动发的预请求

下面的预请求拿到服务器处理后的数据，这次请求的数据

![image-20220616104507474](.\img\image-20220616104507474.png)

![image-20220616101850199](.\img\image-20220616101850199-16553476520861.png)

没有返回有关cors的字段，预请求方法为options，

所以本来将要发送的的请求chrome定义为，cors错误



总结：

同源直接获取数据

不同源：

1. 简单请求：请求头添加origin，同时服务器进行处理
2. 非简单请求：预请求，服务求需要添加关于options请求的处理



本地调试cors

使用工具：vsCode（插件live server），nodejs

不同源

```js
// cors.html，服务启动后地址：http://localhost:5500/test/cors.html or http://127.0.0.1:5500/test/cors.html
  <script>
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log(xhr.responseText)
        } else {
          console.error(xhr.statusText)
        }
      }
    }
    xhr.onerror = function (e) {
      console.error(xhr.statusText)
    }
    xhr.open('GET', 'http://127.0.0.1:8888/', true)
    xhr.send(null)
  </script>
// server.js  启动后服务：http://localhost:8888 or http://127.0.0.1:8888
const http = require('http')

const server = http.createServer((req, res) => {
  console.log(req.method)
  res.statusCode = 200
  res.end('hello serve2')
})
server.listen(8888, '127.0.0.1', () => {
  console.log('serve start success')
})
```

端口号不一致

cors错误



![image-20220616111743241](.\img\image-20220616111743241.png)

服务器未设置`Access-Control-Allow-Origin`字段，

![image-20220616111819239](.\img\image-20220616111819239.png)

简单请求，包含Origin

![image-20220616112259416](.\img\image-20220616112259416.png)

简单请求cors服务器设置

```
// 只更改服务器代码
const http = require('http')

const server = http.createServer((req, res) => {
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    // 或者
    // res.setHeader('Access-Control-Allow-Origin', '*')
  }
  res.statusCode = 200
  res.end('hello serve2')
})
server.listen(8888, '127.0.0.1', () => {
  console.log('serve start success')
})

```

![image-20220616114728604](.\img\image-20220616114728604.png)

![image-20220616114749208](.\img\image-20220616114749208.png)

![image-20220616114849503](.\img\image-20220616114849503.png)

简单请求，请求时携带origin，服务器设置**Access-Control-Allow-Origin**，允许访问，成功

```js
// 服务器设置Access-Control-Allow-Origin错误
res.setHeader('Access-Control-Allow-Origin', 'http://localhost')
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5001')
```

![image-20220616115311494](.\img\image-20220616115311494.png)

报错，报错原因是返回的值与origin不一致，

见wangdoc

> 它的值要么是请求时`Origin`字段的值，要么是一个`*`，表示接受任意域名的请求。

非简单请求错误测试

需要处理浏览器发出的Options请求

使用上面代码，只设置了`Access-Control-Allow-Origin`参数，在这里我们使用put请求，

```js
// html文件的发送请求代码更改为，将请求改为PUT
xhr.open('PUT', 'http://127.0.0.1:8888/', true)

```

![image-20220616135244873](.\img\image-20220616135244873.png)

可以看到错误为不能使用`put`方法，

![image-20220616135341420](.\img\image-20220616135341420.png)

上面请求为我们要发送的请求，产生了cors错误，原因：服务器没有统一put方式的请求

下面为浏览的的预请求，

![image-20220616135523196](.\img\image-20220616135523196.png)

可以看到预请求方法为OPTIONS方法

![image-20220616135603012](.\img\image-20220616135603012.png)

可以看到我们本来要发送的请求，由于预请求的返回参数中put不被允许，我们的这个请求就没有发出去，在服务器端也可以看到没有接受到get请求，只接受到了options请求

简单请求一定会发出去，根据服务器处理，看是否会产生错误



非简单请求的服务端处理

```js
// 服务器端代码
const http = require('http')

const server = http.createServer((req, res) => {
  console.log(req.method)
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  }
  if (req.method.toLocaleLowerCase() === 'options') {
    res.setHeader('Access-Control-Allow-Methods', 'PUT')
  }
  res.statusCode = 200
  res.end('hello serve2')
})
server.listen(8888, '127.0.0.1', () => {
  console.log('serve start success')
})
```

浏览器结果

![image-20220616140725005](.\img\image-20220616140725005.png)

首先发出了预请求，然后发出了真正的请求

![image-20220616140836708](.\img\image-20220616140836708.png)

在node端打印信息console.log(req.method)，也可以看到打印了OPTIONS  PUT



当请求头中的Content-Type为其他值时，服务器端的`Access-Control-Allow-Headers`字段，设置中也需要包含Content-Type

Content-Type没有设置其他值，简单请求，无问题

```
// serverr.js
const http = require('http')

const server = http.createServer((req, res) => {
  console.log(req.method)
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  }
  if (req.method.toLocaleLowerCase() === 'options') {
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST')
  }
  res.statusCode = 200
  req.on('data', data => {
    console.log(data)
  })
  res.end('hello serve2')
})
server.listen(8888, '127.0.0.1', () => {
  console.log('serve start success')
})

// html
let xhr = new XMLHttpRequest()
let data = {
  test: 'echo'
}
let param = JSON.stringify(data)
xhr.open('POST', 'http://127.0.0.1:8888')

xhr.onreadystatechange = function(){
  if (xhr.readyState === 4){
    if (xhr.status === 200){
      console.log(xhr.responseText);
    } else {
      console.error(xhr.statusText);
    }
  }
};
xhr.send(param)

```



还是属于简单请求，

![image-20220617184637655](.\img\image-20220617184637655.png)



Content-Type为其他值，服务器端没有处理有问题

```
// html代码修改，添加一行代码
xhr.setRequestHeader('Content-Type', 'application/json');

```

![image-20220617184840661](.\img\image-20220617184840661.png)

![image-20220617185252899](.\img\image-20220617185252899.png)

服务端没有返回`Access-Control-Allow-Headers`字段，错误



服务器端处理，没有问题

```
// server.js
res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

服务器端拿到的数据：
<Buffer 7b 22 74 65 73 74 22 3a 22 65 63 68 6f 22 7d>
```

当第一种情况，简单请求，没有设置application/json，服务器端没有设置`Access-Control-Allow-Headers`字段，拿到的数据是一样的，Content-Type只是用于怎么样解析数据，（规范）