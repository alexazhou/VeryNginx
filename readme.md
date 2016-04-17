# VeryNginx
VeryNginx is a very powerful and friendly nginx .

[English document](#description)

###Notice
After v0.2 , The entry uri of control panel was moved to `/verynginx/index.html`

##介绍

VeryNginx 基于 `lua_nginx_module(openrestry)` 开发，实现了高级的防火墙、访问统计和其他的一些功能。 强化了 Nginx 本身的功能，并提供了友好的 Web 交互界面。

[VeryNginx在线实例](http://alexazhou.xyz/vn/index.html) 

用户名 / 密码: **verynginx / verynginx**

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
* Host
* UserAgent
* URI
* Referer
* Request Args

当一个请求没有违反 Matcher 中包含的全部条件时，即命中了这个 Matcher 

####Action

每个 Action 会引用一个 Matcher ，当 Matcher 命中时， Action 会被执行

目前已经实现了以下 Action

* **Scheme Lock** 将访问协议锁定为 Https 或者 Http
* **Redirect** 对请求进行重定向
* **URI Rewrite** 对请求的 URI 进行内部重写
* **Browser Verify** 通过set-cookies 和 js 验证客户端是否为浏览器，并拦截非浏览器流量。本功能可能会阻拦搜索引擎爬虫，建议仅在被攻击时开启，或者针对搜索引擎编写特别的规则。
* **Filter(waf)** 过滤器

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

### 安装 VeryNginx

克隆 VeryNginx 仓库到本地, 然后进入仓库目录，执行以下命令 

```
python install.py install
```

即可一键安装 VeryNginx 和 以及依赖的 OpenResty

### 更新 VeryNginx

在 VeryNginx 仓库中执行git pull, 然后执行以下命令 

```
python install.py update verynginx
```

即可升级 VeryNginx 到最新版本，更新的过程不会丢失配置

### 安装过程说明

VeryNginx 基于 OpenResty[^openresty]，所以 install.py 在安装 VeryNginx 的过程中，会自动安装依赖的 OpenResty，安装之后的目录结构如下：

* /opt/verynginx/openresty  **依赖的 openresty**
* /opt/verynginx/verynginx  **verynginx 程序目录**

接着脚本将复制 /opt/verynginx/verynginx/nginx.conf 到 openresty 目录中，使得 nginx 在处理网络请求的过程中调用 VeryNginx 的相关方法来完成处理


VeryNginx 实际使用到了 OpenResty 中的这些模块

*  [lua-nginx-module](https://github.com/openresty/lua-nginx-module)
*  http_stub_status_module
*  lua-cjson library

如果你不想安装 OpenResty，或者你已经有了一个正在工作的 Nginx，你也可以自己手动为 Nginx 编译安装这些模块，然后再仿照 VeryNginx 提供 nginx.conf，向自己的 nginx.conf 中加入相应配置行 

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
 `/opt/verynginx/verynginx/nginx/sbin/nginx`

##停止服务
 `/opt/verynginx/verynginx/nginx/sbin/nginx -s stop`

##对 VeryNginx 进行配置
打开浏览器访问 `http://127.0.0.1/VeryNginx/index.html`。

默认用户名和密码是 `verynginx` / `verynginx`。

登录之后就可以查看状态，并对配置进行修改了。修改配置后，记得到 「Config > System > All Configuration」去保存.

如果需要详细的配置说明，请查看 [VeryNginx Wiki](https://github.com/alexazhou/VeryNginx/wiki)

## 提示

* 通过 VeryNginx 控制面板保存新配置之后，会立刻生效，并不需要 restart/reload Nginx。

* VeryNginx 把配置保存在 `/opt/VeryNginx/VeryNginx/config.json` 里面。

* 状态页面图表默认带有动画效果，如果有卡顿，可以点右上角齿轮图标关掉动画效果

* 如果因为配错了什么选项，导致无法登录，可以手动删除 `config.json` 来清空配置。

## 致谢

[感谢大家对VeryNginx的帮助](https://github.com/alexazhou/VeryNginx/wiki/Thanks)


###Enjoy~


##Description

VeryNginx base on `lua_nginx_module(openrestry)` ,implements advanced firewall(waf), access statistics and some other features. Strengthen the Nginx own function, and provides a friendly Web interface.

[VeryNginx online demo](http://alexazhou.xyz/vn/index.html) 

User / Password: **verynginx / verynginx**

###Nginx run status analyzing

* Request per second
* Response time
* Net Traffic
* Tcp connectinn num

###Custom Action

VeryNginx support custom actions, can do a lot os things.

Custom action consists of two parts, `Matcher`和 `Action` . `Matcher` used to test whether a request meets the rule， `Action` is the logic you want run.

>The advantage of this disign is that the `Matcher` include all select rule, and can be reused, make use rule to describe a very complex logic becomes possible

####Matcher

`Matcher` used to select a part of all requests, a `Matcher` may contain one or more condition, these conditions are currently supported:

* Client IP
* Host
* UserAgent
* URI
* Referer
* Request Args

When a request not conflicted with all the conditions of the Matcher, the request will be selected by the `Matcher`

####Action

Every `Action` refers to a `Matcher` , and will run on the requests selected by the `Matcher` 

Now we has these `Action`

* **Scheme** Lock lock the scheme to http/https
* **Redirect** redirect request
* **URI Rewrite** do internal rewrite on the request
* **Browser Verify** use set-cookies and javascript to verify the client is a browser，and block traffic of the robot. This action may block the spider of search engine, so please enable it when under attack only.
* **Filter** block some request, can do the WAF

Matcher can select requests by multiple conditions, so with Filter Action, we got a powerful waf. The waf can filter requests wich complex rules and return special status code when it block a request.

VeryNginx preset some simple filter rules, can prevent simple SQL injection , Git and SVN file disclosure, directory traversal attacks and common scanning tool.

###Request statistics

VeryNginx can record the request of URI, include these data of every URI:

* All Request Count
* Request count of every status code
* Total Bytes 
* Avg Bytes
* Total response time
* Avg reqponse time


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
cp -r ~/VeryNginx/VeryNginx /opt/VeryNginx

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
Open your web browser and go to `http://127.0.0.1/VeryNginx/index.html`.

Default user and password is `verynginx` / `verynginx`. You should be able to work through all the options now.

Don't forget to visit "Config > System > All Configuration" to save your changes.

The full version of config guide can be found in [VeryNginx Wiki](https://github.com/alexazhou/VeryNginx/) .

## Tips

* New configs will be effective immediately upon saving. It's not necessary to restart or reload nginx.

* When you save config, VeryNginx will write all configs to `/opt/VeryNginx/VeryNginx/config.json`.

* If the chat in status page is stuck, you can click the gear icon in the upper right corner to turn off animation

* If you lock yourself out of VeryNginx by doing something stupid, you can always delete `config.json` to revert VeryNginx to its default.

## Thanks

[VeryNginx thanks for the help](https://github.com/alexazhou/VeryNginx/wiki/Thanks)



###Enjoy~

[^openresty]: [OpenResty](https://github.com/openresty/openresty) 是一个Nginx再发行版本，包含了标准Nginx以及很多扩展模块. 

