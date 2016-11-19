FROM ubuntu:latest

MAINTAINER Mees van Dijk

RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get install -y ffmpeg
RUN apt-get install -y python2.7
RUN apt-get install -y curl
RUN apt-get install -y build-essential


RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -
RUN apt-get install nodejs -y

ENV PYTHON /usr/bin/python2.7

RUN mkdir -p /usr/app
WORKDIR /usr/app

ADD . .

RUN rm -rf node_modules

RUN npm install

EXPOSE 8080
CMD ["npm", "start"]
