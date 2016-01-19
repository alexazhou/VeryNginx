var tips = new Object();

tips.show_tips_group = function(group){

}

tips.data = {
    'redirect_scheme':[
        {"tips":"功能介绍","content":"协议重定向功能可以指定访问URL应该使用https还是http协议"},
        {"tips":"实现原理","content":"本功能在用户访问一个URI时，检测使用的协议是否和规则一致，\
		                              不一致则返回302状态码和新的协议地址，使浏览器自动跳转到指定的协议进行访问"},
        {"tips":"配置说明","content":["参数URI为一个正则表达式，用来匹配网络请求的路径，也就是Nginx变量URI",
		                              "协议选择https或者http则表示只能通过选中的协议进行访问，选择both则可以使用两种协议进行访问",
									  "规则按照从上到下的顺序进行匹配，仅使用匹配到的第一条规则"]}
    ],
}
