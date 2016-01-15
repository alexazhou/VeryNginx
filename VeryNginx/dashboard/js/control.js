var control = new Object()

control.verynginx_config = {}

control.init = function(){
    control.get_config();
}

control.get_config = function(){
	$(".init_click").click();
    $.get("/verynginx/config",function(data,status){
        console.log(status);
        console.log(data);
		control.verynginx_config = data;

        var config_json = JSON.stringify(data, null, 2);
		$("#config_system_all_show").text(config_json);

        new Vue({
            el: '#verynginx_configs',
            data: control.verynginx_config
        })
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
	$(".config_group").hide();
    $("#config_" + $(item).attr("group")).show();
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
