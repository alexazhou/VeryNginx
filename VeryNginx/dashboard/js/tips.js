var tips = new Object();

tips.tips_vm = null;
tips.show_tips_group = function(group){

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
    'redirect_scheme':[
        {"tips":"功能介绍","content":"协议重定向功能可以指定访问URL应该使用https还是http协议"},
        {"tips":"实现原理","content":"本功能在用户访问一个URI时，检测使用的协议是否和规则一致，\
		                              不一致则返回302状态码和新的协议地址，使浏览器自动跳转到指定的协议进行访问"},
        {"tips":"配置说明","content":["参数URI为一个正则表达式，用来匹配网络请求的路径，也就是Nginx变量URI",
		                              "协议选择https或者http则表示只能通过选中的协议进行访问，选择both则可以使用两种协议进行访问",
									  "规则匹配时不区分大小写，按照从上到下的顺序进行匹配，仅使用匹配到的第一条规则"]}
    ],
    'redirect_uri':[
        {"tips":"功能介绍","content":"URI重定向功能可以将访问指定URL的请求重定向到其他URI"},
        {"tips":"实现原理","content":"本功能在用户访问一个URI时，检测该URI是否在列表中，\
		                              如果在则返回302状态码和新的协议地址，使浏览器自动跳转到指定的URI进行访问"},
        {"tips":"配置说明","content":["参数URI为一个正则表达式，用来匹配完整或是一部分的的请求URI，也就是Nginx变量URI",
		                              "替换目标参数将用来替换URI中被正则表达式匹配的部分，这就是新的访问地址",
									  "规则匹配时不区分大小写，按照从上到下的顺序进行匹配，仅使用匹配到的第一条规则"]}
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
									  "删除VeryNginx目录下的config.json文件可以恢复初始设置"]}
    ],


}
