-- -*- coding: utf-8 -*-
-- -- @Date    : 2015-12-26 23:58
-- -- @Author  : Alexa (AlexaZhou@163.com)
-- -- @Link    : 
-- -- @Disc    : summary all the request

cjson = require "cjson"

local M = {}

local KEY_INIT = "FLAG_INIT"
local KEY_TOTAL_STATUS = "TOTAL_STATUS_"
local KEY_TOTAL_SIZE = "TOTAL_SIZE_"
local KEY_TOTAL_TIME = "TOTAL_TIME_"
local KEY_TOTAL_COUNT = "TOTAL_COUNT_"

function M.refresh()
    --ngx.log(ngx.STDERR,"do refresh")
    ngx.timer.at( 5, M.refresh )
    ngx.shared.summary:set( KEY_INIT ,true,15 )
end

function M.log()

    --ngx.log(ngx.STDERR,"log start")
    
    local ok, err = ngx.shared.summary:add( KEY_INIT,true,15 )
    if ok then
        local total_status = {}
        
        ngx.timer.at( 5, M.refresh )
        --ngx.log(ngx.STDERR,"set timer")
    end
    
    local uri = ngx.var.uri 
    local status_code = ngx.var.status;
    local key_status = KEY_TOTAL_STATUS..uri.."_"..status_code
    local key_size = KEY_TOTAL_SIZE..uri
    local key_time = KEY_TOTAL_TIME..uri
    local key_count = KEY_TOTAL_COUNT..uri
 
    --ngx.log(ngx.STDERR,"key",key_status)
    --ngx.log(ngx.STDERR,"status",status_code)
    
    if ngx.shared.summary:get( key_count ) == nil then
        ngx.shared.summary:set( key_count, 0 )
    end

    if ngx.shared.summary:get( key_status ) == nil then
        ngx.shared.summary:set( key_status, 0 )
    end
    
    if ngx.shared.summary:get( key_size ) == nil then
        ngx.shared.summary:set( key_size, 0 )
    end
    
    if ngx.shared.summary:get( key_time ) == nil then
        ngx.shared.summary:set( key_time, 0 )
    end
    
    ngx.shared.summary:incr( key_count, 1 )
    ngx.shared.summary:incr( key_status, 1 )
    ngx.shared.summary:incr( key_size, ngx.var.body_bytes_sent )
    ngx.shared.summary:incr( key_time, ngx.var.request_time )

    --ngx.log(ngx.STDERR,"log end")
    
end

function M.report() 
    --ngx.log(ngx.STDERR,"summary:")
    local keys = ngx.shared.summary:get_keys(0)
    local report = {}
    
    local record_uri = nil
    local status = nil 
    local size = nil 
    local time = nil 
    local count = nil 

    for k, v in pairs( keys ) do
        record_uri = nil
        status = nil 
        size = nil 
        time = nil 
        count = nil 
        
        if v.find(v, KEY_TOTAL_STATUS) == 1 then
            record_uri = string.sub( v, string.len(KEY_TOTAL_STATUS) + 1, -5 ) 
            status = string.sub( v,-3 )
        elseif v.find(v, KEY_TOTAL_SIZE) == 1 then
            record_uri = string.sub( v, string.len(KEY_TOTAL_SIZE) + 1 ) 
            size = ngx.shared.summary:get( v )
        elseif v.find(v, KEY_TOTAL_TIME) == 1 then
            record_uri = string.sub( v, string.len(KEY_TOTAL_TIME) + 1 ) 
            time = ngx.shared.summary:get( v )
        elseif v.find(v, KEY_TOTAL_COUNT) == 1 then
            record_uri = string.sub( v, string.len(KEY_TOTAL_COUNT) + 1 ) 
            count = ngx.shared.summary:get( v )
        end
        
        if record_uri ~= nil then
            if report[record_uri] == nil then
                report[record_uri] = {}
                report[record_uri]["status"] = {}
            end
            
            if status ~= nil then
                report[record_uri]["status"][status] = ngx.shared.summary:get( v )
            elseif time ~= nil then
                report[record_uri]["time"] = time         
            elseif
                size ~= nil then
                report[record_uri]["size"] = size
            elseif count ~= nil then
                report[record_uri]["count"] = count
            end
        end
    end

    for k, v in pairs( report ) do
        if v['time'] ~= nil and v['count'] ~= nil and v['size'] ~= nil then
            v["avg_time"] = string.format("%.3f S", v["time"]/v["count"])
            v["time"] = string.format("%.3f S", v["time"])
            v["avg_size"] =  string.format("%.2f Byte", v["size"]/v["count"])
            v["size"] =  string.format("%.2f Byte", v["size"])
        end
    end

    --ngx.log(ngx.STDERR,"summary end")
    return cjson.encode( report )
    
end

return M
