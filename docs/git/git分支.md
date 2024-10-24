# git分支

## 配置用户以及账号

```
// 本地
git config user.name ''
git config user.email ''
// 全局
git config --global --replace-all user.name ''
git config --global user.email ''
```



## git分支切换

前提：先检查

```git
git status
```

已完成的保存

```git
git add ./<file name>
git commit -m
or
git stash
```

切换

```git
#切换分支
git checkout <branch name>
or
#新建并切换分支
git checkout -b <branch name>
```

当远程仓库没有分支时，提交新的分支

```git
自动补齐远程分支名字
git push <remote name> <remore branch name>
git push <remote name> <local branch name>:<remote branch name>
```

## git 推送方式从heeps转换为ssh

直接更改config文件的url

## 查看

```git
查看状态
git status
查看仓库信息
git remote	简单的分支列表
git remote -v	分支列表以及最后一次提交信息
git remote -vv	分支列表，最后一次提交信息，查看跟踪分支
查看本地分支
git branch -v
git branch -a
```

## 配置记住密码

```
永久记住密码
git config credential.helper store
默认记住15分钟
git config –global credential.helper cache
下面是自定义配置记住1小时
git config credential.helper ‘cache –timeout=3600’
```

## 贮藏工作

新的贮藏推送到栈上，运行 git stash 或 git stash push

查看贮藏的东西，可以使用 git stash list

将你最近一个贮藏的工作重新应用：git stash apply

指定一个暂存的分支重新应用：git stash apply stash@{\<number\>}

可以运行 git stash drop 加上将要移除的贮藏的名 字来移除它

可以运行 git stash pop 来应用贮藏然后立即从栈上扔掉它

## git从远程拉取本地不存在的分支

```git
//获取所有远程分支（不更新本地分支，另需merge）
git fetch

查看远程所有分支
git branch -a

查看所有本地分支，以及对应的远程分支，以及最后一次提交
git branch -vv

新建分支并切换到指定分支,并和指定的远程分支关联
git checkout -b <local branch name> origin/xxxxxxxx
将本地分支推送到远程
git push <远程主机名> <本地分支名>:<远程分支名>
```

## git暂存



```
git stash pop
git stash
git stash -u
git stash apply stash@{2} 应用某个存储,但其不会从存储列表中删除
 git stash drop stash@{0}
window shell问题，使用  git stash drop stash@”{0}“
git stash save 'xxxx'
git stash list
git stash show : 显示改动信息
git stash show stash@{1}
git stash show -p : 显示第一个存储的改动
```

