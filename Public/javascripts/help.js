$(document).ready(function() {
	
	var boss = "";
	var max = 1000;
	var cur = 1000;
	
	$(".topic").click(function() {
		
		$(".answer.act").removeClass("act");
		$(this).parent().children(".answer").addClass("act");
	})
	
	$("#boss-name").change(function() {
		
		boss = $(this).val();
		UpdateLink();
	});
	
	$("#hp-max").change(function() {
		
		max = $(this).val();
		UpdateLink();
	});
	
	$("#hp-cur").change(function() {
		
		cur = $(this).val();
		UpdateLink();
	});
	
	function UpdateLink() {
		
		if (boss == "") { $("#link").html('<span style="color: red;">Boss not set. Enter an exact username to set the boss.</span>'); }
		else if (max == 0 || cur == 0) { $("#link").html('<span style="color: red;">Can\'t have zero health! Set a non-zero health.</span>'); }
		else if (max < cur) { $("#link").html('<span style="color: red;">Can\'t have less max health than current health.</span>'); }
		else { $("#link").html("http://www.bitbossbattles.io/setboss.html?boss=" + boss.toLowerCase() + "&max=" + max.toString() + "&cur=" + cur.toString()); }
	}
});