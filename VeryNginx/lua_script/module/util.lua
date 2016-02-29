-- -*- coding: utf-8 -*-
-- @Date    : 2016-02-29 
-- @Author  : Alexa (AlexaZhou@163.com)
-- @Link    : 
-- @Disc    : some tools

local _M = {}


function _M.string_replace(s, pattern, replace, times)
    
    
    local ret = nil
    while times >= 0 do
        times =  times - 1
        local s_start,s_stop = string.find(s, pattern , 1, true ) -- 1,true means plain searches from index 1
        if s_start ~= nil and s_stop ~= nil then 
            s = string.sub( s, 1, s_start-1 ) .. replace .. string.sub( s, s_stop+1 )
        end
    end

    return s
end

return _M
