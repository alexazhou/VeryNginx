local summary = require "summary"
local filter = require "filter"
local browser_verify = require "browser_verify"
local frequency_limit = require "frequency_limit"
local router = require "router"
local backend_static = require "backend_static"
local backend_proxy = require "backend_proxy"

if ngx.var.vn_exec_flag and ngx.var.vn_exec_flag ~= '' then
    return
end

summary.pre_run_matcher()

filter.filter()
browser_verify.filter()
frequency_limit.filter()
router.filter()


backend_static.filter()
backend_proxy.filter()
