image:
	cp build/*.zip dist/release
# 	cp build/*.exe dist/release
	cp build/*.json dist/release
	docker build . -t registry.cn-hangzhou.aliyuncs.com/palan/eregistry-desktop

push: image
	docker push registry.cn-hangzhou.aliyuncs.com/palan/eregistry-desktop
