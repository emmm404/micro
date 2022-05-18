项目中实现的简易版微前端，可对大型项目按模块分割，本地开发时按需挂载对应模块解决重编译耗时长问题，每个模块生成独立的打包文件可按需部署对应模块。
不采用 qiankun 的原因是，由于业务和项目管理，每个模块无法抽成子应用进行管理开发。
后期可以通过添加沙箱增加 JS 隔离，实现将其他项目并入主应用里。

micro/client/config/MicroFrontend.js 微前端加载器
micro/client/app.js 主应用入口
micro/client/config/routers/after/app.js 子应用入口

npm i

npm run dll

npm run dev:app 启动主应用
npm run dev：xxx 启动子应用
