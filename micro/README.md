项目中的简易版微前端，由于业务和项目管理原因，无法将每个模块独立成子应用，进行单独的管理和开发。但又需要解决巨石应用开发部署耗时长的问题，便写了一个简易版可对项目按需拆分的微前端。后期可按需升级实现完整的微前端功能。

micro/client/config/MicroFrontend.js 微前端加载器
micro/client/app.js 主应用入口
micro/client/config/routers/after/app.js 子应用入口

npm i

npm run dll

npm run dev:app 启动主应用
npm run dev：xxx 启动子应用
