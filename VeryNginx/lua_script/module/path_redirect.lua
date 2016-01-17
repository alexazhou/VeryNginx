-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 20:39
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : redirect path

M = {}

VeryNginxConfig = require "VeryNginxConfig"


function M.run()
    
    if VeryNginxConfig.configs["redirect_uri_enable"] ~= true then
        return
    end

    local new_url = nil 

    for i, v in ipairs( VeryNginxConfig.configs["redirect_uri_rule"] ) do
        --ngx.log(ngx.STDERR,"gsub test:"..k.."=>"..v )
        new_url = ngx.re.sub( ngx.var.uri, v[1], v[2] ) 
        --ngx.log(ngx.STDERR,"new url:",new_url )
        if new_url ~= ngx.var.uri then
            --ngx.log(ngx.STDERR,"redirect to :",new_url )
            if ngx.var.args ~= nil then
                ngx.redirect( ngx.var.scheme.."://"..ngx.var.host..new_url.."?"..ngx.var.args , ngx.HTTP_MOVED_TEMPORARILY)
            else
                ngx.redirect( ngx.var.scheme.."://"..ngx.var.host..new_url , ngx.HTTP_MOVED_TEMPORARILY)
            end
            return
        end
        --ngx.log(ngx.STDERR,"re test not match" )
    end

end

return M
