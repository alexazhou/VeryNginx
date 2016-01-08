# VeryNginx
VeryNginx is a very powerful and friendly nginx

##installation

###1. VeryNginx base on openresty, so you nee install openresty first.

 <pre>
wget https://openresty.org/download/ngx_openresty-1.9.7.1.tar.gz   
tar -xvzf ngx_openresty-1.9.7.1.tar.gz
cd ngx_openresty-1.9.7.1
./configure --prefix=/opt/VeryNginx --user=nginx --group=nginx --with-http_stub_status_module --with-luajit
gmake
gmake install
</pre>



###2. checkout VeryNginx repository , link nginx.conf and lua_script to nginx config dir.
<pre>
cd ~
git clone https://github.com/alexazhou/VeryNginx.git
rm -f /opt/VeryNginx/nginx/conf/nginx.conf
ln -s ~/VeryNginx/nginx.conf /opt/VeryNginx/nginx/conf/nginx.conf
ln -s ~/VeryNginx/VeryNginx /opt/VeryNginx/VeryNginx
chown -r nginx /opt/VeryNginx
chgrp -r nginx /opt/VeryNginx
</pre>

##run 
run: <code>/opt/VeryNginx/nginx/sbin/nginx </code>

stop : <code>/opt/VeryNginx/nginx/sbin/nginx -s stop</code>

reload run configs : <code>/opt/VeryNginx/nginx/sbin/nginx -s reload</code>

##configs
just goto http://127.0.0.1/VeryNginx/dashboard/index.html 

###Enjoy it~

