-- -*- coding: utf-8 -*-
-- @Date    : 2015-10-25 15:56:46
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : redirect request to right scheme

_M = {}


local VeryNginxConfig = require "VeryNginxConfig"


function scheme_judge(uri)
	--before match url, strip the possible "/index.php"
    for i, v in ipairs( VeryNginxConfig.configs["redirect_scheme_rule"] ) do
		if ngx.re.find( uri, v[1], 'is' ) then
			return v[2]
		end
    end
    return 'none'
end

function _M.run()

    if VeryNginxConfig.configs["redirect_scheme_enable"] ~= true then
        return
    end

	local scheme = scheme_judge( ngx.var.uri ) 
	if scheme == "none" or scheme == ngx.var.scheme then
		return
	end
	
        if ngx.var.args ~= nil then
		ngx.redirect( scheme.."://"..ngx.var.host..ngx.var.uri.."?"..ngx.var.args , ngx.HTTP_MOVED_TEMPORARILY)
	else
		ngx.redirect( scheme.."://"..ngx.var.host..ngx.var.uri , ngx.HTTP_MOVED_TEMPORARILY)
	end
end

return _M
