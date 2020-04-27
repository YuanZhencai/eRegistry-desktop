FROM registry.cn-hangzhou.aliyuncs.com/palan/eregistry:web

COPY dist/release /usr/share/nginx/html/download
