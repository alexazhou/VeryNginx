-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 00:51
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : handle VeryNginx configuration

local M = {}

M.attack_url = {"\\.(git|svn)",
"\\.(haccess|bash_history|sql)$",
}

cjson = require "cjson"

function M.report()
    local report = {}
    for k, v in pairs(M) do
        if type( v ) == "table" then
            report[k] = v
        end
    end
    return cjson.encode(report)
end

return M
