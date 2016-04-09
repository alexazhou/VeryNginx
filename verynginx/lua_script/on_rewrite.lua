--At first , make sure every request use latest running config
local VeryNginxConfig = require "VeryNginxConfig"
VeryNginxConfig.update_config()

local scheme_lock = require "scheme_lock"
local redirect = require "redirect"
local uri_rewrite = require "uri_rewrite"
scheme_lock.run()
redirect.run()
uri_rewrite.run()


