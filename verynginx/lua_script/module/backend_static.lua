-- -*- coding: utf-8 -*-
-- @Date    : 2016-03-18 
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : static backend for verynginx

local _M = {}

local VeryNginxConfig = require "VeryNginxConfig"

function _M.filter()
    
    if VeryNginxConfig.configs["static_file_enable"] ~= true then
        return
    end

    ngx.var.vn_static_root = '/tmp'
    if ngx.var.vn_exec_flag == '' then
        ngx.exec('@vn_static')
    end
end

return _M
