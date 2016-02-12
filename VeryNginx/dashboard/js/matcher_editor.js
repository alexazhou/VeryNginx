var matcher_editor = new Object();

matcher_editor.tmp_conditions_vm = null;
matcher_editor.tmp_conditions = { };

matcher_editor.init = function(){
    
    matcher_editor.tmp_conditions_vm = new Vue({
        el: '#verynginx_matcher_editor',
        data: {
            conditions:matcher_editor.tmp_conditions
        },
    });
}

matcher_editor.matcher_name = function(){
    return $('#config_matcher_editor_name').val();
}

matcher_editor.clean = function(){
    $('#config_matcher_editor_name').val('');

    matcher_editor.tmp_conditions = {};
    matcher_editor.tmp_conditions_vm.$data = {conditions:matcher_editor.tmp_conditions};
}

matcher_editor.tmp_conditions_delete = function( key ){
    Vue.delete( matcher_editor.tmp_conditions, key );
}

matcher_editor.modal_condition_open = function(){
    $('#config_modal_condition').modal('show');
    matcher_editor.modal_condition_switch_input();
}

matcher_editor.modal_condition_switch_input = function(){
    var condition_type = $("#config_modal_condition [name=condition_type]").val();
    //At first show the inputer belongs the type
    $(".config_matcher_value_contain").hide();
    $(".config_matcher_value_contain[matcher_type=" + condition_type +"]").show();
    //clean the text
    $(".condition_value").val('');
    //make the modal in the center
    dashboard.modal_reposition.call( $("#config_modal_condition")[0] );
}

matcher_editor.modal_condition_save =function(){
    var condition_type = $("#config_modal_condition [name=condition_type]").val();
    var condition_value = $(".config_matcher_value_contain[matcher_type=" + condition_type +"] [name=condition_value]").val();

    console.log("Add matcher condition:", condition_type, condition_value);

    Vue.set(matcher_editor.tmp_conditions, condition_type, condition_value);
    $('#config_modal_condition').modal('hide');
}




