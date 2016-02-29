-- -*- coding: utf-8 -*-
-- @Date    : 2016-02-24 
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : verify that the remote client is a browser

local _M = {}

local VeryNginxConfig = require "VeryNginxConfig"
local request_tester = require "request_tester"
local encrypt_seed = require "encrypt_seed"

function _M.sign( mark )
    local sign = ngx.md5( 'VN' .. ngx.var.remote_addr .. ngx.var.http_user_agent .. mark .. encrypt_seed.get_seed() )
    return sign 
end


function _M.verify_cookie()
    local sign = _M.sign('cookie')
    if ngx.var.http_cookie ~= nil then
        if string.find( ngx.var.http_cookie , sign) ~= nil then
            return
        end
    end

    ngx.header["Set-Cookie"] = "verynginx_sign_cookie=" .. sign
    
    if ngx.var.args ~= nil then
		ngx.redirect( ngx.var.scheme.."://"..ngx.var.host..ngx.var.uri.."?"..ngx.var.args , ngx.HTTP_MOVED_TEMPORARILY)
	else
		ngx.redirect( ngx.var.scheme.."://"..ngx.var.host..ngx.var.uri , ngx.HTTP_MOVED_TEMPORARILY)
	end
end

function _M.verify_javascript()

end

function _M.filter()

    ngx.log(ngx.STDERR,'----')

    if VeryNginxConfig.configs["browser_verify_enable"] ~= true then
        return
    end
    
    ngx.log(ngx.STDERR,'++++')
    
    local matcher_list = VeryNginxConfig.configs['matcher']
    
    for i,rule in ipairs( VeryNginxConfig.configs["browser_verify_rule"] ) do
        local enable = rule['enable']
        local matcher = matcher_list[ rule['matcher'] ] 
        if enable == true and request_tester.test( matcher ) == true then
            local verify_cookie,verify_javascript = false,false
            
            for idx,verify_type in ipairs( rule['type']) do
                if verify_type == 'cookie' then
                    verify_cookie = true
                elseif verify_type == 'javascript' then
                    verify_javascript = true
                end
            end

            if verify_cookie == true then
                _M.verify_cookie()
            end
            
            if verify_javascript == true then
                _M.verify_javascript()
            end
        end
    end

end

return _M
