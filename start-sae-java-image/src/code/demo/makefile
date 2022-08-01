latest_tag=registry.cn-hangzhou.aliyuncs.com/s-sae/sae-java:latest

build:
	mvn package -DskipTests; docker build -t ${latest_tag} -f Dockerfile .

push:
	docker push ${latest_tag}
	