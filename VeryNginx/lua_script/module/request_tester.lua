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


function _M.test_uri_re( re )
    if ngx.re.find( ngx.var.uri, re, 'is' ) ~= nil then
		return true
    end
end

function _M.test_ip( ip )
    if ngx.var.remote_addr == ip then
		return true
    end
end

local tester = {
    ["uri_re"] = _M.test_uri_re,
	["ip"] = _M.test_ip,
	["ua"] = _M.test_ua,
	["method"] = _M.test_method,
	["args"] = _M.test_args,
}

return _M
