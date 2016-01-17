-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 00:51
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : handle VeryNginx configuration

local M = {}

M["configs"] = {}

--------------default config------------
M.configs["redirect_uri_enable"] = true
M.configs["redirect_uri_rule"] = {
    {"^/index\\.php",""}
}

M.configs["redirect_scheme_enable"] = false
M.configs["redirect_scheme_rule"] = {
}

M.configs["filter_ipwhitelist_enable"] = true
M.configs["filter_ipwhitelist_rule"] = {}

M.configs["filter_ip_enable"] = true
M.configs["filter_ip_rule"] = {}

M.configs["filter_uri_enable"] = true 
M.configs["filter_uri_rule"] = {
    {"\\.(git|svn|\\.)"},
    {"\\.(haccess|bash_history|ssh|sql)$"},
}

M.configs["summary_enable"] = true


--M.configs.url_whitelist = {"aaa"}

----------------------------------------
dkjson = require "dkjson"
cjson = require "cjson"

function M.home_path()
    local current_script_path = debug.getinfo(1, "S").source:sub(2)
    local home_path = current_script_path:sub( 1, 0 - string.len("/lua_script/VeryNginxConfig.lua") -1 ) 
    return home_path
end

function M.load_from_file()
    local config_dump_path = M.home_path() .. "/config.json"
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
        M["configs"] =  tmp
        return cjson.encode({["ret"]="success",['config']=M["configs"]})
    else 
        return cjson.encode({["ret"]="error",["msg"]="config file decode error"})
    end
        
end 

function M.report()
    --return a json contain current config items
    return dkjson.encode( M["configs"], {indent=true} )
end

function M.verify()

    return true  
end

function M.set()
    --
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
    if M.verify( new_config ) == true then
        M["configs"] = new_config
        dump_ret,err = M.dump_to_file()
        if dump_ret['ret'] == "success" then
            ret = true
        end
    end

    if ret == false then
        return cjson.encode({["ret"]="success",["err"]=err})
    else
        return cjson.encode({["ret"]="failed",["err"]=err})
    end

end


function M.dump_to_file()
    local config_data = M.report()
    local config_dump_path = M.home_path() .. "/config.json"
    
    ngx.log(ngx.STDERR,config_dump_path)

    file, err = io.open( config_dump_path, "w");
    --file = io.open( "/tmp/config.json", "w");
    if file ~= nil then
        file:write(config_data);
        file:close();
        return cjson.encode({["ret"]="success"})
    else
        return cjson.encode({["ret"]="failed",["err"]="open file failed"})
    end

end

--auto load config from json file
M.load_from_file()

return M
