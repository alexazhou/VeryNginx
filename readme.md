# VeryNginx
VeryNginx is a very powerful and friendly nginx .

[中文文档](https://github.com/alexazhou/VeryNginx/blob/master/readme_zh.md)

###Notice
After v0.2 , The entry uri of control panel was moved to `/verynginx/index.html`


##Description

VeryNginx base on `lua_nginx_module(openrestry)` ,implements advanced firewall(waf), access statistics and some other features. Strengthen the Nginx own function, and provides a friendly Web interface.

[VeryNginx online demo](http://alexazhou.xyz/vn/index.html) 

User / Password: **verynginx / verynginx**

The full version of config guide can be found in: [VeryNginx Wiki](https://github.com/alexazhou/VeryNginx/wiki) .


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
* **Frequency Limit** limit max request time in a specified time period
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

VeryNginx is based on OpenResty, so you need to install it first. But don't warry, VeryNginx give a script to do it automatic.


```
python install.py install
```

Just run this command, openresty and verynginx will be installed automatic.
 
####Want using custom nginx?

VeryNginx can install openresty automatic so that you **needn't install nginx(openresty) manually**.

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

The address  of dashboard is `http://{{your_machine_address}}/VeryNginx/index.html`.

Default user and password is `verynginx` / `verynginx`. You should be able to work through all the options now.

The full version of config guide can be found in [VeryNginx Wiki](https://github.com/alexazhou/VeryNginx/) .


#### Tips

* New configs will be effective immediately upon saving. It's not necessary to restart or reload nginx.

* When you save config, VeryNginx will write all configs to `/opt/verynginx/verynginx/configs/config.json`.

* If the chat in status page is stuck, you can click the gear icon in the upper right corner to turn off animation

* If you lock yourself out of VeryNginx by doing something stupid, you can always delete `config.json` to revert VeryNginx to its default.

###Update VeryNginx / OpenResty

Over time, VeryNginx own will evolution, and can also supported new version of OpenResty. New version of verynginx might support some new features or fixes some old bug. If you want to update locally installed VeryNginx, you just need pull latest code from github to local, and run following command:


```
#Update VeryNginx
python install.py update verynginx

#Update OpenResty
python install.py update openresty

```

install.py will keep the old config.json and  nginx.conf during updating. So that you **willn't lost configuration** after update.



## Thanks

[VeryNginx thanks for the help](https://github.com/alexazhou/VeryNginx/wiki/Thanks)


###Enjoy~

[^openresty]: [OpenResty](https://github.com/openresty/openresty) 是一个Nginx再发行版本，包含了标准Nginx以及很多扩展模块. 

