FROM node:lts-slim


WORKDIR /home/node/app

RUN npm install -g pnpm

USER node

CMD ["sh", "-c","pnpm install && tail -f /dev/null"]