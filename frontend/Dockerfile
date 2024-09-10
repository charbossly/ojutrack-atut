
#Set the base image to node:12-alpine
FROM node:16.20.0-alpine3.17 as build
#commente
# Specify where our app will live in the container
WORKDIR /app
# Copy the React App to the container
COPY . /app/
# Prepare the container for building React

RUN npm cache clean --force
RUN rm -rf node_modules yarn.lock package-lock.json
RUN npm install
RUN npm install -g create-vite
RUN npm run build
# Prepare nginx
FROM nginx:1.16.0-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
# Fire up nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]