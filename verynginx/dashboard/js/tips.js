var tips = new Object();

tips.tips_vm = null;
tips.show_tips = function(group){

    $('.tips_content').collapse('hide');

    if(tips.tips_vm != null){
        tips.tips_vm.$data = {tips:tips.data[group]};
        return;
    } 

    tips.tips_vm = new Vue({
        el: '#verynginx_tips',
        data: {tips:tips.data[group]},
    });

}

tips.toggle = function(tips_container){
    $(tips_container).children(':last').collapse('toggle');
}

tips.data = {
    'basic_matcher':[
        {"tips":"Purpose","content":"A Matcher used to match request"},
        {"tips":"Introduce","content":"When a request match all condition in a matcher, the request hit the matcher"},
        {"tips":"Usage","content":["You can add one or more conditions to a matcher",
		                              "A empty matcher will match all request"]}
    ],
    'action_scheme_lock':[
        {"tips":"Purpose","content":"Lock all request on http or https"},
        {"tips":"Introduce","content":"This action will check if the scheme current using fit to the rule. If scheme wrong, it will give a 302 redirect to the right scheme" },
        {"tips":"Usage","content":["https/http means only https/http,both means not limit",
                                   "From top to bottom to match, and only use the first match rule"]
        
        },
    ],
    'action_redirect':[
        {"tips":"Purpose","content":"Redirect to other address"},
        {"tips":"Usage","content":["From top to bottom to match, and only use the first match rule"]}
    ],
    'filter_ipwhitelist':[
        {"tips":"功能介绍","content":"IP白名单功能可以指定免过滤的IP"},
        {"tips":"实现原理","content":"来自该列表中IP的访问请求将跳过过滤阶段"},
        {"tips":"配置说明","content":"请填写完整的IP地址"}
    ],
    'filter_ip':[
        {"tips":"功能介绍","content":"IP过滤功能可以拦截来自某些IP的所有访问"},
        {"tips":"实现原理","content":"来自该列表中IP的访问请求将返回503"},
        {"tips":"配置说明","content":"请填写完整的IP地址"}
    ],
    'filter_useragent':[
        {"tips":"功能介绍","content":"UserAgent过滤功能可以拦截来自某些客户端访问"},
        {"tips":"实现原理","content":"本功能在收到一个请求时，检查请求所携带的useragent是否和规则一致，如果一致则返回503禁止访问"},
        {"tips":"配置说明","content":["参数UserAgent为一个正则表达式，用来匹配请求的UserAgent",
									  "规则匹配时不区分大小写，按照从上到下的顺序进行匹配，有一条规则匹配到即被拦截"]}
    ],
    'filter_uri':[
        {"tips":"功能介绍","content":"URI过滤功能可以拦截对某些URI的访问请求"},
        {"tips":"实现原理","content":"本功能在收到一个请求时，检查所请求的URI是否和规则一致，如果一致则返回503禁止访问"},
        {"tips":"配置说明","content":["参数URI为一个正则表达式，用来匹配请求的URI",
		                              "URI和Nginx的变量URI一致，表示请求地址中域名之后的部分，不包含查询字符串",
									  "规则匹配时不区分大小写，按照从上到下的顺序进行匹配，有一条规则匹配到即被拦截"]}
    ],
    'filter_arg':[
        {"tips":"功能介绍","content":"参数过滤功能可以拦截带有危险参数的访问请求"},
        {"tips":"实现原理","content":"本功能在收到一个请求时，检查请求所携带的参数是否和规则一致，如果一致则返回503禁止访问"},
        {"tips":"配置说明","content":["参数ARG为一个正则表达式，用来匹配请求所携带的参数值",
		                              "规则将检查GET和POST请求的每一个参数",
									  "规则匹配时不区分大小写，按照从上到下的顺序进行匹配，有一条规则匹配到即被拦截"]}
    ],
    'summarg_request':[
        {"tips":"功能介绍","content":"访问统计功能可以统计各URI的访问情况"},
    ],
    
    'system_allconfig':[
        {"tips":"功能介绍","content":"可以在这里看到全部的配置情况"},
        {"tips":"操作说明","content":["点击保存配置将保存全部配置到服务器，并即刻生效",
		                              "点击读取配置将从服务器获取当前使用的配置",
									  "配置保存在VeryNginx目录下的config.json文件。备份/删除 该文件可以 备份/恢复默认 设置"]}
    ],


}
