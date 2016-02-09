-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 20:39
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : redirect path

local _M = {}

local VeryNginxConfig = require "VeryNginxConfig"


function _M.run()
    
    if VeryNginxConfig.configs["redirect_uri_enable"] ~= true then
        return
    end

    local new_url = nil 
    local re_sub = ngx.re.sub
    local ngx_var = ngx.var 
    local ngx_redirect = ngx.redirect
    local ngx_var_uri = ngx_var.uri
    local ngx_var_scheme = ngx_var.scheme
    local ngx_var_host = ngx_var.host


    for i, v in ipairs( VeryNginxConfig.configs["redirect_uri_rule"] ) do
        new_url = re_sub( ngx_var_uri, v[1], v[2] ) 
        if new_url ~= ngx_var_uri then
            if ngx_var.args ~= nil then
                ngx_redirect( ngx_var_scheme.."://"..ngx_var_host..new_url.."?"..ngx_var.args , ngx.HTTP_MOVED_TEMPORARILY)
            else
                ngx_redirect( ngx_var_scheme.."://"..ngx_var_host..new_url , ngx.HTTP_MOVED_TEMPORARILY)
            end
            return
        end
    end

end

return _M
