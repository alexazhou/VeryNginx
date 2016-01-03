var control = new Object()

control.verynginx_config = {}

control.init = function(){
    control.get_config();
}

control.get_config = function(){
    $.get("/verynginx/config",function(data,status){
        console.log(status);
        console.log(data);
		control.verynginx_config = data;

        var config_json = JSON.stringify(data, null, 2);
		$("#config_all_show").text(config_json);
    }); 
}

