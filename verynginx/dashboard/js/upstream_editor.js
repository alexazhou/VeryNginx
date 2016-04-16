var upstream_editor = new Object();

upstream_editor.tmp_node_vm = null;
//upstream_editor.tmp_node = [];

upstream_editor.tmp_node = [];

upstream_editor.init = function(){
    
    upstream_editor.tmp_node_vm = new Vue({
        el: '#config_proxy_upstream_editor_node',
        data: {
            node:upstream_editor.tmp_node
        },
    });
}

upstream_editor.tmp_conditions_delete = function( btn ){
    
    //console.log('tmp_conditions_delete:',btn);
    var key = $(btn).parent().children('.config_matcher_block_type').text();
    //console.log('key:',key);

    Vue.delete( upstream_editor.tmp_node, key );
}

upstream_editor.modal_node_open = function(){
    $('#config_modal_node').modal('show');
}

upstream_editor.modal_node_save = function(){
    var data = form.get_data('config_modal_node_form');
    console.log( data );
    var node_name = data['name'];
    delete data['name'];
    
    //verify
    //todo

    upstream_editor.tmp_node.$set( node_name, data );
    $('#config_modal_node').modal('hide');
    upstream_editor.clean_modal(); 
}

upstream_editor.clear =function(){
      
}

upstream_editor.clean_modal = function(){
    $('#config_modal_node input').val('');
}

