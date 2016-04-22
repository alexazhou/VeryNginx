if ngx.var.vn_exec_flag ~= '' then
    return
end

local filter = require "filter"
filter.filter()

local browser_verify = require "browser_verify"
browser_verify.filter()

local frequency_limit = require "frequency_limit"
frequency_limit.filter()

local router = require "router"
router.filter()

local backend_static = require "backend_static"
backend_static.filter()

local backend_proxy = require "backend_proxy"
backend_proxy.filter()
