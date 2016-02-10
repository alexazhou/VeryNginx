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

//add a config
config.config_add = function(name,value){
    config.verynginx_config[name].push(value);
}

//modify a config
//set value = null to delete
config.config_mod = function(name,index,value){
    
    //console.log('-->',name,index,value);
    if( value == null ){
        Vue.delete( config.verynginx_config[name], index );
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
            dashboard.notify("保存配置失败[" + data['err'] + "]");
        }
    });
}

config.test_match_factory = function( type ){

    var match_core = function(){
    
        var target_str = $(this).val();
        var test_container = $(this).closest('.config_test_container'); 
        var rule_table_id = test_container.attr('test_rule_table'); 
        var rule_table = $('#' + rule_table_id); 
        var test_args = eval(test_container.attr('test_args')); 
        var test_output = test_container.find('.config_test_output');
        var test_sub_output = test_container.find('.config_test_sub_output'); 

        var rows = rule_table.find('tbody > tr');
        var matched_count = 0;
    
        test_output.text('');
        test_sub_output.text('');
        for( i=0; i<rows.length; i++ ){
            $( rows[i] ).removeClass('matched');
            
            if( type == 're' ){
                var re_str = $($(rows[i]).children()[test_args[0]]).text();
                var re_obj = new RegExp(re_str, 'igm' );
        
                if( target_str.match(re_obj) != null ){
                    $( rows[i] ).addClass('matched');
                    matched_count += 1;
                }
            }
            
            if( type == 're_replace' ){
                var re_str = $($(rows[i]).children()[test_args[0]]).text();
                var replace_str = $($(rows[i]).children()[test_args[1]]).text();
                var re_obj = new RegExp(re_str, 'igm' );
        
                if( target_str.match(re_obj) != null ){
                    $( rows[i] ).addClass('matched');
                    matched_count += 1;

                    if( test_sub_output.text() == ''){
                        test_sub_output.text( 'will be redirect to: ' + target_str.replace( re_obj, replace_str ) );
                    }
                }
            }

            if( type == 'equal' ){
                var re_str = $($(rows[i]).children()[test_args[0]]).text();
        
                if( target_str == re_str ){
                    $( rows[i] ).addClass('matched');
                    matched_count += 1;
                }
            }

        }
    
        if( target_str == '' && matched_count == 0 ){
            test_output.text('');
        }else{
            test_output.text( matched_count + ' rule matched ');
        }
    };

    return match_core;
}



