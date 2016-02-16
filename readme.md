# VeryNginx
VeryNginx is a very powerful and friendly nginx .

##介绍

VeryNginx 基于 `lua_nginx_module(openrestry)` 开发，实现了高级的防火墙、访问统计和其他的一些功能。 强化了 Nginx 本身的功能，并提供了友好的 Web 交互界面。

###Nginx 运行状态分析

* 每秒请求数
* 响应时间
* 网络流量
* 网络连接数

![Nginx 运行状态](http://ww4.sinaimg.cn/mw690/3fcd0ed3jw1f0mhozu43wj20uj0mcgob.jpg)


###请求过滤
VeryNginx 可以基于按照以下信息对请求进行过滤：

* IP
* UserAgent
* 请求路径 (URI)
* 请求参数

![Nginx 运行状态](http://ww2.sinaimg.cn/mw690/3fcd0ed3jw1f0mhp07rgoj20vb0n4gof.jpg)


VeryNginx 预置了常用的过滤规则，可以在一定程度上阻止常见的 SQL 注入、Git 及 SVN 文件泄露、目录遍历攻击，并拦截常见的扫描工具。

同时 VeryNginx 的过滤器还支持 IP 黑/白名单设置

###访问统计

VeryNginx 可以统计网站每个URI的访问情况，包括每个URI的:

* 总请求次数
* 各状态码次数
* 返回总字节数
* 每请求平均字节数
* 总响应时间
* 平均响应时间

并且可以按各种规则排序进行分析。

![Nginx 运行状态](http://ww4.sinaimg.cn/mw690/3fcd0ed3jw1f0mhp0lq5ij20vb0n4aes.jpg)

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

登录之后就可以查看状态，并对配置进行修改了。修改配置后，记得到 「配置 > 系统 > 全部配置」去保存.

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

Don't forget to visit "配置 > 系统 > 全部配置" to save your changes.

## Tips

* New configs will be effective immediately upon saving. It's not necessary to restart or reload nginx.

* When you save config, VeryNginx will write all configs to `/opt/VeryNginx/VeryNginx/config.json`.

* If you lock yourself out of VeryNginx by doing something stupid, you can always delete `config.json` to revert VeryNginx to its default.

###Enjoy~

[^openresty]: [OpenResty](https://github.com/openresty/openresty) 是一个Nginx再发行版本，包含了标准Nginx以及很多扩展模块. 

