-- -*- coding: utf-8 -*-
-- @Date    : 2016-02-06 22:26
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : test a request hit a matcher or not

local cookie = require "cookie"

_M = {}

local tester = {}

function _M.test( matcher )
    if matcher == nil then
        return false
    end
    
	for name, v in pairs( matcher ) do
        if tester[name] ~= nil then
            if tester[name]( v ) ~= true then
                return false
			end
		end
	end

	return true
end

--test_var is a basic test method, used by other test method 
function _M.test_var( condition, var )
    
   local operator = condition['operator']
   local value =  condition['value']
   
   if operator == "=" then
        if var == value then
            return true
        end
    elseif operator == "!=" then
        if var ~= value then
            return true
        end
    elseif operator == '≈' then
        if var ~= nil and ngx.re.find( var, value, 'isjo' ) ~= nil then
            return true
        end
    elseif operator == '!≈' then
        if var == nil or ngx.re.find( var, value, 'isjo' ) == nil then
            return true
        end
    elseif operator == 'Exist' then
        if var ~= nil then
            return true
        end
    elseif operator == '!Exist' then
        if var == nil then
            return true
        end
    elseif operator == '!' then
        if var == nil then
            return true
        end
    end

    return false
end

--test a group of var in table with a condition 
function _M.test_many_var( var_table, condition )
    
    local find = ngx.re.find
    local test_var = _M.test_var

    local name_operator = condition['name_operator']
    local name_value = condition['name_value']

    if name_operator == '=' then
        return test_var( condition, var_table[name_value] )
    elseif name_operator == '!=' then
        for k, v in pairs(var_table) do
            if k ~= name_value then
               if test_var( condition, k ) == true then -- if any one value match the condition, means the matcher has been hited 
                   return true 
               end
            end
        end
    elseif name_operator == '*' then
        for k, v in pairs(var_table) do
            if test_var( condition, k ) == true then -- if any one value match the condition, means the matcher has been hited 
               return true 
            end
        end
    elseif name_operator == '≈' or name_operator == '!≈' then
        for k, v in pairs(var_table) do
            if find( k, name_value ) ~= nil then
               if test_var( condition, k ) == true then -- if any one value match the condition, means the matcher has been hited 
                   return true
               end  
            end
        end
    end

    return false
end

function _M.test_uri( condition )
    local uri = ngx.var.uri;
    return _M.test_var( condition, uri )
end

function _M.test_ip( condition )
    local remote_addr = ngx.var.remote_addr
    return _M.test_var( condition, remote_addr )
end

function _M.test_ua( condition )
    local http_user_agent = ngx.var.http_user_agent;
    return _M.test_var( condition, http_user_agent )
end

function _M.test_referer( condition )
    local http_referer = ngx.var.http_referer;
    return _M.test_var( condition, http_referer )
end

--uncompleted
function _M.test_method( condition )
    return false
end

function _M.test_args( condition )
    local target_arg_re = condition['name']
    local find = ngx.re.find
    local test_var = _M.test_var

    --handle args behind uri
    for k,v in pairs( ngx.req.get_uri_args()) do
        if type(v) == "table" then
            for arg_idx,arg_value in ipairs(v) do
                if type(arg_value) == "string" and ( target_arg_re == nil or find( k, target_arg_re ) ~= nil ) then
                    if test_var( condition, arg_value ) == true then
                        return true
                    end
                end
            end
        elseif type(v) == "string" then
            if target_arg_re == nil or find( k, target_arg_re ) ~= nil then
                if test_var( condition, v ) == true then
                    return true
                end
            end
        end
    end
    
    ngx.req.read_body()
    --ensure body has not be cached into temp file
    if ngx.req.get_body_file() ~= nil then
        return false
    end
    
    local body_args,err = ngx.req.get_post_args()
    if body_args == nil then
        ngx.say("failed to get post args: ", err)
        return false
    end
    
    --check args in body
    for k,v in pairs( body_args ) do
        if type(v) == "table" then
            for arg_idx,arg_value in ipairs(v) do
                if type(arg_value) == "string" and ( target_arg_re == nil or find( k, target_arg_re ) ~= nil ) then
                    if test_var( condition, arg_value ) == true then
                        return true
                    end
                end
            end
        elseif type(v) == "string" then
            if target_arg_re == nil or find( k, target_arg_re ) ~= nil then
                if test_var( condition, v ) == true then
                    return true
                end
            end
        end
    end

    return false
end

function _M.test_host( condition )
    local hostname = ngx.var.host
    return _M.test_var( condition, hostname )
end

function _M.test_header( condition )
    local header_table = ngx.req.get_headers()
    return _M.test_many_var( header_table, condition )
end

function _M.test_cookie( condition )
    local cookie_obj, err = cookie:new()
    local cookie_table = cookie_obj:get_all()

    if cookie_table == nil then
        cookie_table = {}
    end
    return _M.test_many_var( cookie_table, condition )
end

tester["URI"] = _M.test_uri
tester["IP"] = _M.test_ip
tester["UserAgent"] = _M.test_ua
tester["Method"] = _M.test_method
tester["Args"] = _M.test_args
tester["Referer"] = _M.test_referer
tester["Host"] = _M.test_host
tester["Header"] = _M.test_header
tester["Cookie"] = _M.test_cookie

return _M
