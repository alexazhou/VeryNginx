FROM centos:7

RUN yum clean all && yum update -y  && yum install -y     gcc pcre-devel openssl-devel wget perl make build-essential procps     libreadline-dev libncurses5-dev libpcre3-dev libssl-dev

RUN mkdir /code
COPY ./ /code/
WORKDIR /code
RUN groupadd -r nginx && useradd -r -g nginx nginx
RUN python install.py install

EXPOSE 80

CMD ["/opt/verynginx/openresty/nginx/sbin/nginx", "-g", "daemon off; error_log /dev/stderr info;"]
