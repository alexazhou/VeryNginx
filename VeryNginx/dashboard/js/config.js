var config = new Object();

config.config_vm = null; 
config.verynginx_config = {};

config.get_config = function(){
    $.get("/verynginx/config",function(data,status){
        config.verynginx_config = data;
            
        if( config.config_vm != null ){
            config.config_vm.$data = config.verynginx_config;
            dashboard.notify("获取配置成功");
            return;
        }

        config.config_vm = new Vue({
            el: '#verynginx_config',
            data: config.verynginx_config,
            computed : {
                all_config_json: function(){
                    return  JSON.stringify( config.verynginx_config , null, 2);
                }
            }
        });

    }); 
}


config.config_add = function(name,value){
    config.verynginx_config[name].push(value);
}

config.config_mod = function(name,index,value){

    console.log('-->',name,index,value);
    
    if( value == null ){
        config.verynginx_config[name].$remove( config.verynginx_config[name][index] );
    }else{
        //config.verynginx_config[name].$set( index, config.verynginx_config[name][index] );
    }

}

config.config_move_up = function(name,index){
    
    if(index == 0){
        dashboard.notify("已经是最前面了");
        return;
    }

    var tmp = config.verynginx_config[name][index-1];
    config.verynginx_config[name].$set(index-1, config.verynginx_config[name][index]);
    config.verynginx_config[name].$set(index, tmp);
}

config.config_move_down = function(name,index){
    if(index >= config.verynginx_config[name].length - 1){
        dashboard.notify("已经是最后面了");
        return;
    }
    
    var tmp = config.verynginx_config[name][index+1];
    config.verynginx_config[name].$set(index+1, config.verynginx_config[name][index]);
    config.verynginx_config[name].$set(index, tmp);
}

config.save_config = function(){
    console.log("save_config");
	var config_json = JSON.stringify( config.verynginx_config , null, 2);

    $.post("/verynginx/config",{ config:config_json },function(data){
        console.log(data);
        if( data['ret'] == 'success' ){
            dashboard.notify("保存配置成功");
		}else{
            dashboard.notify("保存配置失败");
		}
	})
}




