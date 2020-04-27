image:
	cp build/*.dmg dist/release
	cp build/*.exe dist/release
	cp build/*.yml dist/release
	chmod -R +rwx dist/release
	docker build . -t registry.cn-hangzhou.aliyuncs.com/palan/eregistry-desktop

web:
	npm run build:web
	docker build . -t registry.cn-hangzhou.aliyuncs.com/palan/eregistry:web -f Dockerfile.web
push: image
	docker push registry.cn-hangzhou.aliyuncs.com/palan/eregistry-desktop
