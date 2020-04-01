image:
	docker build . -t registry.cn-hangzhou.aliyuncs.com/palan/eregistry-desktop

push: image
	docker push registry.cn-hangzhou.aliyuncs.com/palan/eregistry-desktop
