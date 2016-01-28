-- -*- coding: utf-8 -*-
-- -- @Date    : 2015-12-26 23:58
-- -- @Author  : Alexa (AlexaZhou@163.com)
-- -- @Link    : 
-- -- @Disc    : summary all the request

cjson = require "cjson"

local M = {}

local KEY_SUMMARY_INIT = "A_"

local KEY_URI_STATUS = "B_"
local KEY_URI_SIZE = "C_"
local KEY_URI_TIME = "D_"
local KEY_URI_COUNT = "E_"

function M.refresh()
    --ngx.log(ngx.STDERR,"do refresh")
    ngx.timer.at( 60, M.refresh )
    ngx.shared.summary_short:flush_all()
end

function M.log()

    --ngx.log(ngx.STDERR,"log start")
    local ok, err = ngx.shared.status:add( KEY_SUMMARY_INIT,true )
    if ok then
        --ngx.log(ngx.STDERR,"set timer")
        ngx.timer.at( 60, M.refresh )
    end
    
    local uri = ngx.var.uri 
    local status_code = ngx.var.status;
    local key_status = KEY_URI_STATUS..uri.."_"..status_code
    local key_size = KEY_URI_SIZE..uri
    local key_time = KEY_URI_TIME..uri
    local key_count = KEY_URI_COUNT..uri
 
    --ngx.log(ngx.STDERR,"key",key_status)
    --ngx.log(ngx.STDERR,"status",status_code)
    
    if ngx.shared.summary_long:get( key_count ) == nil then
        ngx.shared.summary_long:set( key_count, 0 )
    end

    if ngx.shared.summary_long:get( key_status ) == nil then
        ngx.shared.summary_long:set( key_status, 0 )
    end
    
    if ngx.shared.summary_long:get( key_size ) == nil then
        ngx.shared.summary_long:set( key_size, 0 )
    end
    
    if ngx.shared.summary_long:get( key_time ) == nil then
        ngx.shared.summary_long:set( key_time, 0 )
    end

    if ngx.shared.summary_short:get( key_count ) == nil then
        ngx.shared.summary_short:set( key_count, 0 )
    end

    if ngx.shared.summary_short:get( key_status ) == nil then
        ngx.shared.summary_short:set( key_status, 0 )
    end
    
    if ngx.shared.summary_short:get( key_size ) == nil then
        ngx.shared.summary_short:set( key_size, 0 )
    end
    
    if ngx.shared.summary_short:get( key_time ) == nil then
        ngx.shared.summary_short:set( key_time, 0 )
    end

   
    --log info with the url 
    ngx.shared.summary_long:incr( key_count, 1 )
    ngx.shared.summary_long:incr( key_status, 1 )
    ngx.shared.summary_long:incr( key_size, ngx.var.body_bytes_sent )
    ngx.shared.summary_long:incr( key_time, ngx.var.request_time )
    
    ngx.shared.summary_short:incr( key_count, 1 )
    ngx.shared.summary_short:incr( key_status, 1 )
    ngx.shared.summary_short:incr( key_size, ngx.var.body_bytes_sent )
    ngx.shared.summary_short:incr( key_time, ngx.var.request_time )

    
    --ngx.log(ngx.STDERR,"log end")
end

function M.report() 
    --ngx.log(ngx.STDERR,"summary:")
    
    local dict = nil
    local report = {}
    local record_uri = nil
    local status = nil 
    local size = nil 
    local time = nil 
    local count = nil 

    local args = ngx.req.get_uri_args()
    if args['type'] == 'long' then
        dict = ngx.shared.summary_long
    elseif args['type'] == 'short' then
        dict = ngx.shared.summary_short
    else
        return cjson.encode({["ret"]="failed",["err"]="type error"})
    end

    local keys = dict:get_keys(0)
    for k, v in pairs( keys ) do
        record_uri = nil
        status = nil 
        size = nil 
        time = nil 
        count = nil 
        
        if v.find(v, KEY_URI_STATUS) == 1 then
            record_uri = string.sub( v, string.len(KEY_URI_STATUS) + 1, -5 ) 
            status = string.sub( v,-3 )
        elseif v.find(v, KEY_URI_SIZE) == 1 then
            record_uri = string.sub( v, string.len(KEY_URI_SIZE) + 1 ) 
            size = dict:get( v )
        elseif v.find(v, KEY_URI_TIME) == 1 then
            record_uri = string.sub( v, string.len(KEY_URI_TIME) + 1 ) 
            time = dict:get( v )
        elseif v.find(v, KEY_URI_COUNT) == 1 then
            record_uri = string.sub( v, string.len(KEY_URI_COUNT) + 1 ) 
            count = dict:get( v )
        end
        
        if record_uri ~= nil then
            if report[record_uri] == nil then
                report[record_uri] = {}
                report[record_uri]["status"] = {}
            end
            
            if status ~= nil then
                report[record_uri]["status"][status] = dict:get( v )
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
            v["avg_time"] = string.format("%.3f", v["time"]/v["count"])
            v["time"] = string.format("%.3f", v["time"])
            v["avg_size"] =  string.format("%.2f", v["size"]/v["count"])
            v["size"] =  string.format("%.2f", v["size"])
        else
            report[k] = nil
        end
    end

    --ngx.log(ngx.STDERR,"summary end")
    return cjson.encode( report )
    
end

return M
