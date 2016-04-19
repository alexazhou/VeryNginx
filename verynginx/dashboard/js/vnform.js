var vnform = new Object();


vnform.get_data = function( form_id ){
    
    var data = {}
    var form_obj = $('#'+form_id);
    var form_data_getter = form_obj.attr('vn_data_getter');
    if( form_data_getter != null ){
        data = eval( form_data_getter )( );
        return data;
    }

    var inputs = $('#' + form_id).find("input,checkbox,select");

    for( var i=0; i < inputs.length; i++ ){
        var item = $(inputs[i]);
        var name = item.attr('name');
        if( item.prop('tagName').toLowerCase() == "input"  ){

            if( item.attr('type') == "checkbox" ){
                var config_group = item.attr('config_group');
                if( config_group != null ){
                    if( data[config_group] == null ){
                        data[config_group] = [];
                    }

                    if( item.prop( "checked" ) ){
                        data[config_group].push( name );
                    }
                }else{
                    if( item.prop( "checked" )){
                        data[name] = true;
                    }else{
                        data[name] = false;
                    }
                }
            }else{
                var getter = item.attr['vn_data_getter'];
                var val = null;
                if( getter != null){
                    val = eval( getter )();
                }else{
                    val = item.val();
                }
                data[name] = val;
            }

        }else if( item.prop('tagName').toLowerCase() == "select" ){
            data[ name ] = item.val();
        }
    }

    //console.log('output data:',data);
    return data;
}

vnform.set_data = function( form_id, data ){

    var form_obj = $('#'+form_id);
    var form_data_setter = form_obj.attr('vn_data_setter');
    if( form_data_setter != null ){
        eval( form_data_setter )( data );
        return;
    }
    
    var inputs = $('#'+form_id).find("input,checkbox,select");
    for( var i=0; i < inputs.length; i++ ){
        var item = $(inputs[i]);
        var name = item.attr('name');
        //console.log('process item',item)
        //console.log('name',name)
        if( item.prop('tagName').toLowerCase() == "input" ){
            if( item.attr('type') == "checkbox" ){
                var config_group = item.attr('config_group');
                if( config_group != null && data[config_group] != null ){
                    if(  data[config_group].indexOf( name ) >= 0 ){
                        item.prop('checked',true);
                    }else{
                        item.prop('checked',false);
                    }
                }else{
                    if( data[name] == true ){
                        item.prop('checked',true);
                    }else{
                        item.prop('checked',false);
                    }
                }
            }else{
                item.val( data[name] );
            }

        }else if( item.prop('tagName').toLowerCase() == "select" ){
             item.val( data[ item.attr('name') ] );
        }
    }
}

vnform.reset = function(form_id){
    var form_obj = $('#'+form_id);
    var form_data_resetter = form_obj.attr('vn_data_resetter');
    if( form_data_resetter != null ){
         eval( form_data_resetter )();
         return;   
    }
    form_obj[0].reset();
}

