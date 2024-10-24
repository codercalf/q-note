# npm run 发生了什么

> 知识点：shell
>
> bash相关知识：https://wangdoc.com/bash/

vite项目中

1. npm run dev

   package.json中，scripts

```
  "scripts": {
    "dev": "vite",
  }
```

2. 查找node_modules/.bin 中的vite文件

   里面有三个文件 

   * vite.sh bash脚本文件
   * vite.cmd win命令行脚本
   * vite.ps1 powerShell脚本文件

3. 此处用的的win电脑，走的是cmd文件，（通过在文件中写echo确定走的是那个文件）

## 分析文件做了什么

不太懂cmd、ps1文件，此处只分析 .sh 文件

```
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*|*MINGW*|*MSYS*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../vite/bin/vite.js" "$@"
  ret=$?
else 
  node  "$basedir/../vite/bin/vite.js" "$@"
  ret=$?
fi
exit $ret
```

1. basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

   `$0`为当前 Shell 的名称（在命令行直接执行时）或者脚本名（在脚本中执行时）。

   此处是脚本名称

   dirname: 从路径中提取目录名

   sed -e 路径字符串替换

   总结：就是拿到当前bin文件的路径

2. case `uname` in
       *CYGWIN*|*MINGW*|*MSYS*) basedir=`cygpath -w "$basedir"`;;
   esac

   uname: 系统相关信息

   cygpath： 路径处理命令

   总结：根据系统，处理路径

3. if [ -x "$basedir/node" ]

   -x 是否存在后面的文件

   $basedir： bin对应的文件夹

   node

   总结：在此路径下的bin文件夹内存在node，则使用此node执行/vite/bin/vite.js文件，

   否则，直接从全局的node，执行此文件

4.  $?`为上一个命令的退出码，确定是否正常退出

总结：就是处理路径，此路径下有node，则使用此node执行，否则，使用全局的node执行，/vite/bin/vite.js



这三个文件差不多都是这个意思

