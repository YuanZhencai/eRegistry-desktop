desktop:
	chmod -R +rwx dist/release
	docker build . -t registry.cn-hangzhou.aliyuncs.com/palan/eregistry-desktop -f Dockerfile.desktop
web:
	npm run build:web
	docker build . -t registry.cn-hangzhou.aliyuncs.com/palan/eregistry-web -f Dockerfile.web
image:
	docker build . -t registry.cn-hangzhou.aliyuncs.com/palan/eregistry-frontend
push: image
	docker push registry.cn-hangzhou.aliyuncs.com/palan/eregistry-desktop
