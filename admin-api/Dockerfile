FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
#RUN npm install #if you're seeing weird behavior in skaffold, and you've altered some packages, try switching to this line
COPY . .

CMD ["npm", "start"]
