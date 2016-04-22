-- -*- coding: utf-8 -*-
-- @Date    : 2016-03-18 
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

    ngx.var.vn_proxy_target = 'http://123.125.114.224'
    if ngx.var.vn_exec_flag == '' then
        ngx.exec('@vn_proxy')
    end
end

return _M
