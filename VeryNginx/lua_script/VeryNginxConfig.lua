-- -*- coding: utf-8 -*-
-- @Date    : 2016-01-02 00:51
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : handle VeryNginx configuration

local M = {}

M.attack_url = {"\\.(git|svn)",
"\\.(haccess|bash_history|sql)$",
}

return M
