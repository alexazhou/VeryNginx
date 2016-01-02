-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 00:51
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : handle VeryNginx configuration

local M = {}

M["configs"] = {}

--------------default config------------

M["configs"].attack_url = {"\\.(git|svn|\\.)",
"\\.(haccess|bash_history|sql)$",
}

--M.configs.url_whitelist = {"aaa"}

----------------------------------------
dkjson = require "dkjson"
cjson = require "cjson"

function M.config_file_path()
    local current_script_path = debug.getinfo(1, "S").source:sub(2)
    local config_dump_path = current_script_path:sub( 1, 0 - string.len("lua_script/VeryNginxConfig.lua") -1 ) .. "config.json"
    return config_dump_path
end

function M.load_from_file()
    local config_dump_path = M.config_file_path()
    local  file = io.open( config_dump_path, "r");
    
    if file == nil then
        return cjson.encode({["ret"]="error",["msg"]="config file not found"})
    end

    --file = io.open( "/tmp/config.json", "w");
    local data = file:read("*all");
    file:close();

    ngx.log(ngx.STDERR, data)
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
    return dkjson.encode( M["configs"] )
end


function M.dump_to_file()
    local config_data = M.report()
    local config_dump_path = M.config_file_path()
    
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
