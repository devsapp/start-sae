#基于openjdk:8u181-jdk-alpine
FROM openjdk:8u181-jdk-alpine
#声明工作区
ENV MYPATH /app
WORKDIR $MYPATH
#添加jar包
ADD ./target/demo-snapshot.jar demo.jar
#添加容器卷
VOLUME $MYPATH
EXPOSE 8088
#使用java -jar app.jar去运行
CMD ["java","-jar","demo.jar"]
