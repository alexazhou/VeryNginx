-- -*- coding: utf-8 -*-
-- @Date    : 2016-04-20 
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : static backend for verynginx

local _M = {}

local VeryNginxConfig = require "VeryNginxConfig"
local request_tester = require "request_tester"
local util = require "util"

function _M.filter()
    
    if VeryNginxConfig.configs["static_file_enable"] ~= true then
        return
    end
    
    local matcher_list = VeryNginxConfig.configs['matcher']
    for i, rule in ipairs( VeryNginxConfig.configs["static_file_rule"] ) do
        local enable = rule['enable']
        local matcher = matcher_list[ rule['matcher'] ] 
        if enable == true and request_tester.test( matcher ) == true then
            ngx.var.vn_static_root = rule['root']
            ngx.var.vn_static_expires = rule['expires']
            ngx.var.vn_exec_flag = '1'-- use the var as a mark, so that lua can know that's a inside redirect
            util.ngx_ctx_dump() 
            return ngx.exec('@vn_static') -- will jump out at the exec 
        end
    end
end

return _M
