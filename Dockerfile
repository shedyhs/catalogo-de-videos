FROM node:lts-slim


WORKDIR /home/node/app

RUN npm install -g pnpm

RUN apt-get update && \
    apt-get install -y \
    default-jre \
    git

USER node

CMD ["sh", "-c","pnpm install && tail -f /dev/null"]
