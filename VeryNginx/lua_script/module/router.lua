-- -*- coding: utf-8 -*-
-- -- @Date    : 2016-01-02 00:35
-- -- @Author  : Alexa (AlexaZhou@163.com)
-- -- @Link    : 
-- -- @Disc    : url router

summary = require "summary"

local M = {}

function M.filter() 
    ngx.log(ngx.STDERR,"run filter")
    if ngx.var.uri == "/nginx/summary" then
        ngx.header.content_type = "application/json"
        ngx.header.charset = "utf-8"
        ngx.say( summary.report()  )
        ngx.exit(200)
    end
    
end

return M
