// 写一些测试文件，没有用
import { readdir } from 'node:fs/promises'
import path from 'node:path'
// node 使用import需要添加.mjs后缀
const currentPath = process.cwd()
console.log(currentPath)
try {
  const files = await readdir(path.join(currentPath, './docs'))
  // 忽略的文件夹
  let ignoredFolders = ['.vitepress']
  let resFils = []
  for (const file of files) {
    if (file.endsWith('.md')) continue
    if (ignoredFolders.includes(file)) continue
    resFils.push(file)
  }

  console.log(typeof files, typeof files[0])
  console.log(resFils)
} catch (err) {
  console.error(err)
}
