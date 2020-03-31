FROM nginx:1.13.12-alpine

COPY build/*.dmg /usr/share/nginx/html/download/eregistry-desktop.dmg
COPY build/*.exe /usr/share/nginx/html/download/eregistry-desktop.exe