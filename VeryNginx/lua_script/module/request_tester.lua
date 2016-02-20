-- -*- coding: utf-8 -*-
-- @Date    : 2016-02-06 22:26
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : test a request hit a matcher or not

_M = {}


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

function _M.test_uri( re )
    if ngx.re.find( ngx.var.uri, re, 'is' ) ~= nil then
		return true
    end
    return false
end

function _M.test_ip( ip )
    if ngx.var.remote_addr == ip then
		return true
    end
    return false
end

function _M.test_ua( re )
    return false
end

function _M.test_referer( re )
    return false
end

function _M.test_method( method )
    return false
end

function _M.test_args( re )
    return false
end

function _M.test_domain( )
    return false
end

local tester = {
    ["URI"] = _M.test_uri,
	["IP"] = _M.test_ip,
	["UserAgent"] = _M.test_ua,
	["Method"] = _M.test_method,
	["Args"] = _M.test_args,
	["Domain"] = _M.test_referer,
}

return _M
