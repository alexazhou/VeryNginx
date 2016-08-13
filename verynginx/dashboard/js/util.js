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

util.reset_input_area = function( selector ){
  //reset inpu
  $( selector ).find('input[type="text"]').each(function(){
      $(this).val("");
  });
  
  //reset select
  $( selector ).find('select').each(function(){
      $(this).prop('selectedIndex', 0);
  });
};
