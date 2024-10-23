import { defineConfig } from 'vitepress'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

// 自动生成目录结构
const currentPath = process.cwd()

async function getFolders() {
  let folders = []
  try {
    folders = await readdir(path.join(currentPath, './docs'))
  } catch (err) {
    console.error(err)
  }
  // 忽略的文件夹
  let ignoredFolders = ['.vitepress']
  let resFolders = []
  for (const folder of folders) {
    if (folder.endsWith('.md')) continue
    if (ignoredFolders.includes(folder)) continue
    let files = await readdir(path.join(currentPath, './docs', '/' + folder))
    files = files.map(i => i.replace('.md', ''))
    let item = { link: folder, files }
    resFolders.push(item)
  }
  return resFolders
}

function processFolder(folders) {
  const nav = []
  const sidebar = []
  for (const folder of folders) {
    const { link, files } = folder
    let items = files.map(i => ({ text: i, link: `/${link}/${i}` }))
    nav.push({ text: link, items })
    sidebar[`${link}`] = files.map(i => ({ text: i, link: `/${link}/${i}` }))
  }
  return { nav, sidebar }
}
const folders = await getFolders()
const { nav, sidebar } = processFolder(folders)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'My Note',
  description: 'description test',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      ...nav,
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/examples/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/examples/api-examples' },
      //   ],
      // },
      // {
      //   text: 'js',
      //   items: [{ text: 'js1', link: '/js/js1' }],
      // },
    ],

    sidebar: {
      ...sidebar,
      // '/js/': [
      //   {
      //     text: 'js',
      //     items: [{ text: 'js1', link: '/js/js1' }],
      //   },
      // ],
      // '/examples/': [
      //   { text: 'Markdown Examples', link: '/examples/markdown-examples' },
      //   { text: 'Runtime API Examples', link: '/examples/api-examples' },
      // ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
})
