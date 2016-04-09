-- -*- coding: utf-8 -*-
-- @Date    : 2016-02-21 
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : rewrite uri inside nginx

local _M = {}

local VeryNginxConfig = require "VeryNginxConfig"
local request_tester = require "request_tester"


function _M.run()
    
    if VeryNginxConfig.configs["uri_rewrite_enable"] ~= true then
        return
    end
    
    local new_uri = nil 
    local re_gsub = ngx.re.gsub
    local ngx_var = ngx.var 
    local ngx_set_uri = ngx.req.set_uri
    local ngx_var_uri = ngx_var.uri
    local ngx_var_scheme = ngx_var.scheme
    local ngx_var_host = ngx_var.host
    local matcher_list = VeryNginxConfig.configs['matcher']


    for i, rule in ipairs( VeryNginxConfig.configs["uri_rewrite_rule"] ) do
        local enable = rule['enable']
        local matcher = matcher_list[ rule['matcher'] ] 
        if enable == true and request_tester.test( matcher ) == true then
            replace_re = rule['replace_re']
            if replace_re ~= nil and string.len( replace_re ) >0 then
                new_uri = re_gsub( ngx_var_uri, replace_re, rule['to_uri'] ) 
            else
                new_uri = rule['to_uri']
            end

            if new_uri ~= ngx_var_uri then
                ngx_set_uri( new_uri , false )
            end
            return
        end
    end

end

return _M
