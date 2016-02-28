var form = new Object();


form.get_data = function( form_id ){
    var data = {}
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
                data[name] = item.val();
            }

        }else if( item.prop('tagName').toLowerCase() == "select" ){
            data[ name ] = item.val();
        }
    }

    //console.log('output data:',data);
    return data;
}

form.set_data = function( form_id, data ){
    console.log('form.set_data:',form_id,data);
    
    var inputs = $('#'+form_id).find("input,checkbox,select");
    for( var i=0; i < inputs.length; i++ ){
        var item = $(inputs[i]);
        var name = item.attr('name');
        console.log('process item',item)
        if( item.prop('tagName').toLowerCase() == "input" ){
            if( item.attr('type') == "checkbox" ){
                var config_group = item.attr('config_group');
                if( config_group != null && data[config_group] != null ){

                    if( name in data[config_group] ){
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
             console.log('flag 2')
             item.val( data[ item.attr('name') ] );
        }
    }
}

