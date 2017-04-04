var hits = [
	new Audio("./sound/hit1.ogg"),
	new Audio("./sound/hit2.ogg"),
	new Audio("./sound/hit3.ogg"),
	new Audio("./sound/hit4.ogg"),
	new Audio("./sound/hit5.ogg"),
	new Audio("./sound/hit6.ogg")
];

var damage = [
	new Audio("./sound/damage1.ogg"),
	new Audio("./sound/damage2.ogg"),
	new Audio("./sound/damage3.ogg")
];

var explosions = [
	new Audio("./sound/explosion1.ogg")
];

var audioCtx = null;
var gainNode = null;

$(document).ready(function() {
	
	var i = 0;
	
	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	
	gainNode = audioCtx.createGain();
	
	for (i = 0; i < hits.length; i++)
	{
		var src = audioCtx.createMediaElementSource(hits[i]);
		src.connect(gainNode);
	}
	
	for (i = 0; i < damage.length; i++)
	{
		var src = audioCtx.createMediaElementSource(damage[i]);
		src.connect(gainNode);
	}
	
	for (i = 0; i < explosions.length; i++)
	{
		var src = audioCtx.createMediaElementSource(explosions[i]);
		src.connect(gainNode);
	}
	
	gainNode.connect(audioCtx.destination);
});