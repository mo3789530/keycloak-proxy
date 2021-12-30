FROM python:3.9-alpine3.12
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

RUN apk --no-cache add build-base
RUN apk --no-cache add postgresql-dev

RUN python3 -m pip install -r requirements.txt
ADD . /code/


EXPOSE 8080

CMD ["python3", "app.py"]
