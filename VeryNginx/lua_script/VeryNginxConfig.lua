-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 00:51
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : handle VeryNginx configuration

local M = {}

M["configs"] = {}

--------------default config------------
M.configs["path_redirect_enable"] = true
M.configs["path_redirect_rule"] = {
    ["^/index\\.php"] = ""
}

M.configs["scheme_redirect_enable"] = true
M.configs["scheme_redirect_rule"] = {
}

M.configs["url_filter_enable"] = true 
M.configs["disable_url"] = {"\\.(git|svn|\\.)",
"\\.(haccess|bash_history|ssh|sql)$",
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
    local  file = io.open( config_dump_path, "r");
    
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
    local report = {}
    --for k, v in pairs(M["configs"]) do
    --    ngx.log(ngx.STDERR, "***",k)
    --    report[k] = v
    --end
    return dkjson.encode( M["configs"], {indent=true} )
end


function M.dump_to_file()
    local config_data = M.report()
    local config_dump_path = M.home_path() .. "/config.json"
    
    ngx.log(ngx.STDERR,config_dump_path)

    file = io.open( config_dump_path, "w");
    --file = io.open( "/tmp/config.json", "w");
    file:write(config_data);
    file:close();
    return cjson.encode({["ret"]="success"})
end

--auto load config from json file
M.load_from_file()

return M
