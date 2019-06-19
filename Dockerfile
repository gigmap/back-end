FROM node:12
ARG SONGKICK_API_KEY
ENV SONGKICK_API_KEY $SONGKICK_API_KEY
ENV APP_DIR /gigmap
RUN mkdir $APP_DIR
COPY ./bin $APP_DIR/bin/
COPY ./src $APP_DIR/src/
COPY package* $APP_DIR/
WORKDIR $APP_DIR
RUN npm i --production
EXPOSE 4000
ENV NODE_ENV production
CMD ["npm", "start"]