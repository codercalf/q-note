| 命令                                                         | 释义                            |
| ------------------------------------------------------------ | ------------------------------- |
| git init                                                     |                                 |
| git clone                                                    |                                 |
| git clone \<url\> \<自定义仓库名\>                               |                                 |
| git status / git status -s / git status --short              |                                 |
| git add                                                      |                                 |
| git diff / git diff --staged or git diff --cached            | 工作区与索引变化/索引与仓库变化 |
| git commit -m                                                |                                 |
| git commit -a -m                                             |                                 |
| git rm                                                       | 此次修改次文件还没有提交        |
| git rm -f                                                    |                                 |
| git rm --cache                                               | 本地不删除                      |
| git mv \<old file\> \<new file\>                                 |                                 |
| 等同 mv \<old file\> \<new file\> , git rm \<old file\>, git add \<new file\> |                                 |
| git log                                                      |                                 |
| git log -p / git log --patch -\<number\>                       |                                 |
|                                                              |                                 |
|                                                              |                                 |



| 命令                   | 释义               |
| ---------------------- | ------------------ |
| git commit --amend     | 给上次提交打补丁   |
| git reset HEAD \<file\>  | 取消已经暂存的文件 |
| git checkout -- \<file\> |                    |
|                        |                    |



| 命令                                       | 释义                           |
| ------------------------------------------ | ------------------------------ |
| git remote                                 |                                |
| git remote -v                              |                                |
| git remote add \<shortname\> \<url\>           | 自行添加远程仓库               |
| git fetch                                  |                                |
| git fetch \<自定义的远程仓库名\>             |                                |
| git remote show \<remote\>                   | 要查看某一个远程仓库的更多信息 |
| git remote rename \<old name\> \<new name\>    | 修改远程仓库的简写名字         |
| git log --oneline --decorate --graph --all |                                |
| git branch -d \<branch name\>                |                                |





