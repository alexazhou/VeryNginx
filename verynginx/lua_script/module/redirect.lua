-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 20:39
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : redirect path

local _M = {}

local VeryNginxConfig = require "VeryNginxConfig"
local request_tester = require "request_tester"


function _M.run()
    
    if VeryNginxConfig.configs["redirect_enable"] ~= true then
        return
    end
    
    local new_url = nil 
    local re_gsub = ngx.re.gsub
    local ngx_var = ngx.var 
    local ngx_redirect = ngx.redirect
    local ngx_var_uri = ngx_var.uri
    local ngx_var_scheme = ngx_var.scheme
    local ngx_var_host = ngx_var.host
    local matcher_list = VeryNginxConfig.configs['matcher']


    for i, rule in ipairs( VeryNginxConfig.configs["redirect_rule"] ) do
        local enable = rule['enable']
        local matcher = matcher_list[ rule['matcher'] ] 
        if enable == true and request_tester.test( matcher ) == true then
            replace_re = rule['replace_re']
            if replace_re ~= nil and string.len( replace_re ) > 0  then
                new_url = re_gsub( ngx_var_uri, replace_re, rule['to_uri'] ) 
            else
                new_url = rule['to_uri']
            end

            if new_url ~= ngx_var_uri then

                if string.find( new_url, 'http') ~= 1 then
                    new_url = ngx_var_scheme.."://"..ngx_var_host..new_url
                end

                if ngx_var.args ~= nil then
                    ngx_redirect( new_url.."?"..ngx_var.args , ngx.HTTP_MOVED_TEMPORARILY)
                else
                    ngx_redirect( new_url , ngx.HTTP_MOVED_TEMPORARILY)
                end
            end
            return
        end
    end

end

return _M
