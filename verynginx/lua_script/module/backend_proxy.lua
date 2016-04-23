-- -*- coding: utf-8 -*-
-- @Date    : 2016-04-20 
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : proxy_pass backend for verynginx

local _M = {}

local VeryNginxConfig = require "VeryNginxConfig"
local request_tester = require "request_tester"

function _M.filter()

    if VeryNginxConfig.configs["proxy_pass_enable"] ~= true then
        return
    end
    
    local matcher_list = VeryNginxConfig.configs['matcher']
    for i, rule in ipairs( VeryNginxConfig.configs["proxy_pass_rule"] ) do
        local enable = rule['enable']
        local matcher = matcher_list[ rule['matcher'] ] 
        if enable == true and request_tester.test( matcher ) == true then
            ngx.var.vn_proxy_target = rule['upstream']
            ngx.exec('@vn_proxy') --will jump out at the exec, so the return not run in fact
            return
        end
    end
end

return _M
