var config = new Object();

Vue.config.debug = true;
config.config_vm = null; 
config.verynginx_config = {};

//the reusable matcher condition template
config.vue_component_condition = Vue.extend({
    props : ['matcher_conditions','del_action'],
    template: '<template v-for="(condition_name,condition_value) in matcher_conditions | orderBy \'v\'">\
                   <div class="config_matcher_block">\
                       <span class="glyphicon glyphicon-remove config_matcher_block_btn_delete" v-if="(del_action != null)" onclick="{{del_action}}"></span>\
                       <span class="config_matcher_block_type">{{condition_name}}</span>\
                       <span class="config_matcher_block_name"> {{condition_value.name}}</span>\
                       <span class="config_matcher_block_operator"> {{condition_value.operator | show_operator}}</span>\
                       <span class="config_matcher_block_value" >{{condition_value.value}}</span>\
                   </div>\
               </template>'

});

Vue.component('condition', config.vue_component_condition )

Vue.filter('show_operator', function (operator) {
    
    if( operator == '!'){
        return ' is Null'
    }

    return operator;
})

config.get_config = function(){
    $.get("/verynginx/config",function(data,status){
        config.verynginx_config = data;
            
        if( config.config_vm != null ){
            config.config_vm.$data = config.verynginx_config;
            dashboard.notify("Reread config success");
            return;
        }

        config.config_vm = new Vue({
            el: '#verynginx_config',
            data: config.verynginx_config,
            computed : {
                all_config_json: function(){
                    return JSON.stringify( config.verynginx_config , null, 2);
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
        if( typeof index == 'string' ){
            Vue.delete( config.verynginx_config[name], index );
        }else{
            config.verynginx_config[name].splice( index, 1 );
        }
    }else{
        //config.verynginx_config[name].$set( index, config.verynginx_config[name][index] );
    }
}

config.config_move_up = function(name,index){
    
    if(index == 0){
        dashboard.notify("The item already at the firsh");
        return;
    }

    var tmp = config.verynginx_config[name][index-1];
    config.verynginx_config[name].$set(index-1, config.verynginx_config[name][index]);
    config.verynginx_config[name].$set(index, tmp);
}

config.config_move_down = function(name,index){
    if(index >= config.verynginx_config[name].length - 1){
        dashboard.notify("The item already at the bottom");
        return;
    }
    
    var tmp = config.verynginx_config[name][index+1];
    config.verynginx_config[name].$set(index+1, config.verynginx_config[name][index]);
    config.verynginx_config[name].$set(index, tmp);
}

//for matcher only
config.config_matcher_delete_condition = function( matcher_name, condition_name ){
    Vue.delete( config.verynginx_config['matcher'][matcher_name], condition_name  );
}

//add the content of matcher editor to global config
config.config_matcher_add = function(){
    var matcher_name = matcher_editor.matcher_name();

    if( matcher_name == '' ){
        dashboard.notify('Name of the matcher mush not be empty');
        return;
    }

    if( config.verynginx_config['matcher'][matcher_name] != null ){
        dashboard.notify('Matcher [' + matcher_name + '] already existed');
        return;
    }

    Vue.set( config.verynginx_config['matcher'], matcher_name ,matcher_editor.tmp_conditions );

    matcher_editor.clean();
}

config.save_config = function(){
    console.log("save_config");
    var config_json = JSON.stringify( config.verynginx_config , null, 2);

    //step 1, use encodeURIComponent to escape special char 
    var config_json_escaped = window.encodeURIComponent( config_json );
    //step 2, use base64 to encode data to avoid be blocked by verynginx args filter
    var config_json_escaped_base64 = window.btoa( config_json_escaped );

    $.post("/verynginx/config",{ config:config_json_escaped_base64 },function(data){
        console.log(data);
        if( data['ret'] == 'success' ){
            dashboard.notify("save config success");
        }else{
            dashboard.notify("save config failed[" + data['err'] + "]");
        }
    });
}

config.get_form_data = function( form ){
    var data = {}
    var inputs = $(form).find("input,checkbox,select");

    for( var i=0; i < inputs.length; i++ ){
        var item = $(inputs[i]);
        if( item.prop('tagName').toLowerCase() == "input" && item.attr('type') == "checkbox" ){

            var config_group = item.attr('config_group');
            if( config_group != null ){
                if( data[config_group] == null ){
                    data[config_group] = [];
                }

                if( item.prop( "checked" ) ){
                    data[config_group].push( item.attr('name') );
                }
            }else{
                if( item.prop( "checked" )){
                    data[item.attr('name')] = true;
                }else{
                    data[item.attr('name')] = false;
                }
            }

        }else if( item.prop('tagName').toLowerCase() == "select" ){
            data[ item.attr('name') ] = item.val();
        }
    }

    //console.log('output data:',data);
    return data;
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



