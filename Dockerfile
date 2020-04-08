FROM nginx:1.13.12-alpine

COPY dist/release /usr/share/nginx/html/download
