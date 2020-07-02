FROM registry.cn-hangzhou.aliyuncs.com/palan/eregistry-web as web

FROM registry.cn-hangzhou.aliyuncs.com/palan/eregistry-desktop as desktop

FROM nginx:1.17.3-alpine

COPY --from=web /usr/share/nginx/html /usr/share/nginx/html/
COPY --from=desktop /usr/share/nginx/html/download /usr/share/nginx/html/download
