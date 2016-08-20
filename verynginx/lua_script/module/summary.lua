-- -*- coding: utf-8 -*-
-- -- @Date    : 2015-12-26 23:58
-- -- @Author  : Alexa (AlexaZhou@163.com)
-- -- @Link    : 
-- -- @Disc    : summary all the request

local json = require "json"
local VeryNginxConfig = require "VeryNginxConfig"
local request_tester = require "request_tester"

local _M = {}

local KEY_SUMMARY_REFRESHING_FLAG = "A_"

local KEY_URI_STATUS = "B_"
local KEY_URI_SIZE = "C_"
local KEY_URI_TIME = "D_"
local KEY_URI_COUNT = "E_"

local KEY_COLLECT_STATUS = "F_"
local KEY_COLLECT_SIZE = "G_"
local KEY_COLLECT_TIME = "H_"
local KEY_COLLECT_COUNT = "I_"

function _M.refresh()
    ngx.timer.at( 60, _M.refresh )
    ngx.shared.summary_short:flush_all()
    --update flag timeout 
    ngx.shared.status:set( KEY_SUMMARY_REFRESHING_FLAG, true, 120 )
end

function _M.pre_run_matcher()
    
    if VeryNginxConfig.configs["summary_collect_enable"] ~= true then
        return
    end
    
    local matcher_list = VeryNginxConfig.configs['matcher']
    for i,rule in ipairs( VeryNginxConfig.configs["summary_collect_rule"] ) do
        local enable = rule['enable']
        local matcher = matcher_list[ rule['matcher'] ] 
        if enable == true and request_tester.test( matcher ) == true then
            ngx.ctx.log_collect_name = rule['collect_name']
            break
        end
    end
end

function _M.log()

    local ok, err = ngx.shared.status:add( KEY_SUMMARY_REFRESHING_FLAG, true, 120 )
    --here use set a 120s timeout for the flag key, so when the nginx worker exit( for example nginx-s reload may cause that ), 
    --a other worker will continue to refresh the data every 60s
    if ok then
        ngx.timer.at( 60, _M.refresh )
    end
    
    if VeryNginxConfig.configs["summary_request_enable"] ~= true then
        return
    end

    local status_code = ngx.var.status;
    local key_status = nil
    local key_size = nil
    local key_time = nil
    local key_count = nil
    local log_collect_name = ngx.ctx.log_collect_name
    
    if log_collect_name ~= nil then
        key_status = KEY_COLLECT_STATUS..log_collect_name.."_"..status_code
        key_size = KEY_COLLECT_SIZE..log_collect_name
        key_time = KEY_COLLECT_TIME..log_collect_name
        key_count = KEY_COLLECT_COUNT..log_collect_name
    else
        local uri = ngx.var.request_uri
        if uri ~= nil then
            local index = string.find( uri, '?' )
            if index ~= nil then
                uri = string.sub( uri, 1 , index - 1 )
            end
        end
        key_status = KEY_URI_STATUS..uri.."_"..status_code
        key_size = KEY_URI_SIZE..uri
        key_time = KEY_URI_TIME..uri
        key_count = KEY_URI_COUNT..uri
    end
 
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

end

function _M.report() 
    
    local dict = nil
    local report = {}
    local uri_report = {}
    local collect_report = {}
    local record_key = nil
    local status = nil 
    local size = nil 
    local time = nil 
    local count = nil

    report['uri'] = uri_report
    report['collect'] = collect_report

    local args = ngx.req.get_uri_args()
    if args['type'] == 'long' then
        dict = ngx.shared.summary_long
    elseif args['type'] == 'short' then
        dict = ngx.shared.summary_short
    else
        return json.encode({["ret"]="failed",["err"]="type error"})
    end

    local keys = dict:get_keys(0)
    local str_sub = string.sub
    local str_len = string.len
    local str_format = string.format


    for k, v in pairs( keys ) do
        record_key = nil
        record_table = nil
        status = nil 
        size = nil 
        time = nil 
        count = nil 
        
        if v.find(v, KEY_URI_STATUS) == 1 then
            record_key = str_sub( v, str_len(KEY_URI_STATUS) + 1, -5 ) 
            record_table = uri_report
            status = str_sub( v,-3 )
        elseif v.find(v, KEY_URI_SIZE) == 1 then
            record_key = str_sub( v, str_len(KEY_URI_SIZE) + 1 ) 
            record_table = uri_report
            size = dict:get( v )
        elseif v.find(v, KEY_URI_TIME) == 1 then
            record_key = str_sub( v, str_len(KEY_URI_TIME) + 1 ) 
            record_table = uri_report
            time = dict:get( v )
        elseif v.find(v, KEY_URI_COUNT) == 1 then
            record_key = str_sub( v, str_len(KEY_URI_COUNT) + 1 ) 
            record_table = uri_report
            count = dict:get( v )
        elseif v.find(v, KEY_COLLECT_STATUS) == 1 then
            record_key = str_sub( v, str_len(KEY_COLLECT_STATUS) + 1, -5 ) 
            record_table = collect_report
            status = str_sub( v,-3 )
        elseif v.find(v, KEY_COLLECT_SIZE) == 1 then
            record_key = str_sub( v, str_len(KEY_COLLECT_SIZE) + 1 ) 
            record_table = collect_report
            size = dict:get( v )
        elseif v.find(v, KEY_COLLECT_TIME) == 1 then
            record_key = str_sub( v, str_len(KEY_COLLECT_TIME) + 1 ) 
            record_table = collect_report
            time = dict:get( v )
        elseif v.find(v, KEY_COLLECT_COUNT) == 1 then
            record_key = str_sub( v, str_len(KEY_COLLECT_COUNT) + 1 ) 
            record_table = collect_report
            count = dict:get( v )
        end

        
        if record_key ~= nil then
            if record_table[record_key] == nil then
                record_table[record_key] = {}
                record_table[record_key]["status"] = {}
            end
            
            if status ~= nil then
                record_table[record_key]["status"][status] = dict:get( v )
            elseif time ~= nil then
                record_table[record_key]["time"] = time         
            elseif
                size ~= nil then
                record_table[record_key]["size"] = size
            elseif count ~= nil then
                record_table[record_key]["count"] = count
            end
        end
    end

    --remove incomplete record
    for name,record_table  in pairs( report ) do
        for k, v in pairs( record_table ) do
            if v['time'] == nil or v['count'] == nil or v['size'] == nil then
                record_table[k] = nil
            end
        end
    end

    return json.encode( report )
    
end

return _M
