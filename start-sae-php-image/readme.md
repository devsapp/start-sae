# 将PHP镜像部署到SAE
## 本地快速体验
通过该应用，您可以简单快速的使用SEA组件部署php镜像。

- 下载命令行工具：`npm install -g @serverless-devs/s`
- 初始化一个模版项目：`s init start-sae-php-image`
- 执行`s deploy`命令，自动将php镜像部署到Serverless应用引擎SAE，并绑定公网SLB，让您的应用可以被公网访问。

## PHP镜像说明
code文件夹下是制作镜像用到的文件，镜像地址为：registry-vpc.cn-hangzhou.aliyuncs.com/namespace4sae/php-server:v1。您也可以按照[以下步骤](https://help.aliyun.com/document_detail/348799.html)制作自己的PHP镜像。

### 步骤一：制作基础镜像
基础镜像里包含常用的扩展和配置，在后续每次构建时就无需重复执行这些步骤。

1. 创建项目文件。创建一个用于存放PHP资源的项目文件夹，命名为php。在PHP文件夹下，创建一个用于存放基础镜像资源的项目文件夹，命名为base。
2. 执行以下命令，进入项目目录。
```
cd php/base
```
3. 创建并编辑Dockerfile文件，文件内容如下：
```Dockerfile
FROM php:7.3.32-fpm-alpine3.13
LABEL MAINTAINER="sae@aliyun.com"
ENV TZ "Asia/Shanghai"

# 时区
RUN echo ${TZ} >/etc/timezone

# 可选
# COPY composer.phar /usr/local/bin/composer

# 创建www用户
RUN addgroup -g 1000 -S www && adduser -s /sbin/nologin -S -D -u 1000 -G www www

# 配置阿里云镜像源，加快构建速度。
RUN sed -i "s/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g" /etc/apk/repositories

# PHPIZE_DEPS包含gcc g++等编译辅助类库，完成后删除;pecl安装扩展。
RUN apk add --no-cache $PHPIZE_DEPS \
    && apk add --no-cache libstdc++ libzip-dev vim\
    && apk update \
    && pecl install redis-5.3.0 \
    && pecl install zip \
    && pecl install swoole \
    && docker-php-ext-enable redis zip swoole\
    && apk del $PHPIZE_DEPS

# docker-php-ext-install安装扩展。
RUN apk update \
    && apk add --no-cache nginx freetype libpng libjpeg-turbo freetype-dev libpng-dev libjpeg-turbo-dev  \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ --with-png-dir=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install -j$(nproc) pdo_mysql opcache bcmath mysqli

# 在run.sh
COPY run.sh /run.sh
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" && mkdir -p /run/nginx/ && chmod +x /run.sh

ENTRYPOINT ["/run.sh"]
```
> **说明** 该镜像文件同时采用pecl和docker-php-ext-install安装扩展，二者差异如下：
> - pecl可以自动下载或者指定包安装扩展，安装完以后需要用docker-php-ext-enable启用扩展。
> - docker-php-ext-install可以安装的扩展有限，可以通过docker-php-ext-install help查询可以安装的扩展列表，安装以后默认启用。
4. **可选**：修改镜像。
> **说明** 步骤1的基础镜像将Nginx和PHP配置在同一个镜像内，同时启动php-fpm和nginx，符合常见的虚拟机部署习惯，但并不满足容器提倡的单进程管理模型。您可以考虑将php-fpm和nginx分别部署成两个应用，只需要针对上述镜像做少许修改即可。

创建并编辑run.sh文件，文件内容如下：
```shell
#!/usr/bin/env sh
set -e

php-fpm -D
nginx -g 'daemon off;'
```
5. 执行以下命令，构建镜像。
```
docker build -t php-bash:v1 .
```
输出示例如下：
```
Sending build context to Docker daemon  4.096kB
Step 1/11 : FROM php:7.3.32-fpm-alpine3.13
 ---> 2e127e9a****
......
Step 11/11 : ENTRYPOINT ["/run.sh"]
 ---> Using cache
 ---> dfde0cef****
Successfully built dfde0cef****
Successfully tagged php-bash:v1
```
### 步骤二：制作业务镜像
您可以按需对步骤一的镜像进行部分修改，以此作为您企业内使用的基础镜像，则后续的业务镜像都可以将其作为父镜像。

1. 在php项目目录下，创建Dockerfile文件。
```Dockerfile
FROM  php-bash:v1

# 把阿里云镜像地址换成内网地址，不开公网就可以安装各种软件。
RUN sed -i "s/mirrors.aliyun.com/mirrors.cloud.aliyuncs.com/g" /etc/apk/repositories && sed -i "s/https/http/g" /etc/apk/repositories

# php-fpm配置
COPY www.conf /usr/local/etc/php-fpm.d/www.conf
# Nginx配置
COPY default.conf /etc/nginx/http.d/

COPY index.php /var/www/html
```
2. 创建并编辑www.conf文件，文件内容如下：
```
[www]
user = www
group = www
listen = 0.0.0.0:9000
pm = dynamic
pm.max_children = 100
pm.start_servers = 30
pm.min_spare_servers = 20
pm.max_spare_servers = 50
```
3. 创建并编辑default.conf文件，文件内容如下：
```
server {
  listen 80;
  root /var/www/html;
  index index.html index.htm index.php;

  location ~ .*\.(php|php5)?$
  {
    fastcgi_pass   127.0.0.1:9000;
    fastcgi_index index.php;
    fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    include        fastcgi_params;
  }

  access_log  /tmp/nginx_access.log;
  error_log  /tmp/nginx_error.log;
}
```
4. 创建并编辑index.php文件，文件内容如下：
```php
<html>
    <head>
        <title>PHP Hello SAE!</title>
    </head>
    <body>
        <?php echo '<h1>Hello SAE</h1>'; ?>
        <?php phpinfo(); ?>
    </body>
</html>
```
5. 在容器镜像服务控制台创建两个镜像仓库，分别命名为php-base和php-server。
个人版和企业版实例均适用本文的操作，本文以个人版实例为例。具体操作，请参见以下文档：
- 个人版实例：[构建仓库与镜像](https://help.aliyun.com/document_detail/60997.htm?spm=a2c4g.11186623.0.0.6c3a9f3cqePByL#topic1686)
- 企业版实例：[使用企业版实例构建镜像](https://help.aliyun.com/document_detail/300068.htm?spm=a2c4g.11186623.0.0.6c3a2838sSe8ap#task-2035247)
6. 构建并推送镜像。
您可以在目标镜像仓库的基本信息页面的镜像指南页签查询具体命令。更多信息，请参见以下文档：
- 个人版实例：[使用个人版实例推送拉取镜像](https://help.aliyun.com/document_detail/198212.htm?spm=a2c4g.11186623.0.0.6c3a2838sSe8ap#task-2022849)
- 企业版实例：[使用企业版实例推送和拉取镜像](https://help.aliyun.com/document_detail/198690.htm?spm=a2c4g.11186623.0.0.6c3a2838sSe8ap#task-2023726)
执行以下命令，构建镜像。
```
docker build -t php-server:v1 .
```
输出示例如下：
```
Sending build context to Docker daemon   5.12kB
Step 1/5 : FROM  php-bash:v1
 ---> dfde0cef****
......
Step 5/5 : COPY index.php /var/www/html
 ---> Using cache
 ---> e2c25424****
Successfully built e2c25424****
Successfully tagged php-server:v1
```

执行以下命令，登录远端镜像仓库。
本步骤假设您使用的是阿里云ACR仓库。
```
docker login --username=<镜像仓库登录名> registry.<regionId>.aliyuncs.com
```
示例如下：
```
docker login --username=****@188077086902**** registry.cn-hangzhou.aliyuncs.com
```
在返回结果中输入密码，如果显示login succeeded，则表示登录成功。如何设置密码，请参见设置[镜像仓库登录密码](https://help.aliyun.com/document_detail/198690.htm?spm=a2c4g.11186623.0.0.6c3a2838sSe8ap#section-08e-k20-m0g)。
执行以下命令，给镜像打标签。
```
docker tag [ImageId] registry.<regionId>.aliyuncs.com/****/php-server:<镜像版本号>
```
ImageId：镜像ID。
registry.<regionId>.aliyuncs.com/****/php-server：镜像仓库地址。
示例如下：
```
docker tag php-server:v1 registry.cn-hangzhou.aliyuncs.com/php/php-server:v1
```
执行以下命令，推送镜像至个人版实例。
```
docker push registry.<regionId>.aliyuncs.com/php/php-server:<镜像版本号>
```
示例如下：
```
docker push registry.cn-hangzhou.aliyuncs.com/php/php-server:v1
```
成功推送后，您可以登录[容器镜像服务控制台](https://cr.console.aliyun.com/?spm=a2c4g.11186623.0.0.6c3a2838sSe8ap)，在目标镜像仓库的镜像版本页面查看推送的版本。
### 步骤三：部署镜像

```yaml
code:
  type: php
  image: registry-vpc.cn-hangzhou.aliyuncs.com/namespace4sae/php-server:v1
```
将s.yaml文件中的code.image的地址替换为您自己的镜像地址，执行`s deploy`命令，自动将php镜像部署到SAE。执行结果示例如下：
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