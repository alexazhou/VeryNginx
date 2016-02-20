-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 00:51
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : handle VeryNginx configuration

local _M = {}

_M["configs"] = {}

--------------default config------------
_M.configs["admin"] = {
    { ["user"] = "verynginx", ["password"] = "verynginx", ["enable"] = true}
}

_M.configs['matcher'] = {
    ["attack_sql_0"] = { 
        ["URI"] = { 
            ['operator'] = "≈",
            ['value']="select.*from",
        },
    },
    ["attack_backup_0"] = { 
        ["URI"] = {
            ['operator'] = "≈",
            ['value']="\\.(haccess|bash_history|ssh|sql)$",
        },
    },
    ["attack_scan_0"] = { 
        ["UserAgent"] = {
            ['operator'] = "≈",
            ['value']="(nmap|w3af|netsparker|nikto|fimap|wget)",
        },
    },
    ["attack_code_0"] = { 
        ["URI"] = {
            ['operator'] = "≈",
            ['value']="\\.(git|svn|\\.)",
        },
    },
    ["verynginx"] = {
        ["URI"] = {
            ['operator'] = "≈",
            ['value']="^/verynginx/",
        }
    },
    ["localhost"] = {
        ["IP"] = {
            ["operator"] = "=",
            ["value"] = "127.0.0.1"
        }
    },
    ["demo_verynginx_short_uri"] = {
        ["URI"] = {
            ['operator'] = "≈",
            ['value']="^/vn",
        }
    },
    ["demo_other_verynginx_uri"] = {
        ["URI"] = {
            ['operator'] = "=",
            ['value']="^/redirect_to_verynginx",
        }
    }
}

_M.configs["scheme_lock_enable"] = false
_M.configs["scheme_lock_rule"] = {
    {["matcher"] = 'verynginx', ["scheme"] = "https", ["enable"] = false},
}

_M.configs["redirect_enable"] = false
_M.configs["redirect_rule"] = {
    --redirect to a static uri
    {["matcher"] = 'demo_other_verynginx_uri', ["to_uri"] = "/verynginx/dashboard/index.html", ["enable"] = true}, 
}

_M.configs["uri_rewrite_enable"] = false
_M.configs["uri_rewrite_rule"] = {
    --redirect to a Regex generate uri 
    {["matcher"] = 'demo_verynginx_short_uri', ["replace_re"] = "^/vn/(.*)", ["to_uri"] = "/verynginx/dashboard/$1", ["enable"] = true}, 
}


_M.configs["filter_enable"] = false
_M.configs["filter_rule"] = {
    {["matcher"] = 'localhost', ["action"] = "accept", ["enable"] = true},
    {["matcher"] = 'attack_sql_0', ["action"] = "block", ["enable"] = true },
    {["matcher"] = 'attack_backup_0', ["action"] = "block", ["enable"] = true },
    {["matcher"] = 'attack_scan_0', ["action"] = "block", ["enable"] = true },
    {["matcher"] = 'attack_code_0', ["action"] = "block", ["enable"] = true },
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
