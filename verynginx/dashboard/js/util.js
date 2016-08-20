var util = new Object();

util.html_encode = function( value ){
  return $('<div/>').text(value).html();
}

util.html_decode = function( value ){
  return $('<div/>').html(value).text();
}

util.clone = function( data ){
    return JSON.parse( JSON.stringify( data ) );
}

util.sync_vue_model = function( selector ){
    $( selector ).find( 'input,textarea,select' ).each( function(){
        util.dispatchEvent( this,'change')
    });
}

util.reset_input_area = function( selector ){
  //reset inpu
  $( selector ).find('input[type="text"],textarea').each(function(){
      $(this).val("");
  });
  
  $( selector ).find('input[type="checkbox"]').each(function(){
      this.checked = false;
  });

  //reset select
  $( selector ).find('select').each(function(){
      $(this).prop('selectedIndex', 0);
  });

  util.sync_vue_model( selector );
};

util.dispatchEvent = function( element, event_name ){
    if ("createEvent" in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent( event_name , false, true);
        element.dispatchEvent(evt);
    }else{
        element.fireEvent( "on" + event_name);
    }
}

util.mark_ajax_slince = function( request ){
    request.slince = true;
}

