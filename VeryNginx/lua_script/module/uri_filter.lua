-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 00:46
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : filter request'uri maybe attack

local M = {}

VeryNginxConfig = require "VeryNginxConfig"

function M.filter()
    --ngx.log(ngx.STDERR,"in filer")
    --ngx.log(ngx.STDERR,"uri:",ngx.var.uri)
    for i, v in ipairs( VeryNginxConfig.configs["filter_uri_rule"] ) do
        --ngx.log(ngx.STDERR,"test:",re)
        if ngx.re.find( ngx.var.uri, v[1], "is" ) then
            --ngx.log(ngx.STDERR,"filter match")
            ngx.exit( 503 ) 
        end
    end
end

return M
