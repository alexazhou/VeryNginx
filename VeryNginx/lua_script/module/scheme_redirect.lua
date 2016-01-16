-- -*- coding: utf-8 -*-
-- @Date    : 2015-10-25 15:56:46
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : redirect request to right scheme

M = {}


VeryNginxConfig = require "VeryNginxConfig"


function scheme_judge(uri)
	--before match url, strip the possible "/index.php"
	
    for i, v in ipairs( VeryNginxConfig.configs["scheme_redirect_rule"] ) do
		--ngx.log(ngx.STDERR,"re test:"..key )
		if ngx.re.find( uri, v[1], 'is' ) then
			--ngx.log(ngx.STDERR,"re test matched" )
			return v[2]
		end
		--ngx.log(ngx.STDERR,"re test not match" )
	end

	return 'none'
end

function M.run()

    if VeryNginxConfig.configs["scheme_redirect_enable"] ~= true then
        return
    end


	ret = scheme_judge( ngx.var.uri ) 
	--ngx.log(ngx.STDERR,"scheme_judge ret:"..ret )

	if ret == "none" or ret == ngx.var.scheme then
		return
	end

	--ngx.log(ngx.STDERR,"do redirect:"..ret )
	--ngx.log(ngx.STDERR,ngx.var.args )
	if ngx.var.args ~= nil then
		ngx.redirect( ret.."://"..ngx.var.host..ngx.var.uri.."?"..ngx.var.args , ngx.HTTP_MOVED_TEMPORARILY)
	else
		ngx.redirect( ret.."://"..ngx.var.host..ngx.var.uri , ngx.HTTP_MOVED_TEMPORARILY)
	end
end

return M
