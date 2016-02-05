-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 00:46
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : filter request'uri maybe attack

local _M = {}

local verynginxconfig = require "VeryNginxConfig"


function _M.ip_in_whitelist()
    if verynginxconfig.configs["filter_ipwhitelist_enable"] ~= true then
        return false;
    end

    for i, v in ipairs( verynginxconfig.configs['filter_ipwhitelist_rule'] ) do
        if v[1] == ngx.var.remote_addr then
            return true
        end
    end

    return false;
end

function _M.filter_ip()
    return false
end

function _M.filter_useragent()
    if verynginxconfig.configs["filter_useragent_enable"] ~= true then
        return true;
    end

    for i, v in ipairs( VeryNginxConfig.configs["filter_useragent_rule"] ) do
        if ngx.re.find( ngx.var.http_user_agent, v[1], "is" ) then
            return false
        end
    end

    return true
end

function _M.filter_uri()
    if VeryNginxConfig.configs["filter_uri_enable"] ~= true then
        return true;
    end
    
    for i, v in ipairs( VeryNginxConfig.configs["filter_uri_rule"] ) do
        if ngx.re.find( ngx.var.uri, v[1], "is" ) then
            return false
        end
    end

    return true
end

function _M.filter_args()

    if VeryNginxConfig.configs["filter_arg_enable"] ~= true then
        return true
    end
    
    for i,re in ipairs( VeryNginxConfig.configs["filter_arg_rule"] ) do
        for k,v in pairs( ngx.req.get_uri_args()) do 
            local arg_str
            if type(v) == "table" then
                arg_str = table.concat(v, ", ")
            else
                arg_str = v
            end

            if ngx.re.find( arg_str, re[1], "is" ) then
                return false
            end
        end
    end

    return true
end



function M.filter()
    if M.ip_in_whitelist() == true then
        return
    end

    if M.filter_ip() == true then
        return 
    end
    
    if M.filter_useragent() ~= true then
        ngx.exit( ngx.HTTP_SERVICE_UNAVAILABLE ) 
    end
    
    if M.filter_uri() ~= true then
        ngx.exit( ngx.HTTP_SERVICE_UNAVAILABLE ) 
    end
    
    if M.filter_args() ~= true then
        ngx.exit( ngx.HTTP_SERVICE_UNAVAILABLE ) 
    end
    

end

return _M
