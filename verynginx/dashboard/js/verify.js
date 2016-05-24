//提供对输入表单的校验
//符合返回 ''
//不符合返回错误原因描述字符串

var verify = new Object();

//校验数值范围,需要是整数
verify.range = function (min,max)
{
    var handle = function(v){

        if(v.indexOf('.') >=0 )
            return "必须是"+min+"和"+max+"之间的整数";
        
        if( (min <= v) && ( v <= max) ){
        
            return "";
        
        }else{
        
            return "必须是"+min+"和"+max+"之间的整数";
        
        }

        
    }

    return handle;
}

//校验数值范围,可以是小数
verify.floatRange = function (min,max)
{
    var handle = function(v){
        
        if( (v<min) && (v<max))
            return "必须在"+min+"和"+max+"之间";

        return "";
    }

    return handle;
}


//校验值是否在数值范围内，或者为0
verify.rangeOrZero = function (min,max)
{
    var handle = function(v) {
        
        var err_message = "必须为整数,在"+min+"和"+max+"之间,或者为0";

        if(v==0)
            return "";

        if(v.indexOf('.') >=0 )
            return err_message;

        if( ( min <= v ) && ( v <= max ) ){
        
            return "";
        
        }else{
        
            return err_message;
        
        }

    }

    return handle;
}


//校验字符串长度
verify.str_len =  function(min,max)
{

    var handle = function(v){
        
        if(v.length<min || v.length>max)
            return "字符串长度需要在"+ min + "到" + max +"之间";

        return "";
    }

    return handle;
}

//校验字符串长度是否在范围内，或者为指定长度
verify.str_len_2 =  function(min,max,except)
{

    var handle = function(v){
        
        if(v.length == except)
            return "";

        if(v.length<min || v.length>max)
            return "字符串长度需要在"+ min + "到" + max +"之间";

        return "";
    }

    return handle;
}

//有且仅仅有四个字节的字符串,仅限'0'-'9','A'-'F'
verify.AddrOf101Message =  function(min,max)
{

    var handle = function(v){

        v = v.replaceAll(' ','');//去掉空格

        if(v.length == 0)//地址可以不填写
            return '';

        if(v.length != 4 )
            return "需要是有且仅仅有四个字符的字符串,仅限'0'-'9','A'-'F'";

        var map = '0123456789ABCDEF';//允许的字符集
        for(var i=0;i<v.length;i++){
            
            var char = v[i];
            if(map.indexOf(char) <0)
                return "需要是有且仅仅有四个字符的字符串,仅限'0'-'9','A'-'F'";
        }

        return "";
    }

    return handle;
}


//校验是否合法的ip地址
verify.ip =function ()
{
    
    var handle = function( ip ){
        
        var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;//正则表达式     
        if(re.test(ip))     
        {     
           if( RegExp.$1<256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256)   
           return '';     
        }     

        
        return '不是合法的IP地址';

        
    }

    return handle;
}

//校验是否合法的端口
verify.port = function()
{

    return this.range(0,65535);
}

verify.uri = function(){
    var handle = function( v ){
        if( v.length == 0  ){
            return "URI require to contain at least one character";
        }

        if( v.indexOf('/') != 0  ){
            return "URI require to start with '/' ";
        }

        if( v.length > 1 && v.lastIndexOf('/')  == v.length - 1  ){
            return "URI should not end with '/' ";
        }

        return null;
    }

    return handle;
}





