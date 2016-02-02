-- -*- coding: utf-8 -*-
-- -- @Date    : 2016-02-02 13:37
-- -- @Author  : Alexa (AlexaZhou@163.com)
-- -- @Link    : 
-- -- @Disc    : auto generate encrypt_seed

VeryNginxConfig = require "VeryNginxConfig"
dkjson = require "dkjson"


local M = {}
M.seed = nil

function M.get_seed()

    --return seed from memory
    if M.seed ~= nil then
        return M.seed
    end
    
    --return saved seed
    local seed_path = VeryNginxConfig.home_path() .. "/encrypt_seed.json"
    
    local file = io.open( seed_path, "r")
    if file ~= nil then
        local data = file:read("*all");
        file:close();
        local tmp = dkjson.decode( data )

        M.seed = tmp['encrypt_seed']

        return M.seed
    end


    --if no saved seed, generate a new seed and saved
    M.seed = ngx.md5( ngx.now() )
    local new_seed_json = dkjson.encode( { ["encrypt_seed"]= M.seed }, {indent=true} )
    local file,err = io.open( seed_path, "w")
    
    if file ~= nil then
        file:write( new_seed_json )
        file:close()
        return M.seed
    else
        ngx.log(ngx.STDERR, 'save encrypt_seed failed' )
        return ''
    end
        
end

function M.generate()
end

return M
