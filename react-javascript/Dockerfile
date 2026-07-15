FROM node:20

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash 
RUN export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    nvm install --lts

COPY develop/* /app/

ARG NEXT_PUBLIC_APP_HOST
ENV NEXT_PUBLIC_APP_HOST=${NEXT_PUBLIC_APP_HOST}

WORKDIR /app
RUN ls
RUN rm -rf node_modules
RUN rm -rf .next

RUN npm install --verbose