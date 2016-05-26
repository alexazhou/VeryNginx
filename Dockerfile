FROM python:2.7.11-wheezy

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    wget perl make build-essential procps \
    libreadline-dev libncurses5-dev libpcre3-dev libssl-dev \
 && rm -rf /var/lib/apt/lists/*

RUN mkdir /code
COPY . /code
WORKDIR /code
RUN groupadd -r nginx && useradd -r -g nginx nginx
RUN python install.py install

EXPOSE 80

CMD ["/opt/verynginx/openresty/nginx/sbin/nginx", "-g", "daemon off; error_log /dev/stderr info;"]
