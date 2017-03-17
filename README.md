# node-Express
用Express框架搭建了一个简单企业网后台
## 去年拿之前做过的网站模板，用Express框架搭建了一个企业站后台，今天把它传上来。

## 功能介绍
   1.轮播图增删功能
   2.案例增删功能
   3.新闻增删功能
   4.留言模块

## 项目目录
   我对node.js只是入门阶段，以供参考

   app.js 为启动文件

   settings.js 为设置数据库服务器地址

   views 存放页面
     1.admin 为后台页面
     2.home  为前台页面

   routes 设置配置路由
      1. index.js  为前台页面请求路由配置
      2. users.js  为后台增删数据路由配置

   public 为静态文件目录

   models 处理数据逻辑目录
      1. banner.js 为轮播图增删逻辑处理
      2. Case.js  为案例增删逻辑处理
      3. news.js 为新闻增删逻辑处理
      4. user.js  用户登录处理
  ## Git到本地
      1. npm install 加载依赖
      2. mongod --dbpath D:\MongoDB\qingf 启动数据库
      3. npm start 启动node
      4. 127.0.0.1:3000 就可以访问页面了
      5. 127.0.0.1:3000/users/index 就可以访问后台页面了