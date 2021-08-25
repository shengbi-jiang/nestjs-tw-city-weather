FROM node:14.16.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE ${PORT:-8000}

CMD [ "npm", "run", "start:prod" ]
