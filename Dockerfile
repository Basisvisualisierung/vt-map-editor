FROM node:12.14

WORKDIR /app

COPY package.json .

RUN npm install
RUN npm install -g @angular/cli

COPY . .

CMD ng serve --host 0.0.0.0
