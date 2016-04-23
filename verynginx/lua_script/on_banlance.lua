-- -*- coding: utf-8 -*-
-- @Date    : 2016-04-23 
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : load balancer by lua

local _M = {}

local VeryNginxConfig = require "VeryNginxConfig"
local balancer = require "ngx.balancer"
local math = require "math"

math.randomseed(ngx.time()) 


function _M.find_node( node_list )

    local rate_sum = 0
    for name,node in pairs( node_list ) do
        rate_sum = rate_sum + tonumber(node['rate']) 
    end
    ngx.log( ngx.ERR, 'rate_sum',rate_sum)
    
    local p = math.random( rate_sum )
    ngx.log( ngx.ERR, 'p',p)

    for name,node in pairs( node_list ) do
        local tmp = tonumber(node['rate'])
        if p <= tmp then
            return node
        else
            p = p - tmp
        end
    end
end


function _M.run()
    ngx.log( ngx.ERR, "---ngx.balancer---")
    ngx.log( ngx.ERR, ngx.var.vn_proxy_target)
    
    local rule = VeryNginxConfig.configs['backend_upstream'][ngx.var.vn_proxy_target]
    local node = _M.find_node( rule['node'] )
    
    ngx.log( ngx.ERR, 'ip',node['ip'],node['port'])

    local ok, err = balancer.set_current_peer( node['ip'], node['port'])
    if not ok then
        ngx.log(ngx.ERR, "failed to set the current peer: ", err)
        return ngx.exit(500)
    end

    return
end

_M.run()

return _M

