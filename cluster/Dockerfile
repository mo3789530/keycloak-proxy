FROM python:3.9-slim-buster
ENV PYTHONUNBUFFERED 1

RUN apk update \
    && apk add --no-cache --virtual .build-rundeps \
        linux-headers \
        build-base \
        mariadb-connector-c-dev \
        libxml2-dev \
        libxslt-dev 

RUN mkdir /code

WORKDIR /code
ADD ./requirements.txt /code/

RUN pip3 install -r requirements.txt
ADD . /code/

EXPOSE 8080
