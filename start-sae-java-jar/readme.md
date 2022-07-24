# 将Jar包部署到SAE

## 本地快速体验
通过该应用，您可以简单快速的使用SEA组件部署jar包。

- 下载命令行工具：`npm install -g @serverless-devs/s`
- 初始化一个模版项目：`s init devsapp/start-sae/start-sae-java-jar`

code文件夹下是java开发的demo应用程序，通过maven install命令打包项目，得到demo.jar并放置在s.yaml同一目录下，通过执行`s deploy`命令，自动将demo.jar部署到Serverless应用引擎SAE，并绑定公网SLB，让您的应用可以被公网访问。执行结果示例如下：
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