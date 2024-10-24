位置`_createServer` -> `resolveConfig`

1. sortUserPlugins

   作用：排序

   文档：https://cn.vitejs.dev/guide/api-plugin.html#plugin-ordering

   

加载插件：resolvePlugins(workerResolved, workerPrePlugins, workerNormalPlugins, workerPostPlugins);

闭包：createPluginHookUtils(resolvedConfig.worker.plugins) 存上面加载的插件

这个中间件是使用插件的：middlewares.use(transformMiddleware(server))

transformMiddleware -> transformRequest -> doTransform -> loadAndTransform -> pluginContainer.transform

transform, 位置 createPluginContainer函数里

里面获取transform类型的插件然后执行

