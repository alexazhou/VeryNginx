# VeryNginx
VeryNginx 是一个功能强大而对人类友好的 Nginx 扩展程序.

### 提示
 `v0.2` 版本之后，控制台入口被移动到了 `/verynginx/index.html`

## 介绍

VeryNginx 基于 `lua_nginx_module(openrestry)` 开发，实现了高级的防火墙、访问统计和其他的一些功能。 集成在 Nginx 中运行，扩展了 Nginx 本身的功能，并提供了友好的 Web 交互界面。

[VeryNginx在线实例](http://alexazhou.xyz/vn/index.html) 

用户名 / 密码: **verynginx / verynginx**

详细配置说明见：[VeryNginx Github WiKi](https://github.com/alexazhou/VeryNginx/wiki/目录)

### Nginx 运行状态分析

* 每秒请求数
* 响应时间
* 网络流量
* 网络连接数

![Nginx 运行状态](http://ww2.sinaimg.cn/mw690/3fcd0ed3jw1f17en7oc1yj20z00ol0wl.jpg)


### 自定义行为

VeryNginx 包含强大的自定义功能，可以做很多事情

自定义行为包含两部分， Matcher 和 Action 。 Matcher 用来对请求进行匹配， Action 为要执行的动作

这样的优势在于把所有的前置判断整合在Matcher里一起来实现了，使复杂(组合)规则的实现变成了可能

#### Matcher

一个 Matcher 用来判断一个 Http 请求是否符合指定的条件， 一个 Matcher 可以包含一个或者多个约束条件，目前支持以下几种约束：

* Client IP
* Host
* UserAgent
* URI
* Referer
* Request Args

当一个请求没有违反 Matcher 中包含的全部条件时，即命中了这个 Matcher 

#### Action

每个 Action 会引用一个 Matcher ，当 Matcher 命中时， Action 会被执行

目前已经实现了以下 Action

* **Scheme Lock** 将访问协议锁定为 Https 或者 Http
* **Redirect** 对请求进行重定向
* **URI Rewrite** 对请求的 URI 进行内部重写
* **Browser Verify** 通过set-cookies 和 js 验证客户端是否为浏览器，并拦截非浏览器流量。本功能可能会阻拦搜索引擎爬虫，建议仅在被攻击时开启，或者针对搜索引擎编写特别的规则。
* **Frequency Limit** 访问频率限制
* **Filter(waf)** 过滤器

因为 Matcher 可以对请求进行细致的匹配，所以结合 Filter Action，就可以实现一个高级的WAF，可以利用Matcher中所有的条件来对请求进行过滤，并返回指定状态码

VeryNginx 预置了常用的过滤规则，可以在一定程度上阻止常见的 SQL 注入、Git 及 SVN 文件泄露、目录遍历攻击，并拦截常见的扫描工具。

![VeryNginx Matcher](http://ww2.sinaimg.cn/mw690/3fcd0ed3jw1f17en8ovthj20zs0pdn1x.jpg)

![VeryNginx filter](http://ww3.sinaimg.cn/mw690/3fcd0ed3jw1f17en9lrarj20zw0piq77.jpg)

#### Backend

每个 Backend 会引用一个 Matcher ，当 Matcher 命中时， 请求会通过 Backend 进行处理

目前已经实现了以下 Backend

* **Proxy Pass** 将请求反向代理到其它服务器
* **Static File** 使用本地文件处理请求

### 访问统计

VeryNginx 可以统计网站每个URI的访问情况，包括每个URI的:

* 总请求次数
* 各状态码次数
* 返回总字节数
* 每请求平均字节数
* 总响应时间
* 平均响应时间

并且可以按各种规则排序进行分析。

![Nginx 运行状态](http://ww1.sinaimg.cn/mw690/3fcd0ed3jw1f17ena2ipyj20zw0piqag.jpg)

## 安装和使用说明

VeryNginx 基于 OpenResty[^openresty]，所以安装 VeryNginx 需要先安装好 OpenResty。不过并不用担心安装过程中可能的麻烦，VeryNginx 自身提供了脚本来进行安装工作。

### 安装 VeryNginx

克隆 VeryNginx 仓库到本地, 然后进入仓库目录，执行以下命令 

```
python install.py install
```

即可一键安装 VeryNginx 和 以及依赖的 OpenResty

#### 想使用自己的 Nginx?

VeryNginx 可以自动为你安装依赖的 OpenResty，通常情况下你**没有必要**再自己安装 OpenResty。

但如果你想要**使用自己编译的 Nginx( OpenResty )**，也是可以的。具体方法请阅读Wiki中的这篇说明:[Use own nginx](https://github.com/alexazhou/VeryNginx/wiki/Use-own-nginx)
### 使用

#### 编辑 Nginx 配置文件

VeryNginx 的配置文件位置为 **/opt/verynginx/openresty/nginx/conf/nginx.conf**，这是一个简单的示例文件，可以让你访问到 VeryNginx的控制面板。如果你想真正的用 VeryNginx 来做点什么，那你需要编辑这个文件，并将自己的 Nginx 配置加入到其中。

>这个配置文件在普通的 Nginx 配置文件基础上添加了三条 Include 指令来实现功能，分别为 
>
* include /opt/verynginx/verynginx/nginx_conf/in_external.conf;
* include /opt/verynginx/verynginx/nginx_conf/in_http_block.conf;
* include /opt/verynginx/verynginx/nginx_conf/in_server_block.conf;
>
以上三条指令分别放在 http 配置块外部，http 配置块内部，server 配置块内部，在修改时请保留这三条。如果添加了新的 Server 配置块或 http 配置块，也需要在新的块内部加入对应的 include 行。

### 启动／停止／重启 服务

完成安装工作以后，可以通过以下命令来运行 VeryNginx

```
#启动服务
/opt/verynginx/openresty/nginx/sbin/nginx

#停止服务
/opt/verynginx/openresty/nginx/sbin/nginx -s stop

#重启服务
/opt/verynginx/openresty/nginx/sbin/nginx -s reload
```


### 通过web面板对 VeryNginx 进行配置

VeryNginx 启动后，可以通过浏览器访问管理面板来查看状态以及进行配置。

管理面板地址为 `http://{{your_machine_address}}/verynginx/index.html`。

默认用户名和密码是 `verynginx` / `verynginx`。

登录之后就可以查看状态，并对配置进行修改了。修改配置后，点击保存才会生效.

### 故障排除

如果你在 **安装** / **配置** / **使用** 的过程中遇到任何问题, 你可以参考故障排除文档来解决.

[故障排除](https://github.com/alexazhou/VeryNginx/wiki/Trouble-Shooting) 


#### 详细的配置说明

VeryNginx 按照易于使用的思想进行设计，如果你有一定的基础，或是对 Nginx 较了解，那么你应该可以直接在界面上使用。

当然 VeryNginx 也提供了详细的文档供你查阅。
[VeryNginx Wiki](https://github.com/alexazhou/VeryNginx/wiki/目录)

#### 提示

* 通过 VeryNginx 控制面板保存新配置之后，会立刻生效，并不需要 restart/reload Nginx。

* VeryNginx 把配置保存在 `/opt/verynginx/verynginx/configs/config.json` 里面。

* 状态页面图表默认带有动画效果，如果有卡顿，可以点右上角齿轮图标关掉动画效果

* 如果因为配错了什么选项，导致无法登录，可以手动删除 `config.json` 来清空配置，或者手动编辑这个文件来修复。

### 更新 VeryNginx ／ OpenResty

随着时间的发展，VeryNginx 本身的代码会演进，也可以会支持更新版本的 OpenResty ，更新的代码可能会支持一些新的功能，或是修复了一些旧的bug。如果要更新本地已经安装的 VeryNginx ，你只需要先 pull github 上最新的代码到本地，然后通过以下命令来进行更新：


```
#更新 Verynginx
python install.py update verynginx

#更新 OpenResty
python install.py update openresty

```

install.py脚本在升级过程中，将保留原有的 config.json 和 nginx.conf, 所以**更新的过程并不会丢失配置**

## 构建VeryNginx docker 镜像

在将代码clone到本地之后，你可以运行下面的命令：

```
cd VeryNginx
docker build -t verynginx .
docker run -d --name=verynginx -p 8080:80 verynginx
```
然后用浏览器打开 `http://{{your_docker_machine_address}}/verynginx/index.html`

当然你也可以运行 `docker run -d --name=verynginx -p xxxx:80 verynginx` 来映射一下你的container的端口到你的宿主机，默认是80，你可以把xxxx改成你希望的在宿主机上的端口号

## 捐赠

如果你喜欢 VeryNginx，那么你可以通过捐赠来支持我开发 VeryNginx。有了你的支持，我将可以让 VeryNginx 变的更好😎

### PayPal 

[通过 PayPal 来支持 VeryNginx](https://www.paypal.me/alexazhou)

### 微信

扫描下方的二维码来支持 VeryNginx

<img title="WeChat QRcode" src="http://ww4.sinaimg.cn/mw690/3fcd0ed3jw1f6kecm1e3nj20f00emq59.jpg" width="200">


## 致谢

[感谢大家对VeryNginx的帮助](https://github.com/alexazhou/VeryNginx/wiki/Thanks)



