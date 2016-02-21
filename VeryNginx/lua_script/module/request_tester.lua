-- -*- coding: utf-8 -*-
-- @Date    : 2016-02-06 22:26
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : test a request hit a matcher or not

_M = {}

local tester = {}

function _M.test( matcher )
    
	for name, v in pairs( matcher ) do
        if tester[name] ~= nil then
            if tester[name]( v ) == true then
                return true
			end
		end
	end

	return false
end

function _M.test_uri( condition )
    
    local operator = condition['operator']
    local value =  condition['value']
    local uri = ngx.var.uri;

    if operator == "=" then
        if ngx.var.uri == value then
            return true
        end
    elseif operator == "!=" then
        if ngx.var.uri ~= value then
            return true
        end
    elseif operator == '≈' then
        if ngx.re.find( ngx.var.uri, value, 'isjo' ) ~= nil then
            return true
        end
    elseif operator == '!≈' then
        if ngx.re.find( ngx.var.uri, value, 'isjo' ) == nil then
            return true
        end
    end

    return false
end

function _M.test_ip( condition )
    if ngx.var.remote_addr == ip then
		return true
    end
    return false
end

function _M.test_ua( condition )
    
    local operator = condition['operator']

    if operator == "=" then
    elseif operator == "!=" then
    elseif operator == '≈' then
    elseif operator == '!≈' then
    elseif operator == '!' then
    end

    return false
end

function _M.test_referer( condition )
    return false
end

function _M.test_method( condition )
    return false
end

function _M.test_args( condition )
    return false
end

function _M.test_domain( condition )
    return false
end


tester["URI"] = _M.test_uri
tester["IP"] = _M.test_ip
tester["UserAgent"] = _M.test_ua
tester["Method"] = _M.test_method
tester["Args"] = _M.test_args
tester["Domain"] = _M.test_referer

return _M
