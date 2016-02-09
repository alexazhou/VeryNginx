-- -*- coding: utf-8 -*-
-- @Date    : 2015-10-25 15:56:46
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : redirect request to right scheme

_M = {}


local VeryNginxConfig = require "VeryNginxConfig"


function scheme_judge(uri)
	local ngx_re_find  = ngx.re.find
    for i, v in ipairs( VeryNginxConfig.configs["redirect_scheme_rule"] ) do
		if ngx_re_find( uri, v[1], 'is' ) then
			return v[2]
		end
    end
    return 'none'
end

function _M.run()

    if VeryNginxConfig.configs["redirect_scheme_enable"] ~= true then
        return
    end

    local ngx_var = ngx.var 
	local scheme = scheme_judge( ngx_var.uri ) 
	if scheme == "none" or scheme == ngx_var.scheme then
		return
	end
	
    if ngx_var.args ~= nil then
		ngx.redirect( scheme.."://"..ngx_var.host..ngx_var.uri.."?"..ngx_var.args , ngx.HTTP_MOVED_TEMPORARILY)
	else
		ngx.redirect( scheme.."://"..ngx_var.host..ngx_var.uri , ngx.HTTP_MOVED_TEMPORARILY)
	end
end

return _M
