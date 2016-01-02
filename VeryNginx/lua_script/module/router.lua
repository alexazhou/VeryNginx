-- -*- coding: utf-8 -*-
-- -- @Date    : 2016-01-02 00:35
-- -- @Author  : Alexa (AlexaZhou@163.com)
-- -- @Link    : 
-- -- @Disc    : url router

summary = require "summary"
VeryNginxConfig = require "VeryNginxConfig"

local M = {}

local url_route = {}
url_route["GET /verynginx/summary"] = summary.report
url_route["GET /verynginx/config"] = VeryNginxConfig.report
url_route["GET /verynginx/dumpconfig"] = VeryNginxConfig.dump_to_file
url_route["GET /verynginx/loadconfig"] = VeryNginxConfig.load_from_file

function M.filter() 
    --ngx.log(ngx.STDERR,"run router")
    local key = ngx.req.get_method().." "..ngx.var.uri
    local handle = url_route[ key ]
    if handle ~= nil then
        ngx.header.content_type = "application/json"
        ngx.header.charset = "utf-8"
        ngx.say( handle()  )
        ngx.exit(200)
    end
    --ngx.log(ngx.STDERR,"run router end")
end

return M
