# 1. Etapa de compilación (Fíjate en el AS build)
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos las dependencias de forma correcta
COPY package*.json ./
RUN npm install

# Copiamos todo el contenido de la carpeta actual del frontend
COPY . .

# Compilamos
RUN npm run build 

# 2. Etapa de Servidor Web Nginx
FROM nginx:alpine

# Copiamos los archivos compilados usando el nombre exacto de la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración para que React Router funcione al actualizar la página
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]