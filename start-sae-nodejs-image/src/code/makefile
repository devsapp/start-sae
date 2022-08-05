latest_tag=registry.cn-hangzhou.aliyuncs.com/s-sae/sae-nodejs:latest

build:
	docker build -t ${latest_tag} -f Dockerfile .

push:
	docker push ${latest_tag}