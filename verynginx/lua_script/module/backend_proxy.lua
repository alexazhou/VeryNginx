-- -*- coding: utf-8 -*-
-- @Date    : 2016-04-20 
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : proxy_pass backend for verynginx

local _M = {}

local VeryNginxConfig = require "VeryNginxConfig"
local request_tester = require "request_tester"
local math = require "math"

math.randomseed(ngx.time()) 


function _M.find_node( node_list )
    
    local rate_sum = 0
    for name,node in pairs( node_list ) do
        ngx.log( ngx.ERR, 'rate',node['rate'])
        rate_sum = rate_sum + tonumber(node['rate']) 
    end
    --ngx.log( ngx.ERR, 'rate_sum',rate_sum)
    
    local p = math.random( rate_sum )
    --ngx.log( ngx.ERR, 'p',p)

    for name,node in pairs( node_list ) do
        local tmp = tonumber(node['rate'])
        if p <= tmp then
            return node
        else
            p = p - tmp
        end
    end
end

function _M.filter()

    if VeryNginxConfig.configs["proxy_pass_enable"] ~= true then
        return
    end
    
    local matcher_list = VeryNginxConfig.configs['matcher']
    local upstream_list = VeryNginxConfig.configs['backend_upstream']

    for i, rule in ipairs( VeryNginxConfig.configs["proxy_pass_rule"] ) do
        local enable = rule['enable']
        local matcher = matcher_list[ rule['matcher'] ] 
        if enable == true and request_tester.test( matcher ) == true then
            ngx.log(ngx.STDERR,'upstream:',rule['upstream'])

            local upstream = upstream_list[ rule['upstream'] ]
            local node = _M.find_node( upstream['node']  )
            
            ngx.var.vn_proxy_scheme = node['scheme']
            ngx.var.vn_proxy_target = node['host']..':'..node['port']

            ngx.ctx.vn_proxy_host = node['host']
            ngx.ctx.vn_proxy_port = node['port']

            ngx.exec('@vn_proxy') --will jump out at the exec, so the return not run in fact
            return
        end
    end
end

return _M
