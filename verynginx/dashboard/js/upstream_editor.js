var upstream_editor = new Object();

upstream_editor.tmp_node_vm = null;
//upstream_editor.tmp_node = [];

upstream_editor.tmp_node = [{name: "node1", ip: "0.0.0.1", weight: "1"}, {name: "node2", ip: "192.168.1.2", weight: "0"}];

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

    //verify
    //todo

    upstream_editor.tmp_node.push( data );
    $('#config_modal_node').modal('hide');
    upstream_editor.clean_modal(); 
}

upstream_editor.clear =function(){
      
}

upstream_editor.clean_modal = function(){
    $('#config_modal_node input').val('');
}

