-- -*- coding: utf-8 -*-
-- -- @Date    : 2015-01-27 05:56
-- -- @Author  : Alexa (AlexaZhou@163.com)
-- -- @Link    : 
-- -- @Disc    : record nginx infomation 

cjson = require "cjson"

local M = {}

local KEY_STATUS_INIT = "I_"

local KEY_TOTAL_COUNT = "F_"
local KEY_TOTAL_COUNT_200 = "H_"
local KEY_START_TIME = "G_"


function M.init()

    local ok, err = ngx.shared.status:add( KEY_STATUS_INIT,true )
    if ok then
		ngx.shared.status:set( KEY_TOTAL_COUNT, 0 )
		ngx.shared.status:set( KEY_TOTAL_COUNT_200, 0 )
		ngx.shared.status:set( KEY_START_TIME, ngx.time() )
    end

end

--add global count info
function M.log()
    ngx.shared.status:incr( KEY_TOTAL_COUNT, 1 )

    if ngx.var.status == '200' then
        ngx.shared.status:incr( KEY_TOTAL_COUNT_200, 1 )
    end
end

function M.report()

    local report = {}
    report['request_count'] = ngx.shared.status:get( KEY_TOTAL_COUNT )
    report['200_request_count'] = ngx.shared.status:get( KEY_TOTAL_COUNT_200 )
    report['time'] = ngx.time()
    report['boot_time'] = ngx.shared.status:get( KEY_START_TIME )
    report['connections_active'] = ngx.var.connections_active
    report['connections_reading'] = ngx.var.connections_reading
    report['connections_writing'] = ngx.var.connections_writing
    report['connections_waiting'] = ngx.var.connections_waiting
    
    return cjson.encode( report )

end

return M
