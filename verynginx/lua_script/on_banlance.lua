-- -*- coding: utf-8 -*-
-- @Date    : 2016-04-23 
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : load balancer by lua

local _M = {}

local balancer = require "ngx.balancer"

function _M.run()
    --ngx.log( ngx.ERR, ngx.var.vn_proxy_target)
    local ok, err = balancer.set_current_peer( ngx.var.vn_proxy_host , ngx.var.vn_proxy_port )
    if not ok then
        ngx.log(ngx.ERR, "failed to set the current peer: ", err)
        return ngx.exit(500)
    end

    return
end

_M.run()

return _M

