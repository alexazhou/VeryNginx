-- -*- coding: utf-8 -*-
-- -- @Date    : 2016-01-02 00:35
-- -- @Author  : Alexa (AlexaZhou@163.com)
-- -- @Link    : 
-- -- @Disc    : url router

summary = require "summary"
VeryNginxConfig = require "VeryNginxConfig"

local M = {}

local url_route = {}
url_route["get /verynginx/summary"] = summary.report
url_route["get /verynginx/config"] = VeryNginxConfig.report
url_route["post /verynginx/config"] = VeryNginxConfig.set
url_route["get /verynginx/dumpconfig"] = VeryNginxConfig.dump_to_file
url_route["get /verynginx/loadconfig"] = VeryNginxConfig.load_from_file

function M.filter() 
    --ngx.log(ngx.STDERR,"run router")
    local key = string.lower(ngx.req.get_method().." "..ngx.var.uri)
    local handle = url_route[ key ]
    if handle ~= nil then
        ngx.header.content_type = "application/json"
        ngx.header.charset = "utf-8"
        ngx.say( handle() )
        ngx.exit(200)
    elseif string.find(key,"get /verynginx/dashboard") == 1 then
        --ngx.header.charset = "utf-8"
        ngx.header.content_type = "text/html"
        ngx.header.charset = "utf-8"
        ngx.log(ngx.STDERR,"verynginx dashboard")

        local path = VeryNginxConfig.home_path() .."/dashboard" .. string.sub( ngx.var.uri, string.len( "/verynginx/dashboard") + 1 )
        ngx.log(ngx.STDERR,"load path:",path)
        f = io.open( path, 'r' )
        if f ~= nil then
            ngx.say( f:read("*all") )
            ngx.exit(200)
        else        
            ngx.exit(404)
        end
    end
    --ngx.log(ngx.STDERR,"run router end")
end

return M
