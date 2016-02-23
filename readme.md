# VeryNginx
VeryNginx is a very powerful and friendly nginx .

##介绍

VeryNginx 基于 `lua_nginx_module(openrestry)` 开发，实现了高级的防火墙、访问统计和其他的一些功能。 强化了 Nginx 本身的功能，并提供了友好的 Web 交互界面。

###Nginx 运行状态分析

* 每秒请求数
* 响应时间
* 网络流量
* 网络连接数

![Nginx 运行状态](http://ww2.sinaimg.cn/mw690/3fcd0ed3jw1f17en7oc1yj20z00ol0wl.jpg)


###自定义行为

VeryNginx 包含强大的自定义功能，可以做很多事情

自定义行为包含两部分， Matcher 和 Action 。 Matcher 用来对请求进行匹配， Action 为要执行的动作

这样的优势在于把所有的前置判断整合在Matcher里一起来实现了，使复杂(组合)规则的实现变成了可能

####Matcher

一个 Matcher 用来判断一个 Http 请求是否符合指定的条件， 一个 Matcher 可以包含一个或者多个约束条件，目前支持以下几种约束：

* Client IP
* Domain
* UserAgent
* URI
* Referer
* Request Args

当一个请求满足了 Matcher 中包含的全部条件时，即命中了这个 Matcher

####Action

每个 Action 会引用一个 Matcher ，当 Matcher 命中时， Action 会被执行

目前已经实现了以下 Action

* Scheme Lock 将访问协议锁定为 Https 或者 Http
* Redirect 对请求进行重定向
* URI Rewrite 对请求的 URI 进行内部重写
* Filter(waf) 过滤器

因为 Matcher 可以对请求进行细致的匹配，所以结合 Filter Action，就可以实现一个高级的WAF，可以利用Matcher中所有的条件来对请求进行过滤，并返回指定状态码

VeryNginx 预置了常用的过滤规则，可以在一定程度上阻止常见的 SQL 注入、Git 及 SVN 文件泄露、目录遍历攻击，并拦截常见的扫描工具。

![VeryNginx Matcher](http://ww2.sinaimg.cn/mw690/3fcd0ed3jw1f17en8ovthj20zs0pdn1x.jpg)

![VeryNginx filter](http://ww3.sinaimg.cn/mw690/3fcd0ed3jw1f17en9lrarj20zw0piq77.jpg)


###访问统计

VeryNginx 可以统计网站每个URI的访问情况，包括每个URI的:

* 总请求次数
* 各状态码次数
* 返回总字节数
* 每请求平均字节数
* 总响应时间
* 平均响应时间

并且可以按各种规则排序进行分析。

![Nginx 运行状态](http://ww1.sinaimg.cn/mw690/3fcd0ed3jw1f17ena2ipyj20zw0piqag.jpg)

##安装说明

### 安装 Nginx / OpenResty

VeryNginx 基于 OpenResty[^openresty]，所以你需要先安装它：


```sh
wget https://openresty.org/download/ngx_openresty-1.9.7.1.tar.gz
tar -xvzf ngx_openresty-1.9.7.1.tar.gz
cd ngx_openresty-1.9.7.1
sudo su
./configure --prefix=/opt/VeryNginx --user=nginx --group=nginx --with-http_stub_status_module --with-luajit
gmake
gmake install
```

>以上使用的是openresty-1.9.7.1，当openresty发布更新的稳定版本时，也可以使用最新的稳定版本

VeryNginx 实际使用到了 OpenResty 中的这些模块

*  [lua-nginx-module](https://github.com/openresty/lua-nginx-module)
*  http_stub_status_module
*  lua-cjson library

如果你不想安装 OpenResty，或者你已经有了一个正在工作的 Nginx，你也可以自己手动为 Nginx 编译安装这些模块

### 部署 VeryNginx

克隆 VeryNginx 仓库到本地, 复制 nginx.conf 和 VeryNginx 文件夹到 Nginx 的工作目录.

```sh
cd ~
git clone https://github.com/alexazhou/VeryNginx.git
rm -f /opt/VeryNginx/nginx/conf/nginx.conf
cp ~/VeryNginx/nginx.conf /opt/VeryNginx/nginx/conf/nginx.conf
cp -r ~/VeryNginx/VeryNginx /opt/VeryNginx/VeryNginx
# 下面是使 /opt/VeryNginx 对 nginx 是可写的, 这样 VeryNginx 可以把自己的配置保存在里面
# 修改/opt/VeryNginx目录的所有者为nginx用户
chown -R nginx:nginx /opt/VeryNginx
```

### 编辑 Nginx 配置文件

VeryNginx 项目提供了一个配置模版 `/opt/VeryNginx/nginx/nginx.conf`。你需要把自己站点的 Nginx 配置加到这个模版里面。 但是记得不要修改配置 VeryNginx 的那部分代码（除非你知道自己在干啥 😈）。

配置 VeryNginx 的代码是下面这部分:

```
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
```

> 如果不使用 VeryNginx 提供的配置模版，你也可以手动把这部分加入到自己的 Nginx 配置文件中. (如果安装路径不是 `/opt/VeryNginx`，需要对 `lua_package_cpath` 和 `lua_package_path` 的值进行修改)

##启动服务
 `/opt/VeryNginx/nginx/sbin/nginx`

##停止服务
 `/opt/VeryNginx/nginx/sbin/nginx -s stop`

##对 VeryNginx 进行配置
打开浏览器访问 `http://127.0.0.1/VeryNginx/dashboard/index.html`。

默认用户名和密码是 `verynginx` / `verynginx`。

登录之后就可以查看状态，并对配置进行修改了。修改配置后，记得到 「Config > System > All Configuration」去保存.

## 提示

* 通过 VeryNginx 控制面板保存新配置之后，会立刻生效，并不需要 restart/reload Nginx。

* VeryNginx 把配置保存在 `/opt/VeryNginx/VeryNginx/config.json` 里面。

* 如果因为配错了什么选项，导致无法登录，可以手动删除 `config.json` 来清空配置。


###Enjoy~



##Installation

### Install Nginx / OpenResty

VeryNginx is based on OpenResty, so you need to install it first.

```sh
wget https://openresty.org/download/ngx_openresty-1.9.7.1.tar.gz
tar -xvzf ngx_openresty-1.9.7.1.tar.gz
cd ngx_openresty-1.9.7.1
sudo su
./configure --prefix=/opt/VeryNginx --user=nginx --group=nginx --with-http_stub_status_module --with-luajit
gmake
gmake install
```

>At here we used the v1.9.7.1 of openresty, if there is a new stable version of openresty has been released, we alse can use it.  

VeryNginx uses only following modules in OpenResty.

*  [lua-nginx-module](https://github.com/openresty/lua-nginx-module)
*  http_stub_status_module
*  lua-cjson library

> If you don't want to install OpenResty, or you already have a working installation of Nginx, you can always configure your Nginx with those modules manually.
>
> The `nginx-extras` package from your Linux distro is usually a good start.

### Deploy VeryNginx

Checkout VeryNginx repository, link nginx.conf and VeryNginx folder to nginx config directory.

```sh
cd ~
git clone https://github.com/alexazhou/VeryNginx.git
rm -f /opt/VeryNginx/nginx/conf/nginx.conf
cp ~/VeryNginx/nginx.conf /opt/VeryNginx/nginx/conf/nginx.conf
cp -r ~/VeryNginx/VeryNginx /opt/VeryNginx/VeryNginx

# The following line makes /opt/VeryNginx writable for nginx, so that VeryNginx can modify configs inside it.
# Change user and group name to the actual account.
chown -R nginx:nginx /opt/VeryNginx
```

### Configure Nginx

You should add your sites into `/opt/VeryNginx/nginx/nginx.conf`. However you should not modify the VeryNginx config code in the file unless you know what you're doing 😈.

VeryNginx config code looks like the following:

```
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
```

> You can have your own Nginx installation to work with VeryNginx by integrating its config code into you own config file.

##Start service
 `/opt/VeryNginx/nginx/sbin/nginx`

##Stop service
 `/opt/VeryNginx/nginx/sbin/nginx -s stop`

##Configure VeryNginx
Open your web browser and go to `http://127.0.0.1/VeryNginx/dashboard/index.html`.

Default user and password is `verynginx` / `verynginx`. You should be able to work through all the options now.

Don't forget to visit "Config > System > All Configuration" to save your changes.

## Tips

* New configs will be effective immediately upon saving. It's not necessary to restart or reload nginx.

* When you save config, VeryNginx will write all configs to `/opt/VeryNginx/VeryNginx/config.json`.

* If you lock yourself out of VeryNginx by doing something stupid, you can always delete `config.json` to revert VeryNginx to its default.

###Enjoy~

[^openresty]: [OpenResty](https://github.com/openresty/openresty) 是一个Nginx再发行版本，包含了标准Nginx以及很多扩展模块. 

