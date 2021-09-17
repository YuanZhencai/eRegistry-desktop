FROM registry.cn-hangzhou.aliyuncs.com/palan/reg-book as reg-book

FROM registry.cn-hangzhou.aliyuncs.com/palan/eregistry-web as web

FROM registry.cn-hangzhou.aliyuncs.com/palan/eregistry-desktop as desktop

FROM nginx:1.17.3-alpine

COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

COPY --from=reg-book /usr/share/nginx/html /usr/share/nginx/html/help
COPY --from=desktop /usr/share/nginx/html /usr/share/nginx/html/download
COPY --from=web /usr/share/nginx/html /usr/share/nginx/html/
