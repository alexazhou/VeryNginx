-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 00:51
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : handle VeryNginx configuration

local _M = {}

--The md5 of config string
_M.config_hash = nil

_M["configs"] = {}

--------------default config------------

_M.configs["config_version"] = "0.36"
_M.configs["readonly"] = false
_M.configs["base_uri"] = "/verynginx"
_M.configs['dashboard_host'] = ""
_M.configs['cookie_prefix'] = "verynginx"
_M.configs["admin"] = {
    { ["user"] = "verynginx", ["password"] = "verynginx", ["enable"] = true}
}

_M.configs['matcher'] = {
    ["all_request"] = {},
    ["attack_sql_0"] = { 
        ["Args"] = { 
            ['name_operator'] = "*",
            ['operator'] = "≈",
            ['value']="select.*from",
        },
    },
    ["attack_backup_0"] = { 
        ["URI"] = {
            ['operator'] = "≈",
            ['value']="\\.(htaccess|bash_history|ssh|sql)$",
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
            ['value']="/redirect_to_verynginx",
        }
    }
}

_M.configs["response"] = {
    ["demo_response_html"] = {
        ["content_type"] = "text/html",
        ["body"] = "This is a html demo response",
    },
    ["demo_response_json"] = {
        ["content_type"] = "application/json",
        ["body"] = '{"msg":"soms text","status":"success"}',
    }
}

_M.configs["backend_upstream"] = {
}

_M.configs["summary_collect_rule"] = {
}

_M.configs["scheme_lock_enable"] = false
_M.configs["scheme_lock_rule"] = {
    {["matcher"] = 'verynginx', ["scheme"] = "https", ["enable"] = false},
}

_M.configs["redirect_enable"] = true
_M.configs["redirect_rule"] = {
    --redirect to a static uri
    {["matcher"] = 'demo_other_verynginx_uri', ["to_uri"] = "/verynginx/index.html", ["enable"] = true}, 
}

_M.configs["uri_rewrite_enable"] = true
_M.configs["uri_rewrite_rule"] = {
    --redirect to a Regex generate uri 
    {["matcher"] = 'demo_verynginx_short_uri', ["replace_re"] = "^/vn/(.*)", ["to_uri"] = "/verynginx/$1", ["enable"] = true}, 
}

_M.configs["browser_verify_enable"] = true
_M.configs["browser_verify_rule"] = {
}

_M.configs["filter_enable"] = true
_M.configs["filter_rule"] = {
    {["matcher"] = 'localhost', ["action"] = "accept", ["enable"] = false},
    {["matcher"] = 'attack_sql_0', ["action"] = "block", ["code"] = '403', ["enable"] = true },
    {["matcher"] = 'attack_backup_0', ["action"] = "block", ["code"] = '403', ["enable"] = true },
    {["matcher"] = 'attack_scan_0', ["action"] = "block", ["code"] = '403', ["enable"] = true },
    {["matcher"] = 'attack_code_0', ["action"] = "block", ["code"] = '403', ["enable"] = true },
}

_M.configs["proxy_pass_enable"] = true
_M.configs["proxy_pass_rule"] = {
}

_M.configs["static_file_enable"] = true
_M.configs["static_file_rule"] = {}

_M.configs["frequency_limit_enable"] = true
_M.configs["frequency_limit_rule"] = {}

_M.configs["summary_request_enable"] = true
_M.configs["summary_with_host"] = false
_M.configs["summary_group_persistent_enable"] = true
_M.configs["summary_group_temporary_enable"] = true
_M.configs["summary_temporary_period"] = 60
----------------------Config End-------------

------------------Config Updater----------------------

function _M.version_updater_02( configs )
    configs['browser_verify_enable'] = false
    configs['browser_verify_rule'] = {}
    configs["config_version"] = "0.21"
    return configs
end

function _M.version_updater_021( configs )
    configs['readonly'] = false
    configs["config_version"] = "0.22"
    return configs
end

function _M.version_updater_022( configs )
    configs["proxy_pass_enable"] = true
    configs["proxy_pass_rule"] = {}
    configs["backend_upstream"] = {}
    configs["static_file_enable"] = true
    configs["static_file_rule"] = {}
    configs["frequency_limit_enable"] = true
    configs["frequency_limit_rule"] = {}
    configs["config_version"] = "0.3"
    return configs
end

function _M.version_updater_03( configs )
    configs['base_uri'] = "/verynginx"
    configs["config_version"] = "0.31"
    return configs
end

function _M.version_updater_031( configs )
    configs['dashboard_host'] = ""
    configs['cookie_prefix'] = "verynginx"
    configs["config_version"] = "0.32"
    return configs
end

function _M.version_updater_032( configs )
    configs['summary_collect_rule'] = {
    }
    configs["config_version"] = "0.33"
    return configs
end

function _M.version_updater_033( configs )
    local matcher_list = configs['matcher']
    
    for matcher_name,matcher_value in pairs( matcher_list ) do
        for condition_type,condition_value in pairs( matcher_value ) do
            if condition_type == 'Args' and condition_value['name'] ~= nil then
                condition_value['name_operator'] =  "≈"
                condition_value['name_value'] = condition_value['name']
                condition_value['name'] = nil
            end
        end
    end
    
    configs["config_version"] = "0.34"
    return configs
end

function _M.version_updater_034( configs )
    configs['response'] = {}
    configs['response']["demo_response_html"] = {
        ["content_type"] = "text/html",
        ["body"] = "This is a html demo response",
    }
    configs['response']["demo_response_json"] = {
        ["content_type"] = "application/json",
        ["body"] = '{"msg":"soms text","status":"success"}',
    }

    configs["config_version"] = "0.35"
    return configs
end

function _M.version_updater_035( configs )
    configs["summary_with_host"] = false
    configs["summary_group_persistent_enable"] = true
    configs["summary_group_temporary_enable"] = true
    configs["summary_temporary_period"] = 60
    configs["config_version"] = "0.36"
    return configs
end

_M.version_updater = {
    ['0.2'] = _M.version_updater_02,
    ['0.21'] = _M.version_updater_021,
    ['0.22'] = _M.version_updater_022,
    ['0.3'] = _M.version_updater_03,
    ['0.31'] = _M.version_updater_031,
    ['0.32'] = _M.version_updater_032,
    ['0.33'] = _M.version_updater_033,
    ['0.34'] = _M.version_updater_034,
    ['0.35'] = _M.version_updater_035,
}

-------------------Config Updater end---------------------


local dkjson = require "dkjson"
local json = require "json"


function _M.home_path()
    local current_script_path = debug.getinfo(1, "S").source:sub(2)
    local home_path = current_script_path:sub( 1, 0 - string.len("/lua_script/VeryNginxConfig.lua") -1 ) 
    return home_path
end

function _M.update_config()
    --save a hash of current in lua environment
    local new_config_hash = ngx.shared.status:get('vn_config_hash')
    if new_config_hash ~= nil and new_config_hash ~= _M.config_hash then
        ngx.log(ngx.STDERR,"config Hash Changed:now reload config from config.json")
        _M.load_from_file()
    end
end


function _M.load_from_file()
    local config_dump_path = _M.home_path() .. "/configs/config.json"
    local file = io.open( config_dump_path, "r")
    
    if file == nil then
        return json.encode({["ret"]="error",["msg"]="config file not found"})
    end

    --file = io.open( "/tmp/config.json", "w");
    local data = file:read("*all");
    file:close();

    --save config hash in module
    local config_hash = ngx.md5(data)
    _M.config_hash = config_hash
    ngx.shared.status:set('vn_config_hash', config_hash )

    --ngx.log(ngx.STDERR, data)
    local tmp = dkjson.decode( data )
    if tmp ~= nil then
        --update config version if need
        local loop = true
        while loop do
            local handle = _M.version_updater[ tmp['config_version'] ] 
            if handle ~= nil then
                tmp = handle( tmp )
            else
                loop = false
            end 
        end

        if tmp['config_version'] ~= _M["configs"]["config_version"] then
            ngx.log(ngx.STDERR,"load config from config.json error,will use default config")
            ngx.log(ngx.STDERR,"Except Version:")
            ngx.log(ngx.STDERR, _M["configs"]["config_version"] )
            ngx.log(ngx.STDERR,"Config.json Version:")
            ngx.log(ngx.STDERR,tmp["config_version"])
        else
            _M["configs"] =  tmp
        end

        return json.encode({["ret"]="success",['config']=_M["configs"]})
    else 
        ngx.log(ngx.STDERR,"config.json decode error")
        return json.encode({["ret"]="error",["msg"]="config file decode error, will use default"})
    end
        
end 

--return a json contain current config items
function _M.report()
    _M.set_config_metadata( _M["configs"] )
    return dkjson.encode( _M["configs"] )
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

    local new_config_json_escaped_base64 = args['config']
    local new_config_json_escaped = ngx.decode_base64( new_config_json_escaped_base64 )
    --ngx.log(ngx.STDERR,new_config_json_escaped)
   
    local new_config_json = ngx.unescape_uri( new_config_json_escaped )
    --ngx.log(ngx.STDERR,new_config_json)

    local new_config = json.decode( new_config_json )

    if _M.configs['readonly'] == true then
        ret = false
        err = "all configs was set to readonly"
    elseif _M.verify( new_config ) == true then
        ret, err = _M.dump_to_file( new_config ) 
    end

    if ret == true then
        return json.encode({["ret"]="success",["err"]=err})
    else
        return json.encode({["ret"]="failed",["err"]=err})
    end
end

function _M.set_config_metadata( config_table )

    --make sure empty table trans to right type
    local meta_table = {}
    meta_table['__jsontype'] = 'object'
    
    if config_table['matcher'] ~= nil then
        setmetatable( config_table['matcher'], meta_table )
        for key, t in pairs( config_table["matcher"] ) do
            setmetatable( t, meta_table )
        end
    end
    
    if config_table['backend_upstream'] ~= nil then
        setmetatable( config_table['backend_upstream'], meta_table )
        for key, t in pairs( config_table["backend_upstream"] ) do
            setmetatable( t['node'], meta_table )
        end
    end
    
    if config_table['response'] ~= nil then
        setmetatable( config_table['response'], meta_table )
    end
    --set table meta_data end

end

function _M.dump_to_file( config_table )

    _M.set_config_metadata( config_table )

    local config_data = dkjson.encode( config_table , {indent=true} ) --must use dkjson at here because it can handle the metadata
    local config_dump_path = _M.home_path() .. "/configs/config.json"
    
    --ngx.log(ngx.STDERR,config_dump_path)
    local file, err = io.open( config_dump_path, "w")
    if file ~= nil then
        file:write(config_data)
        file:close()
        --update config hash in shared dict
        ngx.shared.status:set('vn_config_hash', ngx.md5(config_data) )
        return true
    else
        return false, "open file failed"
    end

end

--auto load config from json file
_M.load_from_file()

return _M
