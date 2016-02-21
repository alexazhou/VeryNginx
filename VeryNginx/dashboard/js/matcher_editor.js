var matcher_editor = new Object();

matcher_editor.input_group_vm = null;
matcher_editor.tmp_conditions_vm = null;
matcher_editor.tmp_conditions = { };
matcher_editor.condition_input_meta = {
    'Args':[
        {
            'name':'name',
            'type':'input',
            'placeholder':"A RegEx to specify target arg, or leave it blank to test all args"
        },
        {   
            'name':'operator',
            'type':"select",
            'options':{
                'Match RegEx':"≈",
                'Not Matche RegEx':"!≈",
                'Equal':"=",
                'Not Equal':"!=",
            }
        },
        {
            'name':'value',
            'type':'textarea',
            'placeholder':'if operator is "is Null", this field will be ignored',
        }
    ],
    'URI':[
        {   
            'name':'operator',
            'type':"select",
            'options':{
                'Match RegEx':"≈",
                'Not Matche RegEx':"!≈",
                'Equal':"=",
                'Not Equal':"!=",
            }

        },
        {
            'name':'value',
            'type':'input',
        },
    ],
    'Host':[
        {   
            'name':'operator',
            'type':"select",
            'options':{
                'Match RegEx':"≈",
                'Not Matche RegEx':"!≈",
                'Equal':"=",
                'Not Equal':"!=",
            }
        },
        {
            'name':'value',
            'type':'input',
        },
    ],
    'UserAgent':[
        {   
            'name':'operator',
            'type':"select",
            'options':{
                'Match RegEx':"≈",
                'Not Matche RegEx':"!≈",
                'Equal':"=",
                'Not Equal':"!=",
                'is Null':"!",
            }
        },
        {
            'name':'value',
            'type':'input',
            'placeholder':'if operator is "is Null", this field will be ignored',
        },
    ],
    'Referer':[
        {   
            'name':'operator',
            'type':"select",
            'options':{
                'Match RegEx':"≈",
                'Not Matche RegEx':"!≈",
                'Equal':"=",
                'Not Equal':"!=",
                'is Null':"!",
            }
        },
        {
            'name':'value',
            'type':'input',
            'placeholder':'if operator is "is Null", this field will be ignored',
        },
    ],
    'IP':[
        {   
            'name':'operator',
            'type':"select",
            'options':{
                'Equal':"=",
                'Not Equal':"!=",
            }
        },
        {
            'name':'value',
            'type':'input',
        },
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
        el: '#config_modal_matcher_input_group',
        data: { input_meta:[] },
    });
}

matcher_editor.matcher_name = function(){
    var name = $('#config_matcher_editor_name').val()
    return $.trim(name);    
}

matcher_editor.clean = function(){
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
    matcher_editor.modal_condition_switch_input();
}

matcher_editor.modal_condition_switch_input = function(){
    var condition_type = $("#config_modal_condition [name=condition_type]").val();
    
    //console.log('condition_type',condition_type);

    matcher_editor.input_group_vm.$data = { 'input_meta': matcher_editor.condition_input_meta[condition_type] } ;
    $(".condition_value").val('');
    
    //make the modal in the center
    Vue.nextTick( function(){
         dashboard.modal_reposition.call( $("#config_modal_condition")[0] );
    });
}

matcher_editor.modal_condition_save = function(){
    var condition_type = $("#config_modal_condition [name=condition_type]").val();
    
    if( matcher_editor.tmp_conditions[condition_type] != null ){
        dashboard.notify('Condition [' + condition_type + '] already existed');
        return;
    }
    
    var inputer_list = $('#config_modal_matcher_input_group .config_matcher_editor_value');
    var condition_value = {};
    
    for( var i=0; i < inputer_list.length; i++ ){
        var inputer = inputer_list[i];
        var name = $(inputer).attr('name');
        var value = $(inputer).val();
        condition_value[name] = value;
    }

    //when operator = "is null", value will be ignored
    if( condition_value['operator'] == '!' ){
        delete condition_value['value'];
    }

    //console.log("Add matcher condition:", condition_type, condition_value);
    Vue.set(matcher_editor.tmp_conditions, condition_type, condition_value);
    $('#config_modal_condition').modal('hide');
}



