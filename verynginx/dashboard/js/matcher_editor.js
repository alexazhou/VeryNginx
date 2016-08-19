var matcher_editor = new Object();

matcher_editor.input_group_vm = null;
matcher_editor.tmp_conditions_vm = null;
matcher_editor.tmp_conditions = { };
matcher_editor.form_meta = {
    'Header':[
        {
            'group_name':'Name of header want to test',
            'input':[
                {
                    'title':'operator',
                    'name':'name_operator',
                    'type':"select",
                    'options':{
                        'Equal [=]':"=",
                        'Not Equal [!=]':"!=",
                        'Match RegEx [≈]':"≈",
                        'Not Matche RegEx [!≈]':"!≈",
                        'Any [*]':"*",
                    }
                },
                {
                    'title':'value',
                    'name':'name_value',
                    'type':'input',
                    'placeholder':'',
                }
            ]
        },
        {
            'group_name':'value of header',
            'input':[
                {
                    'title':'operator',
                    'name':'operator',
                    'type':"select",
                    'options':{
                        'Match RegEx [≈]':"≈",
                        'Not Matche RegEx [!≈]':"!≈",
                        'Equal [=]':"=",
                        'Not Equal [!=]':"!=",
                        'Existed':"Exist",
                        'Not Existed':"!Exist",
                    }
                },
                {
                    'title':'value',
                    'name':'operator',
                    'name':'value',
                    'type':'input',
                    'placeholder':'',
                }
            ]
        }
    ],
    'URI':[
        {
            'group_name':'Value of URI',
            'input':[
                {   
                    'title':'operator',
                    'name':'operator',
                    'type':"select",
                    'options':{
                        'Match RegEx [≈]':"≈",
                        'Not Matche RegEx [!≈]':"!≈",
                        'Equal [=]':"=",
                        'Not Equal [!=]':"!=",
                    }

                },
                {
                    'title':'value',
                    'name':'value',
                    'type':'input',
                },
            ]
        }
    ],
    'Host':[
        {
            'group_name':'Value of Host',
            'input':[
                {   
                    'title':'operator',
                    'name':'operator',
                    'type':"select",
                    'options':{
                        'Match RegEx [≈]':"≈",
                        'Not Matche RegEx [!≈]':"!≈",
                        'Equal [=]':"=",
                        'Not Equal [!=]':"!=",
                    }
                },
                {
                    'title':'value',
                    'name':'value',
                    'type':'input',
                },
            ]
        }
    ],
    'UserAgent':[
        {
            'group_name':'value of UserAgent',
            'input':[
                {   
                    'title':'operator',
                    'name':'operator',
                    'type':"select",
                    'options':{
                        'Match RegEx [≈]':"≈",
                        'Not Matche RegEx [!≈]':"!≈",
                        'Equal [=]':"=",
                        'Not Equal [!=]':"!=",
                        'Existed':"Exist",
                        'Not Existed':"!Exist",
                    }
                },
                {
                    'title':'value',
                    'name':'value',
                    'type':'input',
                    'placeholder':'',
                },
            ]
        }
    ],
    'Referer':[
        {
            'group_name':'value of Referer',
            'input':[
                {   
                    'title':'operator',
                    'name':'operator',
                    'type':"select",
                    'options':{
                        'Match RegEx [≈]':"≈",
                        'Not Matche RegEx [!≈]':"!≈",
                        'Equal [=]':"=",
                        'Not Equal [!=]':"!=",
                        'Existed':"Exist",
                        'Not Existed':"!Exist",
                    }
                },
                {
                    'title':'value',
                    'name':'value',
                    'type':'input',
                    'placeholder':'',
                },
            ]
        }
    ],
    'IP':[
        {
            'group_name':'Value of client IP',
            'input':[
                {   
                    'name':'operator',
                    'type':"select",
                    'options':{
                        'Equal [=]':"=",
                        'Not Equal [!=]':"!=",
                    }
                },
                {
                    'title':'value',
                    'name':'value',
                    'type':'input',
                },
            ]
        }
    ],
    'Method':[
        {
            'group_name':'Value of request method',
            'input':[
                {   
                    'name':'operator',
                    'type':"select",
                    'options':{
                        'Equal [=]':"=",
                        'Not Equal [!=]':"!=",
                    }
                },
                {   
                    'name':'value',
                    'type':"select",
                    'options':{
                        'GET':"GET",
                        'POST':"POST",
                        'PUT':"PUT",
                        'DELETE':"DELETE",
                        'HEAD':"HEAD",
                        'OPTIONS':"OPTIONS",
                        'MKCOL':"MKCOL",
                        'COPY':"COPY",
                        'MOVE':"MOVE",
                        'PROPFIND':"PROPFIND",
                        'PROPPATCH':"PROPPATCH",
                        'LOCK':"LOCK",
                        'UNLOCK':"UNLOCK",
                        'PATCH':"PATCH",
                        'TRACE':"TRACE",
                    }
                },
            ]
        }
    ],
    'Args':[
        {
            'group_name':'Name of argument want to test',
            'input':[
                {
                    'title':'operator',
                    'name':'name_operator',
                    'type':"select",
                    'options':{
                        'Equal [=]':"=",
                        'Not Equal [!=]':"!=",
                        'Match RegEx [≈]':"≈",
                        'Not Matche RegEx [!≈]':"!≈",
                        'Any [*]':"*",
                    }
                },
                {
                    'title':'value',
                    'name':'name_value',
                    'type':'input',
                    'placeholder':'',
                }
            ]
        },
        {
            'group_name':'value of argument',
            'input':[
                {
                    'title':'operator',
                    'name':'operator',
                    'type':"select",
                    'options':{
                        'Match RegEx [≈]':"≈",
                        'Not Matche RegEx [!≈]':"!≈",
                        'Equal [=]':"=",
                        'Not Equal [!=]':"!=",
                        'Existed':"Exist",
                        'Not Existed':"!Exist",
                    }
                },
                {
                    'title':'value',
                    'name':'operator',
                    'name':'value',
                    'type':'input',
                    'placeholder':'',
                }
            ]
        }
    ],
    'Cookie':[
         {
            'group_name':'Name of cookie want to test',
            'input':[
                {
                    'title':'operator',
                    'name':'name_operator',
                    'type':"select",
                    'options':{
                        'Equal [=]':"=",
                        'Not Equal [!=]':"!=",
                        'Match RegEx [≈]':"≈",
                        'Not Matche RegEx [!≈]':"!≈",
                        'Any [*]':"*",
                    }
                },
                {
                    'title':'value',
                    'name':'name_value',
                    'type':'input',
                    'placeholder':'',
                }
            ]
        },
        {
            'group_name':'value of cookie',
            'input':[
                {
                    'title':'operator',
                    'name':'operator',
                    'type':"select",
                    'options':{
                        'Match RegEx [≈]':"≈",
                        'Not Matche RegEx [!≈]':"!≈",
                        'Equal [=]':"=",
                        'Not Equal [!=]':"!=",
                        'Existed':"Exist",
                        'Not Existed':"!Exist",
                    }
                },
                {
                    'title':'value',
                    'name':'operator',
                    'name':'value',
                    'type':'input',
                    'placeholder':'',
                }
            ]
        }
    ],
};



matcher_editor.init = function(){
    
    matcher_editor.tmp_conditions_vm = new Vue({
        el: '#verynginx_matcher_editor',
        data: {
            conditions:matcher_editor.tmp_conditions
        },
    });

    matcher_editor.input_group_vm = new Vue({
        el: '#config_modal_condition',
        data: { 
            input_meta: matcher_editor.form_meta
        },
    });
}


matcher_editor.get_data = function(){
    var data = util.clone( matcher_editor.tmp_conditions ); 
    var name = $('#config_matcher_editor_name').val()
    data['name'] = $.trim(name);
    return data;
}

matcher_editor.set_data = function( data ){
    $('#config_matcher_editor_name').val( data['name'] ) ;
    delete data['name'];
    matcher_editor.tmp_conditions = data;
    matcher_editor.tmp_conditions_vm.$data = {conditions:matcher_editor.tmp_conditions};
}

matcher_editor.reset = function(){
    $('#config_matcher_editor_name').val('');
    matcher_editor.tmp_conditions = {};
    matcher_editor.tmp_conditions_vm.$data = {conditions:matcher_editor.tmp_conditions};
}

matcher_editor.tmp_conditions_delete = function( btn ){
    
    //console.log('tmp_conditions_delete:',btn);
    var key = $(btn).parent().children('.config_matcher_block_type').text();
    //console.log('key:',key);

    Vue.delete( matcher_editor.tmp_conditions, key );
}

matcher_editor.modal_condition_open = function(){
    $('#config_modal_condition').modal('show');
    
    util.reset_input_area('#config_modal_condition');
    matcher_editor.update_display();
}

//update which input item need dispaly/hide 
matcher_editor.update_display = function(){
    console.log('hahaha:update_display');
    
    //step1: only show target condition's inputer
    var condition_type = $("#config_modal_condition [name=condition_type]").val();
    $('.config_matcher_conditon_container').hide(); 
    $('.config_matcher_conditon_container[condition_type=' + condition_type + ']').show();

    //step2: only show input item which been needed
    var input_group_list = $('#config_modal_condition .input_group_container:visible');
    for( var i=0; i < input_group_list.length; i++ ){
        var input_group = $(input_group_list[i]);
        var input_item_list = input_group.find(".input_item");
        
        input_item_list.show();
        var operator_val = $(input_item_list[0]).find( 'select.config_matcher_editor_value' ).val();
        console.log('operator_val:',operator_val);
        
        if( operator_val == '*' || operator_val == 'Exist' || operator_val == '!Exist'  ){
            $(input_item_list[1]).hide();          
        }
    }    
    Vue.nextTick( function(){
         dashboard.modal_reposition.call( $("#config_modal_condition")[0] );
    });
}

matcher_editor.get_input_data = function(){
    
}

matcher_editor.modal_condition_save = function(){
    var condition_type = $("#config_modal_condition [name=condition_type]").val();
    
    if( matcher_editor.tmp_conditions[condition_type] != null ){
        dashboard.show_notice('warning','Condition [' + condition_type + '] already existed');
        return;
    }
    
    var inputer_list = $('#config_modal_matcher_input_group .config_matcher_editor_value:visible');
    var condition_value = {};
    for( var i=0; i < inputer_list.length; i++ ){
        var inputer = inputer_list[i];
        var name = $(inputer).attr('name');
        var value = $(inputer).val();
        condition_value[name] = value;
    }

    Vue.set(matcher_editor.tmp_conditions, condition_type, condition_value);
    $('#config_modal_condition').modal('hide');
}



