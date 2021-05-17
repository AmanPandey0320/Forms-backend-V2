FROM node:14
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5600
CMD ["npm", "start"]