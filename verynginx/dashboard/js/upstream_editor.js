var upstream_editor = new Object();

upstream_editor.input_group_vm = null;
upstream_editor.tmp_conditions_vm = null;
upstream_editor.tmp_conditions = { };

upstream_editor.init = function(){
    
    upstream_editor.tmp_conditions_vm = new Vue({
        el: '#verynginx_upstream_editor',
        data: {
            conditions:upstream_editor.tmp_conditions
        },
    });

}

upstream_editor.tmp_conditions_delete = function( btn ){
    
    //console.log('tmp_conditions_delete:',btn);
    var key = $(btn).parent().children('.config_matcher_block_type').text();
    //console.log('key:',key);

    Vue.delete( upstream_editor.tmp_conditions, key );
}


