image:
	cp build/*.dmg dist/release
	cp build/*.dmg dist/release/eregistry-desktop.dmg
	cp build/*.exe dist/release
	cp build/*.exe dist/release/eregistry-desktop.exe
	cp build/*.json dist/release
	docker build . -t registry.cn-hangzhou.aliyuncs.com/palan/eregistry-desktop

push: image
	docker push registry.cn-hangzhou.aliyuncs.com/palan/eregistry-desktop
