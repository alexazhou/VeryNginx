var upstream_editor = new Object();

upstream_editor.tmp_node_vm = null;
//upstream_editor.tmp_node = [];

upstream_editor.tmp_node = {};

upstream_editor.init = function(){
    
    upstream_editor.tmp_node_vm = new Vue({
        el: '#config_proxy_upstream_editor_node',
        data: {
            node:upstream_editor.tmp_node
        },
    });
}

upstream_editor.tmp_node_delete = function( btn ){
    
    //console.log('tmp_conditions_delete:',btn);
    var key = $(btn).parent().children('.config_matcher_block_type').text();
    //console.log('key:',key);

    Vue.delete( upstream_editor.tmp_node, key );
}

upstream_editor.get_data = function(){
    var data = {};
    data['name'] = $('#config_upstream_form [name=name]').val();
    data['method'] = $('#config_upstream_form [name=method]').val();
    data['node'] = upstream_editor.tmp_node;

    return data;
}

upstream_editor.set_data = function( data ){
    $('#config_upstream_form [name=name]').val( data['name'] );
    $('#config_upstream_form [name=method]').val( data['method'] );
    upstream_editor.tmp_node = data['node'];
    upstream_editor.tmp_node_vm.$data = {node:upstream_editor.tmp_node};
}

upstream_editor.modal_node_open = function(){
    $('#config_modal_node').modal('show');
}

upstream_editor.modal_node_save = function(){
    var data = vnform.get_data('config_modal_node_form');
    console.log( data );
    var node_name = data['name'];
    delete data['name'];

    //verify
    var err_msg = vnform.verify_form( "config_modal_node_form" ); 
    if( err_msg != null ){
        dashboard.show_notice('warning', err_msg );
        return;
    }

    Vue.set(upstream_editor.tmp_node, node_name, data);
    $('#config_modal_node').modal('hide');
    upstream_editor.clean_modal();
}

upstream_editor.reset = function(){

    console.log('upstream_editor.reset');
    $('#config_upstream_form [name=name]').val('');
    $('#config_upstream_form [name=method]').val('random');
    
    upstream_editor.tmp_node = {};
    upstream_editor.tmp_node_vm.$data = {node:upstream_editor.tmp_node};
}

upstream_editor.clean_modal = function(){
    $('#config_modal_node input').val('');
}
