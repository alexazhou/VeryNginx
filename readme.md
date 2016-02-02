# VeryNginx
VeryNginx is a very powerful and friendly nginx

注：目前正在开发中，并不可以用于生产环境。

##介绍

VeryNginx基于lua_nginx_module(openrestry)开发，实现了高级的防火墙，访问统计，和其他的一些功能，大幅度强化了Nginx本身的功能，并提供了更友好的web交互界面。

###Nginx运行状态查看

* 每秒请求数
* 响应时间
* 网络流量
* 网络连接数

###请求过滤
VeryNginx可以基于按照以下信息对请求进行过滤：

* IP
* UserAgent
* 请求路径(URI)
* 请求参数

VeryNginx预置了常用的过滤规则，可以阻止SQL注入，Git，SVN文件泄露，目录遍历攻击，并拦截常见的扫描工具。

同时VeryNginx的过滤器还可以支持IP黑/白名单设置

###访问统计

VeryNginx可以统计网站每个URI的访问情况，包括每个URI的:

* 总请求次数
* 各状态码次数
* 返回总字节数
* 每请求平均字节数
* 总响应时间
* 平均响应时间

并提供可视化界面，可以按各种规则排序进行分析。

##installation

###1. VeryNginx base on openresty, so you nee install openresty first.

<pre>
wget https://openresty.org/download/ngx_openresty-1.9.7.1.tar.gz   
tar -xvzf ngx_openresty-1.9.7.1.tar.gz
cd ngx_openresty-1.9.7.1
sudo su
./configure --prefix=/opt/VeryNginx --user=nginx --group=nginx --with-http_stub_status_module --with-luajit
gmake
gmake install
</pre>

###2. checkout VeryNginx repository , link nginx.conf and VeryNginx folder to nginx config dir.
<pre>
cd ~
git clone https://github.com/alexazhou/VeryNginx.git
rm -f /opt/VeryNginx/nginx/conf/nginx.conf
cp ~/VeryNginx/nginx.conf /opt/VeryNginx/nginx/conf/nginx.conf
cp -r ~/VeryNginx/VeryNginx /opt/VeryNginx/VeryNginx
chown -R nginx /opt/VeryNginx
chgrp -R nginx /opt/VeryNginx
</pre>

##run 
you can run it with: <code>/opt/VeryNginx/nginx/sbin/nginx </code>

stop it with : <code>/opt/VeryNginx/nginx/sbin/nginx -s stop</code>

##configs
just goto http://127.0.0.1/VeryNginx/dashboard/index.html 

you can modify the configs and goto "配置>系统>全部配置" to save it.

when you save config, VeryNginx will write all configs to /opt/VeryNginx/VeryNginx/config.json.

you can delete it to revert VeryNginx to default config.

###Enjoy it~

