//提供对输入表单的校验
//符合返回 ''
//不符合返回错误原因描述字符串

var verify = new Object();

verify.unsigned_integer = function()
{
    var handle = function(v){
        
        if( parseInt(v) != v )
            return "must be integer";
        
        if(v.indexOf('-') ==0 )
            return "must be a positive integer";
        
        if( parseInt(v) <= 0 )
            return "must be a positive integer";
    }
    return handle;
}

//校验数值范围,需要是整数
verify.integer_in_range = function (min,max)
{
    var handle = function(v){
        
        if( parseInt(v) != v )
            return "The value must be integer";

        var err_msg = "The value must between " +min+ " and " + max;
        
        if( max != null && v > max  ){
            return err_msg;
        }
        
        if( min != null && v < min  ){
            return err_msg;
        }
        return null;    
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


//verify length of the string, null means not limit
verify.str_len = function( min,max )
{
    var handle = function(v){
        if( min != null && v.length < min ){
            return "string mast more then " + min + " character";
        }
        
        if( max != null && v.length > max ){
            return "string mast less then " + max + " character";
        }
        return null;
    }

    return handle;
}

verify.ip =function ()
{
    
    var handle = function( ip ){
        var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        if(re.test(ip))     
        {     
           if( RegExp.$1<256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256)   
               return null;
        }     

        return "The value isn't a valid IP";
    }

    return handle;
}

verify.port = function()
{
    return this.integer_in_range(0,65535);
}

verify.port_or_blank = function(){
    var handle = function( v ){
        if( v == '')
            return null;

        return verify.port()(v)
    }
    return handle;
}

verify.url = function(){
    var handle = function(v){
        if( v.indexOf('https://') != 0 &&  v.indexOf('http://') != 0  ){
            return 'URL should start with a "https://" or "http://" ';
        }
    }
    return handle;
}

verify.uri = function(){
    var handle = function( v ){
        if( v.length == 0  ){
            return "The value require to contain at least one character";
        }

        if( v.indexOf('/') != 0  ){
            return "The value require to start with '/' ";
        }
        return null;
    }
    return handle;
}

//base uri of VerifyNginx dashboard
verify.base_uri = function(){
    var handle = function(v){
        var v_uri = verify.uri();
        var v_uri_ret = v_uri(v);
        
        if( v_uri_ret != null)
            return v_uri_ret;
        
        if( v.length > 1 && v.lastIndexOf('/')  == v.length - 1  ){
            return "Base URI should not end with '/' ";
        }

        return null;
    }
    return handle;
}

//url or uri 
verify.url_or_uri = function(){
    var handle = function(v){
        var v_uri = verify.uri();
        var v_uri_ret = v_uri(v);
        
        var v_url = verify.url();
        var v_url_ret = v_url(v);

        if( v_uri_ret != null && v_url_ret != null ){
            return "The string is not a valid uri or url";
        }

        return;
    }
    return handle;
}

verify.path = verify.uri;

verify.ngx_time = function(){
    var handle = function(v){
        
        if( v == '' ){
            return "The value can't be empty string";
        }

        if( v == 'epoch'){
            return null;
        }

        var map = 'smhd';//char can be used
        var err_msg = 'The value must be "epoch" or end with the character in "' + map + '"';
        
        var last_char = v.substring( v.length - 1 );
        if( map.indexOf( last_char ) < 0 ){
            return err_msg;
        }
        
        return null;
    }
    return handle;
}

verify.host = function(){
    var handle = function(v){
        if( v == ''  ){
            return "The value can't empty";
        }

        if( v.indexOf(" ") >= 0 ){
            return "The value can't include ' '";
        }

        return null;
    }
    return handle;
}

verify.host_or_empty = function(){
    var handle = function(v){
        if( v == '' ){
            return null;
        }
        return verify.host()(v);
    }
    return handle;
}



