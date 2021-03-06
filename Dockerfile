FROM node:12-alpine
ARG SONGKICK_API_KEY
ARG FRONTEND_ORIGIN
ENV SONGKICK_API_KEY $SONGKICK_API_KEY
ENV FRONTEND_ORIGIN $FRONTEND_ORIGIN
ENV APP_DIR /gigmap
RUN mkdir $APP_DIR
COPY ./bin $APP_DIR/bin/
COPY ./src $APP_DIR/src/
COPY package* $APP_DIR/
WORKDIR $APP_DIR
RUN yarn install --silent --production
EXPOSE 4000
ENV NODE_ENV production
CMD ["yarn", "start"]