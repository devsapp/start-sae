# python-app-docker-demo
使用python+flask+gunicorn web应用程序构建并运行一个简单的docker映像。

## 创建 Dockerfile

```
FROM python:2.7

# 创建应用程序源代码目录
RUN mkdir -p /usr/src/app

# 设置容器的主目录
WORKDIR /usr/src/app

# 安装python依赖项
COPY requirements.txt /usr/src/app/
RUN pip install --no-cache-dir -r requirements.txt

# 将src代码复制到容器
COPY . /usr/src/app

# 应用程序环境变量
#ENV APP_ENV development
ENV PORT 8080

# 暴露端口
EXPOSE $PORT

# 设置持久数据
VOLUME ["/app-data"]

# 运行Python应用程序
CMD gunicorn -b :$PORT -c gunicorn.conf.py main:app
```

## 构建镜像
```
sudo docker build -t my-python-app:1.0.1 .
```

## 查看镜像
```
$ sudo docker images
REPOSITORY              TAG                 IMAGE ID            CREATED             SIZE
my-python-app           1.0.1               2b628d11ba3a        22 minutes ago      701.6 MB
docker.io/python        2.7                 b1d5c2d7dda8        13 days ago         679.3 MB
docker.io/hello-world   latest              05a3bd381fc2        5 weeks ago         1.84 kB
```

`2b628d11ba3a` 为刚刚构建的镜像id。

+ tag 
```
sudo docker tag 2b628d11ba3a my-python-app:1.0.1
sudo docker tag 2b628d11ba3a my-python-app:latest
```

+ remove image
```
$ sudo docker rmi --force 2b628d11ba3a
```

#### 运行镜像
```
$ sudo docker run -d -p 8080:8080 my-python-app:1.0.1
```

使用 `sudo docker ps` 查看运行中的容器。
```
$ sudo docker ps
CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS              PORTS                    NAMES
4de6041072b7        my-python-app:1.0.1   "/bin/sh -c 'gunicorn"   20 minutes ago      Up 20 minutes       0.0.0.0:8080->8080/tcp   elegant_kowalevski
```

`4de6041072b7` 是刚刚启动的容器id。

+ 查看容器日志
```
$ sudo docker logs 4de6041072b7
[2017-10-23 20:29:49 +0000] [7] [INFO] Starting gunicorn 19.6.0
[2017-10-23 20:29:49 +0000] [7] [INFO] Listening at: http://0.0.0.0:8080 (7)
[2017-10-23 20:29:49 +0000] [7] [INFO] Using worker: gthread
[2017-10-23 20:29:49 +0000] [11] [INFO] Booting worker with pid: 11
[2017-10-23 20:29:49 +0000] [12] [INFO] Booting worker with pid: 12

```

+ 停止容器
```
$ sudo docker stop 4de6041072b7
```

## 测试应用
```
$ curl http://localhost:8080
Hello World
```
