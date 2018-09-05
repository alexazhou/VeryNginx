-- -*- coding: utf-8 -*-
-- @Date    : 2016-02-24 
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : verify that the remote client is a browser

local _M = {}

local VeryNginxConfig = require "VeryNginxConfig"
local request_tester = require "request_tester"
local encrypt_seed = require "encrypt_seed"
local util = require "util"

_M.verify_javascript_html = nil

function _M.sign( mark )
    local ua = ngx.var.http_user_agent
    local forwarded  = ngx.var.http_x_forwarded_for
    
    if ua == nil then
        ua = ''
    end
    
    if forwarded == nil then
        forwarded = ''
    end

    local sign = ngx.md5( 'VN' .. ngx.var.remote_addr .. forwarded .. ua .. mark .. encrypt_seed.get_seed() )
    return sign 
end

function _M.verify_cookie()
    local sign = _M.sign('cookie')
    if ngx.var.http_cookie ~= nil then
        if string.find( ngx.var.http_cookie , sign) ~= nil then
            return
        end
    end

    local cookie_prefix = VeryNginxConfig.configs['cookie_prefix']
    ngx.header["Set-Cookie"] =  cookie_prefix .. "_sign_cookie=" .. sign .. '; path=/' 
    
    if ngx.var.args ~= nil then
        ngx.redirect( ngx.var.scheme.."://"..ngx.var.http_host..ngx.var.uri.."?"..ngx.var.query_string , ngx.HTTP_MOVED_TEMPORARILY)
    else
        ngx.redirect( ngx.var.scheme.."://"..ngx.var.http_host..ngx.var.uri , ngx.HTTP_MOVED_TEMPORARILY)
    end
end

function _M.verify_javascript()
    local sign = _M.sign('javascript')
    if ngx.var.http_cookie ~= nil then
        if string.find( ngx.var.http_cookie , sign) ~= nil then
            return
        end
    end
    
    if _M.verify_javascript_html == nil then
        local path = VeryNginxConfig.home_path() .."/support/verify_javascript.html"
        f = io.open( path, 'r' )
        if f ~= nil then
            _M.verify_javascript_html = f:read("*all")
            f:close()
        end
    end
    
    local cookie_prefix = VeryNginxConfig.configs['cookie_prefix']

    local redirect_to = nil
    local html = _M.verify_javascript_html

    html = string.gsub( html,'INFOCOOKIE',sign )
    html = string.gsub( html,'COOKIEPREFIX',cookie_prefix )

    if ngx.var.args ~= nil then
		redirect_to =  ngx.var.scheme.."://"..ngx.var.http_host..ngx.var.uri.."?"..ngx.var.args , ngx.HTTP_MOVED_TEMPORARILY
	else
		redirect_to =  ngx.var.scheme.."://"..ngx.var.http_host..ngx.var.uri , ngx.HTTP_MOVED_TEMPORARILY
	end

    html = util.string_replace( html,'INFOURI',redirect_to, 1 )
    
    ngx.header.content_type = "text/html"
    ngx.header['cache-control'] = "no-cache, no-store, must-revalidate"
    ngx.header['pragma'] = "no-cache"
    ngx.header['expires'] = "0"
    ngx.header.charset = "utf-8"
    ngx.say( html )
    
    ngx.exit(200)
end

function _M.filter()
    if VeryNginxConfig.configs["browser_verify_enable"] ~= true then
        return
    end
    
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

            return
        end
    end
end

return _M
