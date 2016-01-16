var control = new Object();

control.verynginx_config = {};
control.config_vm = null; 

control.init = function(){
    control.get_config();
    $(".init_click").click();
}

control.get_config = function(){
    $.get("/verynginx/config",function(data,status){
    control.verynginx_config = data;
        
    if( control.config_vm != null ){
        control.config_vm.$data = control.verynginx_config;
        control.notify("获取配置成功");
        return;
    }

    control.config_vm = new Vue({
        el: '#verynginx_config',
        data: control.verynginx_config,
        computed : {
            all_config_json: function(){
                return  JSON.stringify( control.verynginx_config , null, 2);
            }
        }
    });

    }); 
}

control.switch_to_page = function( page ){
    $(".page").hide();
    $("#page_"+page).show();

    $(".topnav").removeClass("active");
    $("#topnav_"+page).addClass("active");
}

control.switch_to_configGroup = function( item ){
    console.log(item);
    var group = $(item).attr("group");
    $(".config_group").hide();
    $("#config_" + group ).show();
    
}


control.config_add = function(name,value){
    control.verynginx_config[name].push(value);
}

control.config_mod = function(name,index,value){

    console.log('-->',name,index,value);
    
    if( value == null ){
        control.verynginx_config[name].$remove( control.verynginx_config[name][index] );
    }else{
        //control.verynginx_config[name].$set( index, control.verynginx_config[name][index] );
    }

}

control.config_move_up = function(name,index){
    
    if(index == 0){
        alert("已经是最前面了");
        return;
    }

    var tmp = control.verynginx_config[name][index-1];
    control.verynginx_config[name].$set(index-1, control.verynginx_config[name][index]);
    control.verynginx_config[name].$set(index, tmp);
}

control.config_move_down = function(name,index){
    if(index >= control.verynginx_config[name].length - 1){
        alert("已经是最后面了");
        return;
    }
    
    var tmp = control.verynginx_config[name][index+1];
    control.verynginx_config[name].$set(index+1, control.verynginx_config[name][index]);
    control.verynginx_config[name].$set(index, tmp);
}

control.save_config = function(){
    console.log("save_config");
	var config_json = JSON.stringify( control.verynginx_config , null, 2);

    $.post("/verynginx/config",{ config:config_json },function(data){
	    console.log(data);
	    if( data['ret'] == 'success' ){
            control.notify("保存配置成功");
		}else{
            control.notify("保存配置失败");
		}
	})
}

control.notify = function(message){
	alert(message);
}
