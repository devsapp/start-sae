<h1 align="center">SAE 组件快速应用</h1>
<p align="center" class="flex justify-center">
  <a href="https://nodejs.org/en/" class="ml-1">
    <img src="https://img.shields.io/badge/node-%3E%3D%2010.8.0-brightgreen" alt="node.js version">
  </a>
  <a href="https://github.com/devsapp/start-sae/blob/master/LICENSE" class="ml-1">
    <img src="https://img.shields.io/badge/License-MIT-green" alt="license">
  </a>
  <a href="https://github.com/devsapp/start-sae/issues" class="ml-1">
    <img src="https://img.shields.io/github/issues/devsapp/start-sae" alt="issues">
  </a>
  </a>
</p>

# 使用SAE组件部署PHP-ThinkPHP

## 本地快速体验
通过该应用，您可以简单快速的使用SEA组件部署PHP-ThinkPHP的zip包。

- 下载命令行工具：`npm install -g @serverless-devs/s`
- 初始化一个模版项目：`s init start-sae-php-thinkphp`

code文件夹下是Nginx与PHP代码文件，目录结构如下：
```
.
├── nginx                       # 存放路径/home/admin/app/nginx/
│   ├── default.conf
│   ├── fastcgi_params          # 引用方式include conf.d/fastcgi_params;
│   └── root.dir
├── php                         # 存放路径/home/admin/app/php
│   ├── README.md
│   ├── app
│   ├── artisan
│   ├── bootstrap
│   ├── composer.json
│   ├── composer.lock
│   ├── config
│   ├── database
│   ├── package.json
│   ├── phpunit.xml
│   ├── public                  # Laravel框架默认目录，配置为nginx root
│   ├── resources
│   ├── routes
│   ├── server.php
│   ├── storage
│   ├── tests
│   ├── vendor
│   └── webpack.mix.js
```
将code文件夹打包成start-sae-php-thinkphp.zip文件，通过执行`s deploy`命令，自动将start-sae-php-thinkphp.zip部署到Serverless应用引擎SAE，并绑定公网SLB，让您的应用可以被公网访问。执行结果示例如下：
```
部署成功，请通过以下地址访问您的应用：http://121.196.162.18
应用详细信息如下：
sae-test: 
  console:     https://sae.console.aliyun.com/#/AppList/AppDetail?appId=ef3a8e0f-xxxxx-63fc7e254eca&regionId=cn-hangzhou&namespaceId=cn-hangzhou
  namespace: 
    id:   cn-hangzhou
    name: China East 1 (Hangzhou)
  vpcConfig: 
    vpcId:     vpc-bpxxxxxhcc7pobl
    vSwitchId: vsw-bp1xxxxxpfg9zr
  application: 
    id:          ef3a8e0f-c87xxxxxx3fc7e254eca
    name:        test
    packageType: PhpZip
    packageUrl:  https://sae-packages-cn-hangzhou-1976152945975242.oss-cn-hangzhou.aliyuncs.com/sae-test-hello-sae-php-thinkphp.zip
    cpu:         500
    memory:      1024
    replicas:    1
  slb: 
    InternetIp: 121.196.162.18
```
通过`slb.InternetIp`的值即可访问应用。

-----

> - Serverless Devs 项目：https://www.github.com/serverless-devs/serverless-devs   
> - Serverless Devs 文档：https://www.github.com/serverless-devs/docs   
> - Serverless Devs 钉钉交流群：33947367    