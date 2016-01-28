-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 00:46
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : filter request'uri maybe attack

local M = {}

VeryNginxConfig = require "VeryNginxConfig"


function M.ip_in_whitelist()
    if VeryNginxConfig.configs["filter_ipwhitelist_enable"] ~= true then
        return false;
    end

    for i, v in ipairs( VeryNginxConfig.configs['filter_ipwhitelist_rule'] ) do
        if v[1] == ngx.var.remote_addr then
            return true
        end
    end

    return false;
end

function M.filter_ip()

    return false
end

function M.filter_useragent()
    if VeryNginxConfig.configs["filter_useragent_enable"] ~= true then
        return true;
    end

    for i, v in ipairs( VeryNginxConfig.configs["filter_useragent_rule"] ) do
        --ngx.log(ngx.STDERR,"filter useragent test:",v[1])
        if ngx.re.find( ngx.var.http_user_agent, v[1], "is" ) then
            --ngx.log(ngx.STDERR,"filter useragent match")
            return false
        end
    end

    return true
end

function M.filter_uri()
    if VeryNginxConfig.configs["filter_uri_enable"] ~= true then
        return true;
    end
    
    for i, v in ipairs( VeryNginxConfig.configs["filter_uri_rule"] ) do
        --ngx.log(ngx.STDERR,"filter uri test:",v[1])
        if ngx.re.find( ngx.var.uri, v[1], "is" ) then
            --ngx.log(ngx.STDERR,"filter uri match")
            return false
        end
    end

    return true
end

function M.filter_args()

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
    --ngx.log(ngx.STDERR,"in filer")
    --ngx.log(ngx.STDERR,"uri:",ngx.var.uri)
    if M.ip_in_whitelist() == true then
        return
    end

    if M.filter_ip() == true then
        return 
    end
    
    if M.filter_useragent() ~= true then
        ngx.exit( 503 ) 
    end
    
    if M.filter_uri() ~= true then
        ngx.exit( 503 ) 
    end
    
    if M.filter_args() ~= true then
        ngx.exit( 503 ) 
    end
    

end

return M
