# cli

## 注册

定义了命令行的类

主要是针对启动时不同的参数，执行不同的函数

比如`build`、`preview`。（vite命令详见：https://cn.vitejs.dev/guide/cli.html）

一共注册了4个命令

```js
.command('[root]', 'start dev server')
.command('build [root]', 'build for production')
.command('optimize [root]', 'pre-bundle dependencies')
.command('preview [root]', 'locally preview production build')

```

支持链式调用

```
.option 根据后面的参数，进行个性化处理
.alias 别名
.action 执行这个命令，执行的函数
等
```

## 执行顺序

```
1. cli.parse();
命令匹配，执行哪个命令
2. this.runMatchedCommand();
执行匹配的命令
3. command.commandAction.apply(this, actionArgs);
command.commandAction   action 注册的命令
4. 加载有关服务的文件，执行createServer

```

