-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 00:46
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : filter request'uri maybe attack

local _M = {}

local VeryNginxConfig = require "VeryNginxConfig"
local request_tester = require "request_tester"


function _M.ip_in_whitelist()
    if VeryNginxConfig.configs["filter_ipwhitelist_enable"] ~= true then
        return false
    end

    local remote_addr = ngx.var.remote_addr
    for i, v in ipairs( VeryNginxConfig.configs['filter_ipwhitelist_rule'] ) do
        if v[1] == remote_addr  then
            return true
        end
    end

    return false
end

function _M.filter_ip()
    if VeryNginxConfig.configs["filter_ip_enable"] ~= true then
        return true
    end
    
    local remote_addr = ngx.var.remote_addr
    for i, v in ipairs( VeryNginxConfig.configs['filter_ip_rule'] ) do
        if v[1] == remote_addr then
            return false
        end
    end
    
    return true
end

function _M.filter_useragent()
    if VeryNginxConfig.configs["filter_useragent_enable"] ~= true then
        return true;
    end

    local find = ngx.re.find
    local http_user_agent = ngx.var.http_user_agent

    if http_user_agent == nil then
        return true
    end

    for i, v in ipairs( VeryNginxConfig.configs["filter_useragent_rule"] ) do
        if find( http_user_agent, v[1], "is" ) then
            return false
        end
    end

    return true
end

function _M.filter_uri()
    if VeryNginxConfig.configs["filter_uri_enable"] ~= true then
        return true;
    end
    
    local find = ngx.re.find
    local uri = ngx.var.uri
    
    for i, v in ipairs( VeryNginxConfig.configs["filter_uri_rule"] ) do
        if find( uri, v[1], "is" ) then
            return false
        end
    end

    return true
end

function _M.filter_args()

    if VeryNginxConfig.configs["filter_arg_enable"] ~= true then
        return true
    end

    ngx.req.read_body()
    local body_args, err = ngx.req.get_post_args()
    if not body_args  then
        ngx.say("failed to get post args: ", err)
    end
  
    local find = ngx.re.find
    for i,re in ipairs( VeryNginxConfig.configs["filter_arg_rule"] ) do
        --check args in behind uri 
        for k,v in pairs( ngx.req.get_uri_args()) do 
            
            if type(v) == "table" then
                for arg_name,arg_value in ipairs(v) do
                    if find( arg_value, re[1], "is" ) then
                        return false
                    end
                end
            elseif type(v) == "string" then
                if find( v, re[1], "is" ) then
                    return false
                end
            end
        end
        
        --check args in body
        if body_args ~= nil then
            for k,v in pairs( body_args ) do
                if type(v) == "table" then
                    for arg_name,arg_value in ipairs(v) do
                        if find( arg_value, re[1], "is" ) then
                            return false
                        end
                    end
                elseif type(v) == "string" then
                    if find( v, re[1], "is" ) then
                        return false
                    end
                end
            end
        end
    end

    return true
end



function _M.filter()
    
    if VeryNginxConfig.configs["filter_enable"] ~= true then
        return
    end
    
    local matcher_list = VeryNginxConfig.configs['matcher']
    
    for i,rule in ipairs( VeryNginxConfig.configs["filter_rule"] ) do
        
        local matcher = matcher_list[ rule['matcher'] ] 
        if request_tester.test( matcher ) == true then
            local action = rule['action']
            if action == 'accept' then
                return
            else 
                ngx.exit( rule['code'] )
            end
        end
    end
end

return _M
