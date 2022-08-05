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

# 使用SAE组件快速部署nginx镜像
## 本地快速体验
通过该应用，您可以简单快速的使用SEA组件部署nginx镜像。

- 下载命令行工具：`npm install -g @serverless-devs/s`
- 初始化一个模版项目：`s init start-sae-nginx-image`
- 执行`s deploy`命令，自动将镜像部署到Serverless应用引擎SAE，并绑定公网SLB，让您的应用可以被公网访问。

## nginx镜像说明
code文件夹下是制作镜像用到的文件，code/the-cude使用的案例来自 https://github.com/bsehovac/the-cube。制作的镜像地址为：registry.cn-hangzhou.aliyuncs.com/namespace4sae/js-demo:v1。您也可以按照[以下步骤](https://help.aliyun.com/document_detail/432780.html)制作自己的镜像。

### 步骤一：构建镜像
1. code文件夹下是本次使用的项目代码，code内的Dockerfile内容如下：
```Dockerfile
FROM nginx:alpine
COPY the-cube/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/
```
2. 在code所在目录，执行以下命令，构建镜像。
```
docker build . -t js-demo
```
### 步骤二：推送镜像
1. 在[容器镜像服务控制台](https://cr.console.aliyun.com/?spm=a2c4g.11186623.0.0.728728d704TI4P)创建镜像仓库。
个人版和企业版实例均适用本文的操作，本文以个人版实例为例。具体操作，请参见以下文档：
- 个人版实例：[构建仓库与镜像](https://help.aliyun.com/document_detail/60997.htm?spm=a2c4g.11186623.0.0.72871ea7EkVuAt#topic1686)
- 企业版实例：[使用企业版实例构建镜像](https://help.aliyun.com/document_detail/300068.htm?spm=a2c4g.11186623.0.0.72871ea7EkVuAt#task-2035247)
2. 构建并推送镜像。
您可以在目标镜像仓库的基本信息页面的镜像指南页签查询具体命令。更多信息，请参见以下文档：
- 个人版实例：[使用个人版实例推送拉取镜像](https://help.aliyun.com/document_detail/198212.htm?spm=a2c4g.11186623.0.0.72871ea7EkVuAt#task-2022849)
- 企业版实例：[使用企业版实例推送和拉取镜像](https://help.aliyun.com/document_detail/198690.htm?spm=a2c4g.11186623.0.0.72876c30jQrakJ#task-2023726)

执行以下命令，构建镜像。
```
docker build --tag js-demo:v1 .
```
执行以下命令，登录远端镜像仓库。
```
docker login --username=<镜像仓库登录名> registry.<regionId>.aliyuncs.com
```
示例如下：
```
docker login --username=****@188077086902**** registry.cn-hangzhou.aliyuncs.com
```
在返回结果中输入密码，如果显示login succeeded，则表示登录成功。如何设置密码，请参见设置镜像仓库登录密码。
执行以下命令，给镜像打标签。
```
docker tag <ImageId> registry.<regionId>.aliyuncs.com/****/js-demo:<镜像版本号>
```
- ImageId：镜像ID。
- registry.<regionId>.aliyuncs.com/****/js-demo：镜像仓库地址。

示例如下：
```
docker tag js-demo:v1 registry.cn-hangzhou.aliyuncs.com/****/js-demo:v1
```
执行以下命令，推送镜像至个人版实例。
```
docker push registry.<regionId>.aliyuncs.com/****/js-demo:<镜像版本号>
```
示例如下：
```
docker push registry.cn-hangzhou.aliyuncs.com/****/js-demo:v1
```
成功推送后，您可以登录[容器镜像服务控制台](https://cr.console.aliyun.com/?spm=a2c4g.11186623.0.0.72876c30jQrakJ)，在目标镜像仓库的镜像版本页面查看推送的版本。

### 步骤三：部署镜像

```yaml
code:
  image: registry.cn-hangzhou.aliyuncs.com/namespace4sae/js-demo:v1
```
将s.yaml文件中的code.image的地址替换为您自己的镜像地址，执行`s deploy`命令自动将镜像部署到SAE，执行结果示例如下：
```
sae-test: 
  namespace: 
    id:          cn-hangzhou:test
    name:        test-name
    description: namespace desc
  application: 
    appId: 589fb13b-5896-49fe-a09d-d6929e9c1e01
    name:  test
  Console:     https://sae.console.aliyun.com/#/AppList/AppDetail?appId=589fb13b-5896-49fe-a09d-d6929e9c1e01&regionId=cn-hangzhou&namespaceId=cn-hangzhou:test
  slb: 
    InternetIp: 121.196.162.18
```
通过`slb.InternetIp`的值即可访问应用。

-----

> - Serverless Devs 项目：https://www.github.com/serverless-devs/serverless-devs   
> - Serverless Devs 文档：https://www.github.com/serverless-devs/docs   
> - Serverless Devs 钉钉交流群：33947367    