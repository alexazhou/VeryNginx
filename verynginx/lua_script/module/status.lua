-- -*- coding: utf-8 -*-
-- -- @Date    : 2015-01-27 05:56
-- -- @Author  : Alexa (AlexaZhou@163.com)
-- -- @Link    : 
-- -- @Disc    : record nginx infomation 

local json = require "json"

local _M = {}

local KEY_STATUS_INIT = "I_"

local KEY_START_TIME = "G_"

local KEY_TOTAL_COUNT = "F_"
local KEY_TOTAL_COUNT_SUCCESS = "H_"

local KEY_TRAFFIC_READ = "J_"
local KEY_TRAFFIC_WRITE = "K_"

local KEY_TIME_TOTAL = "L_"

function _M.init()

    local ok, err = ngx.shared.status:add( KEY_STATUS_INIT,true )
    if ok then
		ngx.shared.status:set( KEY_START_TIME, ngx.time() )
		ngx.shared.status:set( KEY_TOTAL_COUNT, 0 )
		ngx.shared.status:set( KEY_TOTAL_COUNT_SUCCESS, 0 )
		
        ngx.shared.status:set( KEY_TRAFFIC_READ, 0 )
		ngx.shared.status:set( KEY_TRAFFIC_WRITE, 0 )
		
        ngx.shared.status:set( KEY_TIME_TOTAL, 0 )
    end

end

--add global count info
function _M.log()
    ngx.shared.status:incr( KEY_TOTAL_COUNT, 1 )

    if tonumber(ngx.var.status) < 400 then
        ngx.shared.status:incr( KEY_TOTAL_COUNT_SUCCESS, 1 )
    end

    ngx.shared.status:incr( KEY_TRAFFIC_READ, ngx.var.request_length)
    ngx.shared.status:incr( KEY_TRAFFIC_WRITE, ngx.var.bytes_sent )
    ngx.shared.status:incr( KEY_TIME_TOTAL, ngx.var.request_time )

end

function _M.report()

    local report = {}
    report['request_all_count'] = ngx.shared.status:get( KEY_TOTAL_COUNT )
    report['request_success_count'] = ngx.shared.status:get( KEY_TOTAL_COUNT_SUCCESS )
    report['time'] = ngx.now()
    report['boot_time'] = ngx.shared.status:get( KEY_START_TIME )
    report['response_time_total'] = ngx.shared.status:get( KEY_TIME_TOTAL )
    report['connections_active'] = ngx.var.connections_active
    report['connections_reading'] = ngx.var.connections_reading
    report['connections_writing'] = ngx.var.connections_writing
    report['connections_waiting'] = ngx.var.connections_waiting
    
    report['traffic_read'] = ngx.shared.status:get( KEY_TRAFFIC_READ )
    report['traffic_write'] = ngx.shared.status:get( KEY_TRAFFIC_WRITE )
    
    report['ret'] = 'success'
    
    return json.encode( report )

end

return _M
