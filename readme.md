# VeryNginx
VeryNginx is a very powerful and friendly nginx

##介绍

VeryNginx基于lua_nginx_module(openrestry)开发，实现了高级的防火墙，访问统计，和其他的一些功能，大幅度强化了Nginx本身的功能，并提供了更友好的web交互界面。

###Nginx运行状态分析

* 每秒请求数
* 响应时间
* 网络流量
* 网络连接数

![Nginx运行状态](http://ww4.sinaimg.cn/mw690/3fcd0ed3jw1f0mhozu43wj20uj0mcgob.jpg)


###请求过滤
VeryNginx可以基于按照以下信息对请求进行过滤：

* IP
* UserAgent
* 请求路径(URI)
* 请求参数

![Nginx运行状态](http://ww2.sinaimg.cn/mw690/3fcd0ed3jw1f0mhp07rgoj20vb0n4gof.jpg)


VeryNginx预置了常用的过滤规则，可以一定程度上阻止常见的SQL注入，Git，SVN文件泄露，目录遍历攻击，并拦截常见的扫描工具。

同时VeryNginx的过滤器还可以支持IP黑/白名单设置

###访问统计

VeryNginx可以统计网站每个URI的访问情况，包括每个URI的:

* 总请求次数
* 各状态码次数
* 返回总字节数
* 每请求平均字节数
* 总响应时间
* 平均响应时间

并且可以按各种规则排序进行分析。

![Nginx运行状态](http://ww4.sinaimg.cn/mw690/3fcd0ed3jw1f0mhp0lq5ij20vb0n4aes.jpg)

##Installation

### Install Nginx / OpenResty

VeryNginx is based on OpenResty, so you need to install that first.

<pre>
wget https://openresty.org/download/ngx_openresty-1.9.7.1.tar.gz
tar -xvzf ngx_openresty-1.9.7.1.tar.gz
cd ngx_openresty-1.9.7.1
sudo su
./configure --prefix=/opt/VeryNginx --user=nginx --group=nginx --with-http_stub_status_module --with-luajit
gmake
gmake install
</pre>

VeryNginx makes use of only the following modules in OpenResty.

*  [lua-nginx-module](https://github.com/openresty/lua-nginx-module)
*  http_stub_status_module
*  lua-cjson library

> If you don't want to install OpenResty, or you already have a working installation of Nginx, you can always prepare your Nginx with those modules manually.
>
> The nginx-extras package from your Linux distro is usually a good start.

### Deploy VeryNginx

Checkout VeryNginx repository, link nginx.conf and VeryNginx folder to nginx config dir.

<pre>
cd ~
git clone https://github.com/alexazhou/VeryNginx.git
rm -f /opt/VeryNginx/nginx/conf/nginx.conf
cp ~/VeryNginx/nginx.conf /opt/VeryNginx/nginx/conf/nginx.conf
cp -r ~/VeryNginx/VeryNginx /opt/VeryNginx/VeryNginx

# The following line makes /opt/VeryNginx writable for nginx, so that VeryNginx can modify configs inside it.
# Change user and group name to the actual account.
chown -R nginx:nginx /opt/VeryNginx
</pre>

### Configure Nginx

You should add your sites into `/opt/VeryNginx/nginx/nginx.conf`. However you should not modify the VeryNginx config code in the file unless you know what you're doing.

VeryNginx config code looks like the following:

<pre>
#-----------------VeryNginx config code------------------
lua_package_path '/opt/VeryNginx/VeryNginx/lua_script/?.lua;;/opt/VeryNginx/VeryNginx/lua_script/module/?.lua;;';
lua_package_cpath '/opt/VeryNginx/VeryNginx/lua_script/?.so;;';
lua_code_cache on;

lua_shared_dict status 1m;
lua_shared_dict summary_long 10m;
lua_shared_dict summary_short 10m;

init_by_lua_file /opt/VeryNginx/VeryNginx/lua_script/on_init.lua;
rewrite_by_lua_file /opt/VeryNginx/VeryNginx/lua_script/on_rewrite.lua;
access_by_lua_file /opt/VeryNginx/VeryNginx/lua_script/on_access.lua;
log_by_lua_file /opt/VeryNginx/VeryNginx/lua_script/on_log.lua;
#---------------VeryNginx config code end-----------------
</pre>

> You can have your own Nginx installation to work with VeryNginx by integrating its config code into you own config file.

##Start service
 <code>/opt/VeryNginx/nginx/sbin/nginx </code>

##Stop service
 <code>/opt/VeryNginx/nginx/sbin/nginx -s stop</code>

##Configure VeryNginx
Open your web browser and go to `http://127.0.0.1/VeryNginx/dashboard/index.html`.

Default user and password is `verynginx` / `verynginx`. You should be able to work through all the options now.

Don't forget to visit "配置>系统>全部配置" to save your changes.

## Tips

* New configs will be effective immediately upon saving. It's not necessary to restart or reload nginx.

* When you save config, VeryNginx will write all configs to `/opt/VeryNginx/VeryNginx/config.json`.

* If you lock yourself out of VeryNginx by doing something stupid, you can always delete `config.json` to revert VeryNginx to its default.


###Enjoy~
