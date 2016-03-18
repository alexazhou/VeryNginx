-- -*- coding: utf-8 -*-
-- @Date    : 2016-03-18 
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : static backend for verynginx

local _M = {}


function _M.filter()
    return
    ngx.var.vn_static_root = '/tmp'
    if ngx.var.vn_static_flag == '' then
        ngx.exec('@vn_static')
    end
end

return _M
