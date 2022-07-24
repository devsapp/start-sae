# 使用SAE组件快速部署Go镜像
## 本地快速体验
通过该应用，您可以简单快速的使用SEA组件部署go镜像。

- 下载命令行工具：`npm install -g @serverless-devs/s`
- 初始化一个模版项目：`s init start-sae-other-image`
- 执行`s deploy`命令，自动将镜像部署到Serverless应用引擎SAE，并绑定公网SLB，让您的应用可以被公网访问。

## Go镜像说明
code文件夹下是制作镜像用到的文件，镜像地址为：registry.cn-hangzhou.aliyuncs.com/namespace4sae/go-demo:v1。您也可以按照[以下步骤](https://help.aliyun.com/document_detail/432780.html)制作自己的镜像。

### 步骤一：构建镜像
1. code文件夹下是本次使用的项目代码，code内的Dockerfile内容如下：
```Dockerfile
# Golang版本；Alpine镜像的体积较小。
FROM golang:1.16.6-alpine3.14 as builder

# 替换Alpine镜像，方便安装构建包。
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装构建阶段的依赖。
RUN apk --update add gcc libc-dev upx ca-certificates && update-ca-certificates

# 将代码复制到构建镜像中。
# 注意地址不要在GOPATH中。
ADD . /workspace

WORKDIR /workspace

# 挂载构建缓存。
# GOPROXY防止下载失败。
RUN --mount=type=cache,target=/go \
  env GOPROXY=https://goproxy.cn,direct \
  go build -buildmode=pie -ldflags "-linkmode external -extldflags -static -w" \
  -o /workspace/gin-hello-world

# 运行时镜像。
# Alpine兼顾了镜像大小和运维性。
FROM alpine:3.14

EXPOSE 8080

# 方便运维人员安装需要的包。
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 创建日志目录等。
# RUN mkdir /var/log/onepilot -p && chmod 777 /var/log/onepilot && touch /var/log/onepilot/.keep

# 复制构建产物。
COPY --from=builder /workspace/gin-hello-world /app/

# 指定默认的启动命令。
CMD ["/app/gin-hello-world"]
```
2. 在code所在目录，执行以下命令，构建镜像。
```
docker build . -t gin-example
```
### 步骤二：制作镜像
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
docker build --tag go-demo:v1 .
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
docker tag <ImageId> registry.<regionId>.aliyuncs.com/****/go-demo:<镜像版本号>
```
- ImageId：镜像ID。
- registry.<regionId>.aliyuncs.com/****/go-demo：镜像仓库地址。

示例如下：
```
docker tag go-demo:v1 registry.cn-hangzhou.aliyuncs.com/****/go-demo:v1
```
执行以下命令，推送镜像至个人版实例。
```
docker push registry.<regionId>.aliyuncs.com/****/go-demo:<镜像版本号>
```
示例如下：
```
docker push registry.cn-hangzhou.aliyuncs.com/****/go-demo:v1
```
成功推送后，您可以登录[容器镜像服务控制台](https://cr.console.aliyun.com/?spm=a2c4g.11186623.0.0.72876c30jQrakJ)，在目标镜像仓库的镜像版本页面查看推送的版本。

### 步骤三：部署镜像

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