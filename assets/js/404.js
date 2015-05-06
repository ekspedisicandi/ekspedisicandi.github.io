$(function(e){
	var x=document.documentElement.clientHeight;
	var y=e(".header").outerHeight();
	e("#parallax_wrapper").css("height",x-y+"px");
	e("#parallax_wrapper").css("left",50+"%");
	e(".scene_1").plaxify({"xRange":0,"yRange":0,"invert":true}),
	e(".scene_2").plaxify({"xRange":70,"yRange":30,"invert":false}),
	e(".scene_3").plaxify({"xRange":30,"yRange":10,"invert":true}),
	e.plax.enable();
	e(document).ready(function(){});
});
