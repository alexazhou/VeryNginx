-- -*- coding: utf-8 -*-
-- @Date    : 2016-04-20 23:13
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : request frequency limit

_M = {}


local VeryNginxConfig = require "VeryNginxConfig"
local request_tester = require "request_tester"
local util = require "util"

local limit_dict = ngx.shared.frequency_limit

function scheme_judge(uri)
	local ngx_re_find  = ngx.re.find
    local matcher_list = VeryNginxConfig.configs['matcher']
    
    for i, rule in ipairs( VeryNginxConfig.configs["scheme_lock_rule"] ) do
        local enable = rule['enable']
        local matcher = matcher_list[ rule['matcher'] ] 
        if enable == true and request_tester.test( matcher ) == true then
            return rule['scheme'] 
        end
    end
    return 'none'
end


function _M.filter()

    if VeryNginxConfig.configs["frequency_limit_enable"] ~= true then
        return
    end

    local matcher_list = VeryNginxConfig.configs['matcher']
    for i, rule in ipairs( VeryNginxConfig.configs["frequency_limit_rule"] ) do
        local enable = rule['enable']
        local matcher = matcher_list[ rule['matcher'] ] 
        if enable == true and request_tester.test( matcher ) == true then
            
            local key = i 
            if util.existed( rule['separate'], 'ip' ) then
                key = key..'-'..ngx.var.remote_addr
            end

            if util.existed( rule['separate'], 'uri' ) then
                key = key..'-'..ngx.var.uri
            end

            local time = rule['time']
            local count = rule['count']

            --ngx.log(ngx.STDERR,'-----');
            --ngx.log(ngx.STDERR,key);

            return;
        end
    end
    
    return;
end

return _M
