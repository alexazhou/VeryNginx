# VeryNginx
VeryNginx is a very powerful and friendly nginx .

[中文文档](https://github.com/alexazhou/VeryNginx/blob/master/readme_zh.md)

### Notice
After v0.2 , The entry uri of control panel was moved to `/verynginx/index.html`


## Description

VeryNginx is based on `lua_nginx_module(openrestry)`. It implements advanced firewall(waf), access statistics and some other features. It strengthens the Nginx's functions, and provides a friendly Web interface.

[VeryNginx online demo](http://alexazhou.xyz/vn/index.html) 

User / Password: **verynginx / verynginx**

The full version of config guide can be found on: [VeryNginx Wiki](https://github.com/alexazhou/VeryNginx/wiki) .

### Nginx run status analyzing

* Request per second
* Response time
* Net Traffic
* Tcp connectinn num

![Nginx status](http://ww2.sinaimg.cn/mw690/3fcd0ed3jw1f17en7oc1yj20z00ol0wl.jpg)


### Custom Action

VeryNginx supports custom actions, which can do a lot of things.

Custom action consists of two parts, `Matcher` and `Action` . `Matcher` is used to test whether a request meets the rule， `Action` is the logic you want to run.

>The advantage of this design is that the `Matcher` includes all select rule, and can be reused, making use of rules to describe a very complex logic possible.

#### Matcher

A `Matcher` is used to select a part of all requests, a `Matcher` may contain one or more condition. The following conditions are currently supported:

* Client IP
* Host
* UserAgent
* URI
* Referer
* Request Args

When a request does not conflict with any of the conditions of the Matcher, the request will be selected by the `Matcher`

#### Action

Every `Action` refers to a `Matcher` , and will run on the requests selected by the `Matcher` 

Now we have these `Action`s

* **Scheme** Lock lock the scheme to http/https
* **Redirect** Redirect request
* **URI Rewrite** Do internal rewrite on the request
* **Browser Verify** Use set-cookies and javascript to verify the client is a browser，and block traffic of the robot. This action may block the spider of search engine, so please enable it when under attack only.
* **Frequency Limit** Limit max request time in a specified time period
* **Filter** Block some request, can do the WAF

Matcher can select requests by multiple conditions, so with Filter Action, we got a powerful waf. The waf can filter requests with complex rules and return special status code when it block a request.

VeryNginx presets some simple filter rules, which can prevent simple SQL injection, Git and SVN file disclosure, directory traversal attacks and common scanning tool.

![VeryNginx Matcher](http://ww2.sinaimg.cn/mw690/3fcd0ed3jw1f17en8ovthj20zs0pdn1x.jpg)

![VeryNginx filter](http://ww3.sinaimg.cn/mw690/3fcd0ed3jw1f17en9lrarj20zw0piq77.jpg)

#### Backend

Every `Backend` refers to a `Matcher`，and will handle the requests selected by the `Matcher`

Now we have these `Backend`

* **Proxy Pass** Proxy the request to other server
* **Static File** Use local file to handle the request file 

### Request statistics

VeryNginx can record the request of URI, include these data of every URI:

* All Request Count
* Request count of every status code
* Total Bytes 
* Avg Bytes
* Total response time
* Avg reqponse time


![request statistics](http://ww1.sinaimg.cn/mw690/3fcd0ed3jw1f17ena2ipyj20zw0piqag.jpg)


## Installation

### Install Nginx / OpenResty

VeryNginx is based on OpenResty, so you need to install it first. But don't warry, VeryNginx gives a script to do it automatically.


```
python install.py install
```

Just run this command, openresty and verynginx will be installed automatically.
 
#### Want using custom nginx?

VeryNginx can install openresty automatically so that you **needn't install nginx(openresty) manually**.

But if you want use a nginx compiled by you self, that also ok. You can see that for some help 

[Use-own-nginx](https://github.com/alexazhou/VeryNginx/wiki/Use-own-nginx)

### Usage

#### Edit nginx configuration file

The configuration file of VeryNginx is `/opt/verynginx/openresty/nginx/conf/nginx.conf`, that's a demo. It just can let verynginx run so that you can see the dashboard of verynginx. If you want do something really useful, you need edit that file and add your own nginx configuration into it.

>
This configuration file add three `include` command to embeded verynginx into original nginx( openresty ) 

>
* include /opt/verynginx/verynginx/nginx_conf/in_external.conf;
* include /opt/verynginx/verynginx/nginx_conf/in_http_block.conf;
* include /opt/verynginx/verynginx/nginx_conf/in_server_block.conf;

>These `include` command were placed outside a block, block http internal configuration, server configuration block inside, Remenber keep these three line when modifying. If you add a new Server configuration block or http configuration block, also need add suitable `include` line into it.

### Start / Stop / Restart Service

```
#Start Service
/opt/verynginx/openresty/nginx/sbin/nginx

#Stop Service
/opt/verynginx/openresty/nginx/sbin/nginx -s stop

#Restart Service
/opt/verynginx/openresty/nginx/sbin/nginx -s reload

```

### Configure VeryNginx on dashboard

After the service begin running, you can see server status and do config on dashboard.

The address  of dashboard is `http://{{your_machine_address}}/verynginx/index.html`.

Default user and password is `verynginx` / `verynginx`. You should be able to work through all the options now.

The full version of config guide can be found in [VeryNginx Wiki](https://github.com/alexazhou/VeryNginx/) .

### Trouble Shooting

If you have any problems during **installation** / **configuration** / **use** , you can refer the Trouble Shooting document.

[Trouble Shooting](https://github.com/alexazhou/VeryNginx/wiki/Trouble-Shooting) 

#### Tips

* New configs will be effective immediately upon saving. It's not necessary to restart or reload nginx.

* When you save config, VeryNginx will write all configs to `/opt/verynginx/verynginx/configs/config.json`.

* If the chat in status page is stuck, you can click the gear icon in the upper right corner to turn off animation

* If you lock yourself out of VeryNginx by doing something stupid, you can always delete `config.json` to revert VeryNginx to its default.

### Update VeryNginx / OpenResty

Over time, VeryNginx own will evolve, and can also support newer version of OpenResty. New version of VeryNginx might support some new features or fix some old bugs. If you want to update locally installed VeryNginx, you just need pull the latest code from github to local, and run the following commands:

```
#Update VeryNginx
python install.py update verynginx

#Update OpenResty
python install.py update openresty

```

install.py will keep the old config.json and nginx.conf during update. So that you **will not lost configuration** after update.

### Build VeryNginx docker Image

After cloning code to your local filesystem, you can run the following commands:

```
docker build -t verynginx .
docker run verynginx
```

Then you can navigate to your browser `http://{{your_docker_machine_address}}/verynginx/index.html`

Optionally you can run `docker run -p xxxx:80 verynginx` to map your container port 80 to your host's xxxx port


## Donate

If you like VeryNginx, you can donate to support my development VeryNginx. With your support, I will be able to make VeryNginx better 😎.

### PayPal 

[Support VeryNginx via PayPal](https://www.paypal.me/alexazhou)

### We Chat

Scan the QRcode to support VeryNginx.

<img title="WeChat QRcode" src="http://ww4.sinaimg.cn/mw690/3fcd0ed3jw1f6kecm1e3nj20f00emq59.jpg" width="200">

## Thanks

[VeryNginx thanks for the help](https://github.com/alexazhou/VeryNginx/wiki/Thanks)


### Enjoy~

[^openresty]: [OpenResty](https://github.com/openresty/openresty) Openresty is a enhanced nginx，bundle standard nginx core and lots of 3rd-party nginx module. 

