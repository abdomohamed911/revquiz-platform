FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY client/package.json client/package-lock.json* ./
RUN npm install

FROM base AS builder
COPY client/ ./
COPY --from=deps /app/node_modules ./node_modules
ENV REACT_APP_API_URL=http://localhost:5000
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
