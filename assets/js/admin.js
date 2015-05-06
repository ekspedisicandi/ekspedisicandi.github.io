$(function(){
  var $button = $('#toggle'),
      $loader = $('.loader'),
      cssClass = 'light';
  
  $button.click(function(e){
    e.preventDefault();

    $loader.toggleClass(cssClass);
  });
});