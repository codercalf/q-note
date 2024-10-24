# Router

前端路由：

1. history
2. hash
3. 忘了

## 1. 浏览器的History对象

### 1.1 属性

| 属性   | 意思                                                         |
| ------ | ------------------------------------------------------------ |
| length | 当前窗口访问过的所有页面网址（当然包括当前页面）             |
| state  | History 对象的当前状态，通常是undefined，未设置，chorme下只读，如果是对象，可以修改属性值 |

### 1.2 方法

| 方法名                          | 参数 | 作用                                           |
| ------------------------------- | ---- | ---------------------------------------------- |
| back()                          |      |                                                |
| forward()                       |      |                                                |
| go(number)                      |      | 参数为0时，刷新页面                            |
| pushState(state, title, url)    |      | 在历史中添加一条记录，执行此命令之后不刷新页面 |
| replaceState(state, title, url) |      | 将当前记录修改，用法同上，执行此命令不刷新页面 |

#### pushState

参数

1. state：与此页面相关联的状态对象，只读，如果是对象，里面的属性可以修改，history.state可以读取**当前**页面设置的此值，

   popstate回调函数的参数

2. url：必须与当前url在同一个域，否则报错

   eg：

   | 命令                                                     | 设置前的地址栏                 | 设置后的地址栏                |
   | -------------------------------------------------------- | ------------------------------ | ----------------------------- |
   | history.pushState(null, '', '/x/x.html')                 | https://juejin.cn/xx.html      | https://juejin.cn/x/x.html    |
   | history.pushState(null, '', '/x.html')                   |                                | https://juejin.cn/x.html      |
   | history.pushState(null, '', 'x.html')                    | https://juejin.cn/echo/xx.html | https://juejin.cn/echo/x.html |
   | history.pushState(null, '', 'https://juejin.cn/xx.html') |                                | https://juejin.cn/xx.html     |
   | history.pushState(null, '', 'https://juejin.cn/xx.html') |                                | https://juejin.cn/x/x.html    |

3. title：在浏览器都忽略此参数

**执行此命令不刷新页面，但是从别的页面重新回到此页面，会刷新**

### 1.3popstate事件

**触发时机**：仅仅调用`pushState()`方法或`replaceState()`方法 ，并不会触发该事件，只有用户点击浏览器倒退按钮和前进按钮，或者使用 JavaScript 调用`History.back()`、`History.forward()`、`History.go()`方法时才会触发。另外，该事件只针对同一个文档，如果浏览历史的切换，导致加载不同的文档，该事件也不会触发。

### 1.4 history的特点

对于 `history` 来说，主要有以下特点：

- 新的 `url` 可以是与当前 `url` 同源的任意 `url` ，也可以是与当前 `url` 一样的地址，但是这样会导致的一个问题是，会把**重复的这一次操作**记录到栈当中。
- 通过 `history.state` ，添加任意类型的数据到记录中。
- 可以额外设置 `title` 属性，以便后续使用。
- 通过 `pushState` 、 `replaceState` 来实现无刷新跳转的功能。

### 1.5 存在问题

对于 `history` 来说，确实解决了不少 `hash` 存在的问题，但是也带来了新的问题。**具体如下：**

- 使用 `history` 模式时，在对当前的页面进行刷新时，此时浏览器会重新发起请求。如果 `nginx` 没有匹配得到当前的 `url` ，就会出现 `404` 的页面。
- 而对于 `hash` 模式来说，  它虽然看着是改变了 `url` ，但不会被包括在 `http` 请求中。所以，它算是被用来指导浏览器的动作，并不影响服务器端。因此，改变 `hash` 并没有真正地改变 `url` ，所以页面路径还是之前的路径， `nginx` 也就不会拦截。
- 因此，在使用 `history` 模式时，需要**通过服务端来允许地址可访问**，如果没有设置，就很容易导致出现 `404` 的局面。

### 1.6 注意

1. location.href = 'https://xxxxx'，就算与当前url一致，也会触发刷新页面，改变history

## 2. hash

### 2.1 定义

hash 模式是一种把前端路由的路径用井号 # 拼接在真实 url 后面的模式。当井号 # 后面的路径发生变化时，浏览器并不会重新发起请求，而是会触发 onhashchange 事件。

### 2.2 网页url组成部分

#### 2.1.1 了解几个url的属性

| 属性               | 含义     |
| ------------------ | -------- |
| location.protocal  | 协议     |
| location.hostname  | 主机名   |
| location.host      | 主机     |
| location.port      | 端口号   |
| location.patchname | 访问页面 |
| location.search    | 搜索内容 |
| location.hash      | 哈希值   |

#### 2.1.2演示

**下面用一个网址来演示以上属性：**

```js
//http://127.0.0.1:8001/01-hash.html?a=100&b=20#/aaa/bbb
location.protocal // 'http:'
localtion.hostname // '127.0.0.1'
location.host // '127.0.0.1:8001'
location.port //8001
location.pathname //'01-hash.html'
location.serach // '?a=100&b=20'
location.hash // '#/aaa/bbb'
```

### 2.3 hash的特点

- hash变化会触发网页跳转，即浏览器的前进和后退。
- `hash` 可以改变 `url` ，但是不会触发页面重新加载（hash的改变是记录在 `window.history` 中），即不会刷新页面。也就是说，所有页面的跳转都是在客户端进行操作。因此，这并不算是一次 `http` 请求，所以这种模式不利于 `SEO` 优化。`hash` 只能修改 `#` 后面的部分，所以只能跳转到与当前 `url` 同文档的 `url` 。
- `hash` 通过 `window.onhashchange` 的方式，来监听 `hash` 的改变，借此实现无刷新跳转的功能。
- `hash` 永远不会提交到 `server` 端（可以理解为只在前端自生自灭）

