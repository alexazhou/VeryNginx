var util = new Object();

util.html_encode = function( value ){
  return $('<div/>').text(value).html();
}

util.html_decode = function( value ){
  return $('<div/>').html(value).text();
}

