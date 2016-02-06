-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 00:51
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : handle VeryNginx configuration

local _M = {}

_M["configs"] = {}

--------------default config------------
_M.configs["admin"] = {
    {"verynginx","verynginx"}
}

_M.configs["redirect_uri_enable"] = true
_M.configs["redirect_uri_rule"] = {
    {"demowillbereplace","replaced"}
}

_M.configs["redirect_scheme_enable"] = false
_M.configs["redirect_scheme_rule"] = {
}

_M.configs["filter_ipwhitelist_enable"] = true
_M.configs["filter_ipwhitelist_rule"] = {
}

_M.configs["filter_ip_enable"] = true
_M.configs["filter_ip_rule"] = {
}

_M.configs["filter_useragent_enable"] = true
_M.configs["filter_useragent_rule"] = {
    {'(nmap|w3af|netsparker|nikto|fimap|wget)'},
}

_M.configs["filter_uri_enable"] = true 
_M.configs["filter_uri_rule"] = {
    {"\\.(git|svn|\\.)"},
    {"\\.(haccess|bash_history|ssh|sql)$"},
}

_M.configs["filter_arg_enable"] = true
_M.configs["filter_arg_rule"] = {
    {"select.*from"},
}

_M.configs["summary_request_enable"] = true


--M.configs.url_whitelist = {"aaa"}

----------------------------------------
local dkjson = require "dkjson"
local cjson = require "cjson"

function _M.home_path()
    local current_script_path = debug.getinfo(1, "S").source:sub(2)
    local home_path = current_script_path:sub( 1, 0 - string.len("/lua_script/VeryNginxConfig.lua") -1 ) 
    return home_path
end

function _M.load_from_file()
    local config_dump_path = _M.home_path() .. "/config.json"
    local file = io.open( config_dump_path, "r")
    
    if file == nil then
        return cjson.encode({["ret"]="error",["msg"]="config file not found"})
    end

    --file = io.open( "/tmp/config.json", "w");
    local data = file:read("*all");
    file:close();

    --ngx.log(ngx.STDERR, data)
    local tmp = dkjson.decode( data )
    if tmp ~= nil then
        _M["configs"] =  tmp
        return cjson.encode({["ret"]="success",['config']=_M["configs"]})
    else 
        return cjson.encode({["ret"]="error",["msg"]="config file decode error"})
    end
        
end 

function _M.report()
    --return a json contain current config items
    return dkjson.encode( _M["configs"], {indent=true} )
end

function _M.verify()
    return true  
end

function _M.set()
    local ret = false
    local err = nil
    local args = nil
    local dump_ret = nil

    ngx.req.read_body()
    args, err = ngx.req.get_post_args()
    if not args then
        ngx.say("failed to get post args: ", err)
        return
    end

    local new_config = cjson.decode( args['config'] )
    if _M.verify( new_config ) == true then
        _M["configs"] = new_config
        dump_ret = cjson.decode( _M.dump_to_file() )
        if dump_ret['ret'] == "success" then
            ret = true
            err = nil
        else
            ret = false
            err = dump_ret['err']
        end
    end

    if ret == true then
        return cjson.encode({["ret"]="success",["err"]=err})
    else
        return cjson.encode({["ret"]="failed",["err"]=err})
    end

end


function _M.dump_to_file()
    local config_data = _M.report()
    local config_dump_path = _M.home_path() .. "/config.json"
    
    ngx.log(ngx.STDERR,config_dump_path)

    file, err = io.open( config_dump_path, "w");
    if file ~= nil then
        file:write(config_data);
        file:close();
        return cjson.encode({["ret"]="success"})
    else
        return cjson.encode({["ret"]="failed",["err"]="open file failed"})
    end

end

--auto load config from json file
_M.load_from_file()

return _M
