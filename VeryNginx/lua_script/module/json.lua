-- -*- coding: utf-8 -*-
-- @Date    : 2016-03-08 
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : import cjson module , but use dkjson to replace if cjson module is not ready 

local _M = {}

_M.json = nil

function _M.import_cjson()
    _M.json = require 'cjson'
end

if pcall( _M.import_cjson ) ~= true then
    _M.json = require 'dkjson'
end

return _M.json
