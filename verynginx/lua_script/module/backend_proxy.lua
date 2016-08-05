-- -*- coding: utf-8 -*-
-- @Date    : 2016-04-20 
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : proxy_pass backend for verynginx

local _M = {}

local VeryNginxConfig = require "VeryNginxConfig"
local request_tester = require "request_tester"
local resolver = require "resty.dns.resolver"
local math = require "math"
local util = require "util"

math.randomseed(ngx.time()) 


function _M.find_node( upstream )
   
    local node_list = upstream['node']
    local balance_method = upstream['method']
    local rate_sum = 0
    
    for name,node in pairs( node_list ) do
        rate_sum = rate_sum + tonumber(node['weight']) 
    end
    --ngx.log( ngx.ERR, 'rate_sum',rate_sum)
   
    local p = nil
    if balance_method == 'ip_hash' then
        p =  math.fmod( ngx.crc32_short( ngx.var.remote_addr), rate_sum) + 1
    else
        p = math.random( rate_sum )
    end

    --ngx.log( ngx.ERR, 'p',p)

    for name,node in pairs( node_list ) do
        local tmp = tonumber(node['weight'])
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
            --ngx.log(ngx.STDERR,'upstream:',rule['upstream'])

            local upstream = upstream_list[ rule['upstream'] ]
            local node = _M.find_node( upstream )
            
            ngx.var.vn_proxy_scheme = node['scheme']
            ngx.var.vn_proxy_host = node['host']
            
            if node['port'] == '' then
                if node['scheme'] == 'http' then
                    ngx.var.vn_proxy_port = 80
                elseif node['scheme'] == 'https' then 
                    ngx.var.vn_proxy_port = 443
                end
            else
                ngx.var.vn_proxy_port = tonumber( node['port'] )
            end
            
            --set vn_header_host
            if rule['proxy_host'] ~= '' then
                ngx.var.vn_header_host = rule['proxy_host']
            else
                ngx.var.vn_header_host = ngx.var.host
            end

            util.ngx_ctx_dump() 
            ngx.var.vn_exec_flag = '1' --use the var as a mark, so that lua can know that's a inside redirect
            return ngx.exec('@vn_proxy')  --will jump out at the exec, so the return not run in fact
        end
    end
end

return _M
