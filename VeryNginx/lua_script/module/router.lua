-- -*- coding: utf-8 -*-
-- -- @Date    : 2016-01-02 00:35
-- -- @Author  : Alexa (AlexaZhou@163.com)
-- -- @Link    : 
-- -- @Disc    : url router

summary = require "summary"
VeryNginxConfig = require "VeryNginxConfig"
cookie = require "cookie"

local M = {}

local url_route = {}

function M.filter() 
    --ngx.log(ngx.STDERR,"run router")
    local key = string.lower(ngx.req.get_method().." "..ngx.var.uri)
    local handle = url_route[ key ]
    if handle ~= nil then
        ngx.header.content_type = "application/json"
        ngx.header.charset = "utf-8"
        if key == "post /verynginx/login" or M.check_session() == true then
            ngx.say( handle() )
            ngx.exit(200)
        else
            local info = cjson.encode({["ret"]="failed",["err"]="need login"})
            ngx.say( info )
            ngx.exit(200)
        end
    elseif string.find(key,"get /verynginx/dashboard") == 1 then
        --ngx.header.charset = "utf-8"
        ngx.header.content_type = "text/html"
        ngx.header.charset = "utf-8"
        ngx.log(ngx.STDERR,"verynginx dashboard")

        local path = VeryNginxConfig.home_path() .."/dashboard" .. string.sub( ngx.var.uri, string.len( "/verynginx/dashboard") + 1 )
        ngx.log(ngx.STDERR,"load path:",path)
        f = io.open( path, 'r' )
        if f ~= nil then
            ngx.say( f:read("*all") )
            ngx.exit(200)
        else        
            ngx.exit(404)
        end
    end
    --ngx.log(ngx.STDERR,"run router end")
end

function M.check_session()
    -- get all cookies
    local user, session
    
    ngx.log(ngx.STDERR,"step1")

    local cookie_obj, err = cookie:new()
    local fields = cookie_obj:get_all()
    ngx.log(ngx.STDERR,err)
    if not fields then
        return false
    end
    
    ngx.log(ngx.STDERR,"step2")

    user = fields['verynginx_user'] 
    session = fields['verynginx_session']
    
    ngx.log(ngx.STDERR,"step3")
    ngx.log(ngx.STDERR,user)
    ngx.log(ngx.STDERR,session)

    if user == nil or session == nil then
        return false
    end
    
    ngx.log(ngx.STDERR,"step4")


    for i,v in ipairs( VeryNginxConfig.configs['admin'] ) do
        if v[1] == user then
            if session == ngx.md5(VeryNginxConfig.configs["encrypt_seed"]..v[1]) then
                return true
            else
                return false
            end
        end
    end
    
    return false
end


function M.login()
    
    local args = nil
    local err = nil
    local session = nil

    ngx.req.read_body()
    args, err = ngx.req.get_post_args()
    if not args then
        ngx.say("failed to get post args: ", err)
        return
    end

    for i,v in ipairs( VeryNginxConfig.configs['admin'] ) do
        if v[1] == args['user'] and v[2] == args["password"] then
            session = ngx.md5(VeryNginxConfig.configs["encrypt_seed"]..v[1])
            ngx.header['Set-Cookie'] = {
                string.format("verynginx_session=%s; path=/verynginx", session ),
                string.format("verynginx_user=%s; path=/verynginx", v[1] ),
            }
            
            return cjson.encode({["ret"]="success",["err"]=err})
        end
    end 

    
    return cjson.encode({["ret"]="failed",["err"]=err})

end


url_route["post /verynginx/login"] = M.login
url_route["get /verynginx/summary"] = summary.report
url_route["get /verynginx/config"] = VeryNginxConfig.report
url_route["post /verynginx/config"] = VeryNginxConfig.set
url_route["get /verynginx/dumpconfig"] = VeryNginxConfig.dump_to_file
url_route["get /verynginx/loadconfig"] = VeryNginxConfig.load_from_file

return M
