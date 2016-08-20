var vnform = new Object();

vnform.clean_all_err_mark = function(){
    $(".vn-has-error").removeClass('vn-has-error');
}

vnform.add_err_mark = function( item ){
    item.addClass("vn-has-error"); 
}

vnform.verify_input_with_notice = function( input_item ){
    vnform.clean_all_err_mark();
    var err_msg = vnform.verify_input( input_item );

    if( err_msg != null )
        dashboard.show_notice('warning',err_msg);
}

vnform.verify_input = function( input_item ){
    var item = $( input_item );
    var verifyer_str = item.attr('vn_data_verify')
    
    if( verifyer_str == undefined ){
        return null;
    }
    
    if( item.attr('type') == "checkbox" ){
        return null;
    }

    var verifyer = eval( verifyer_str );
    var value = item.val();

    var err_msg = verifyer( value );
    
    if( err_msg != null  ){
        vnform.add_err_mark( item );
        return err_msg;
    }

    return null;
}

vnform.verify_form = function( form_id ){
   console.log('verify form:',form_id);
   vnform.clean_all_err_mark();
   
   var inputs = $('#' + form_id).find("input,select,textarea");
   for( var i=0; i < inputs.length; i++ ){
        var err_msg = vnform.verify_input( inputs[i] );
        
        if( err_msg != null )
            return err_msg;
   }

   return null;
}

vnform.get_data = function( form_id ){
    
    var data = {}
    var form_obj = $('#'+form_id);
    var form_data_getter = form_obj.attr('vn_data_getter');
    if( form_data_getter != null ){
        data = eval( form_data_getter )( );
        return data;
    }

    var inputs = $('#' + form_id).find("input:visible,select:visible,textarea:visible");

    for( var i=0; i < inputs.length; i++ ){
        var item = $(inputs[i]);
        var name = item.attr('name');
        var tagName = item.prop('tagName').toLowerCase();
        if( tagName == "input" || tagName == 'textarea' ){

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
    
    var inputs = $('#'+form_id).find("input,textarea,select");
    for( var i=0; i < inputs.length; i++ ){
        var item = $(inputs[i]);
        var name = item.attr('name');
        var tagName = item.prop('tagName').toLowerCase();
        //console.log('process item',item)
        //console.log('name',name)
        if( tagName == "input" || tagName == 'textarea' ){
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
    util.sync_vue_model( '#' + form_id );
}

vnform.reset = function(form_id){
    var form_obj = $('#'+form_id);
    var form_data_resetter = form_obj.attr('vn_data_resetter');
    if( form_data_resetter != null ){
         eval( form_data_resetter )();
         return;   
    }
    util.reset_input_area( '#' + form_id );    
}

