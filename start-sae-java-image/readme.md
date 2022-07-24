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

# 使用SAE组件快速部署Java镜像

## 本地快速体验
通过该应用，您可以简单快速的使用SEA组件部署image-jar。

- 下载命令行工具：`npm install -g @serverless-devs/s`
- 初始化一个模版项目：`s init start-sae-java-image`
- 执行`s deploy`命令，自动将镜像部署到Serverless应用引擎SAE，并绑定公网SLB，让您的应用可以被公网访问。

## java镜像说明
Spring Cloud、Dubbo、HSF框架下开发并编译的应用WAR包或JAR包，如果需要在Serverless应用引擎SAE（Serverless App Engine）上以镜像方式部署，需要将WAR包或JAR包制作为应用镜像，以便部署时使用。code文件夹下是制作镜像用到的文件，镜像地址为：registry.cn-hangzhou.aliyuncs.com/namespace4sae/repo4sae:v1。您也可以按照[制作Java镜像](https://help.aliyun.com/document_detail/98492.html)制作自己的镜像。

### 部署镜像
```yaml
code:
  image: registry.cn-hangzhou.aliyuncs.com/namespace4sae/go-demo:v1
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