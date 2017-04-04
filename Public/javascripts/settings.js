$(document).ready(function() {
	
	var saving = false;
	var waiting = false;
	
	var reset = null;
	
	parseCookies();
	
	var settings = {
		overwrite: true,
		sound: (getCookie("sound", "") == "true"),
		volume: parseInt(getCookie("volume", "100")),
		trans: (getCookie("trans", "") == "true"),
		chroma: (getCookie("chroma", "") == "true"),
		persistence: (getCookie("persistent", "") == "true"),
		bossHealing: (getCookie("bossheal", "") == "true"),
		avtrHidden: (getCookie("hideavtr", "") == "true"),
		hpMode: getCookie("hptype", "overkill"),
		hpInit: parseInt(getCookie("hpinit", "1000")),
		hpMult: parseInt(getCookie("hpmult", "1")),
		hpIncr: parseInt(getCookie("hpincr", "100")),
		hpAmnt: parseInt(getCookie("hpamnt", "1000")),
		colorBg: getCookie("colorbg", "rgba(34, 34, 34, 1)"),
		colorHb: getCookie("colorhb", "rgba(255, 0, 0, 1)"),
		colorHm: getCookie("colorhm", "rgba(255, 165, 0, 1)"),
		colorHf: getCookie("colorhf", "rgba(0, 128, 0, 1)"),
		colorTx: getCookie("colortx", "rgba(255, 255, 255, 1)")
	};
	
	if (settings.sound) { $("#sound").prop("checked", true); }
	if (settings.trans) { $("#trans").prop("checked", true); }
	if (settings.chroma) { $("#chroma").prop("checked", true); }
	if (settings.persistence) { $("#persistent").prop("checked", true); }
	if (settings.bossHealing) { $("#bossheal").prop("checked", true); }
	if (settings.avtrHidden) { $("#hideavtr").prop("checked", true); }
	
	$("#vol-label").html("Volume: " + settings.volume.toString() + "%");
	$("#volume").val(settings.volume);
	$(".volume").css("display", (settings.sound ? "inherit" : "none"));
	
	if (settings.hpMode == "progress")
	{
		$("input[type='radio'][name='hp'][value='progress']").click();
		
		$(".subsettings.showing").removeClass("showing").addClass("hidden");
		$("#settings-progress").removeClass("hidden").addClass("showing");

		$("p.showing").removeClass("showing").addClass("hidden");
		$("#expl-progress").removeClass("hidden").addClass("showing");
	}
	else if (settings.hpMode == "constant")
	{
		$("input[type='radio'][name='hp'][value='constant']").click();
		
		$(".subsettings.showing").removeClass("showing").addClass("hidden");
		$("#settings-constant").removeClass("hidden").addClass("showing");

		$("p.showing").removeClass("showing").addClass("hidden");
		$("#expl-constant").removeClass("hidden").addClass("showing");
	}
	
	if (settings.hpMult != 1) { $("#hp-mult").val(settings.hpMult); }
	if (settings.hpInit != 1000) { $("#hp-o-init").val(settings.hpInit); $("#hp-p-init").val($("#hp-o-init").val()); }
	if (settings.hpIncr != 100) { $("#hp-incr").val(settings.hpIncr); }
	if (settings.hpAmnt != 1000) { $("#hp-amnt").val(settings.hpAmnt); }
	
	$("#color-bg").spectrum({
		
		color: settings.colorBg,
		preferredFormat: "rgb",
		showAlpha: true,
		showInput: true,
		change: function(color) {
			
			settings.colorBg = color.toRgbString()
			setCookie({ name: "colorbg", newValue: settings.colorBg });
			SendChanges();
		}
	});
	$("#color-hb").spectrum({
		
		color: settings.colorHb,
		preferredFormat: "rgb",
		showAlpha: true,
		showInput: true,
		change: function(color) {
			
			settings.colorHb = color.toRgbString()
			setCookie({ name: "colorhb", newValue: settings.colorHb });
			SendChanges();
		}
	});
	$("#color-hm").spectrum({
		
		color: settings.colorHm,
		preferredFormat: "rgb",
		showAlpha: true,
		showInput: true,
		change: function(color) {
			
			settings.colorHm = color.toRgbString()
			setCookie({ name: "colorhm", newValue: settings.colorHm });
			SendChanges();
		}
	});
	$("#color-hf").spectrum({
		
		color: settings.colorHf,
		preferredFormat: "rgb",
		showAlpha: true,
		showInput: true,
		change: function(color) {
			
			settings.colorHf = color.toRgbString()
			setCookie({ name: "colorhf", newValue: settings.colorHf });
			SendChanges();
		}
	});
	$("#color-tx").spectrum({
		
		color: settings.colorTx,
		preferredFormat: "rgb",
		showAlpha: true,
		showInput: true,
		change: function(color) {
			
			settings.colorTx = color.toRgbString()
			setCookie({ name: "colortx", newValue: settings.colorTx });
			SendChanges();
		}
	});
	
	$("#colorreset").click(function() {
		
		settings.colorBg = "rgba(34, 34, 34, 1)";
		settings.colorHb = "rgba(255, 0, 0, 1)";
		settings.colorHm = "rgba(255, 165, 0, 1)";
		settings.colorHf = "rgba(0, 128, 0, 1)";
		settings.colorTx = "rgba(255, 255, 255, 1)";
		
		$("#color-bg").spectrum("set", settings.colorBg);
		$("#color-hb").spectrum("set", settings.colorHb);
		$("#color-hm").spectrum("set", settings.colorHm);
		$("#color-hf").spectrum("set", settings.colorHf);
		$("#color-tx").spectrum("set", settings.colorTx);
		
		setCookie({ name: "colorbg", newValue: settings.colorBg });
		setCookie({ name: "colorhb", newValue: settings.colorHb });
		setCookie({ name: "colorhm", newValue: settings.colorHm });
		setCookie({ name: "colorhf", newValue: settings.colorHf });
		setCookie({ name: "colortx", newValue: settings.colorTx });
		
		SendChanges();
	});
	
	$("#sound").click(function() {
		
		settings.sound = $(this).prop("checked");
		setCookie({ name: "sound", newValue: settings.sound.toString() });
		SendChanges();
		
		$(".volume").css("display", (settings.sound ? "inherit" : "none"));
	});
	
	$("#trans").click(function() {
		
		settings.trans = $(this).prop("checked");
		setCookie({ name: "trans", newValue: settings.trans.toString() });
		SendChanges();
	});
	
	$("#chroma").click(function() {
		
		settings.chroma = $(this).prop("checked");
		setCookie({ name: "chroma", newValue: settings.chroma.toString() });
		SendChanges();
	});
	
	$("#persistent").click(function() {
		
		settings.persistence = $(this).prop("checked");
		setCookie({ name: "persistent", newValue: settings.persistence.toString() });
		SendChanges();
	});
	
	$("#bossheal").click(function() {
		
		settings.bossHealing = $(this).prop("checked");
		setCookie({ name: "bossheal", newValue: settings.bossHealing.toString() });
		SendChanges();
	});
	
	$("#hideavtr").click(function() {
		
		settings.avtrHidden = $(this).prop("checked");
		setCookie({ name: "hideavtr", newValue: settings.avtrHidden.toString() });
		SendChanges();
	});
	
	$("#volume").on("input", function() {
		
		settings.volume = $(this).val();
		$("#vol-label").html("Volume: " + settings.volume.toString() + "%");
	});
	
	$("#volume").change(function() {
		
		setCookie({ name: "volume", newValue: settings.volume.toString() });
		SendChanges();
	});
	
	$("input[type='radio'][name='hp']").change(function() {
		
		setCookie({ name: "currentBoss", newValue: "" });
		setCookie({ name: "currentHp", newValue: "0" });
		setCookie({ name: "maxHp", newValue: "0" });
		
		settings.hpMode = $(this).val();
		setCookie({ name: "hptype", newValue: settings.hpMode });
		SendChanges();
		
		if ($(this).val() == "overkill")
		{
			$(".subsettings.showing").removeClass("showing").addClass("hidden");
			$("#settings-overkill").removeClass("hidden").addClass("showing");
			
			$("p.showing").removeClass("showing").addClass("hidden");
			$("#expl-overkill").removeClass("hidden").addClass("showing");
		}
		else if ($(this).val() == "progress")
		{
			$(".subsettings.showing").removeClass("showing").addClass("hidden");
			$("#settings-progress").removeClass("hidden").addClass("showing");
			
			$("p.showing").removeClass("showing").addClass("hidden");
			$("#expl-progress").removeClass("hidden").addClass("showing");
		}
		else if ($(this).val() == "constant")
		{
			$(".subsettings.showing").removeClass("showing").addClass("hidden");
			$("#settings-constant").removeClass("hidden").addClass("showing");
			
			$("p.showing").removeClass("showing").addClass("hidden");
			$("#expl-constant").removeClass("hidden").addClass("showing");
		}
	});
	
	$("#hp-mult").change(function() {
		
		settings.hpMult = $(this).val();
		setCookie({ name: "hpmult", newValue: settings.hpMult.toString() });
		SendChanges();
	});
	
	$("#hp-o-init").change(function() {
		
		settings.hpInit = $(this).val();
		setCookie({ name: "hpinit", newValue: settings.hpInit.toString() });
		$("#hp-p-init").val(settings.hpInit);
		SendChanges();
	});
	
	$("#hp-p-init").change(function() {
		
		settings.hpInit = $(this).val();
		setCookie({ name: "hpinit", newValue: settings.hpInit.toString() });
		$("#hp-o-init").val(settings.hpInit);
		SendChanges();
	});
	
	$("#hp-incr").change(function() {
		
		settings.hpIncr = $(this).val();
		setCookie({ name: "hpincr", newValue: settings.hpIncr.toString() });
		SendChanges();
	});
	
	$("#hp-amnt").change(function() {
		
		settings.hpAmnt = $(this).val();
		setCookie({ name: "hpamnt", newValue: settings.hpAmnt.toString() });
		SendChanges();
	});
	
	function SendChanges() {
		
		var userId = getCookie("userid", "");
		
		if (userId != "")
		{
			if (saving) { waiting = true; return; }

			saving = true;

			if (reset != null) { clearTimeout(reset); reset = null; }
			
			$('#status').css("background-color", "#ffffff");
			$('#status').html("Saving changes...");

			$.post("/settings/" + userId, settings, function (res) {

				saving = false;

				if (res == "success")
				{
					$('#status').css("background-color", "#7fff7f");
					$('#status').html("Changes saved!");
				}
				else
				{
					$('#status').css("background-color", "#ff7f7f");
					$('#status').html("Error saving: " + res);
				}

				reset = setTimeout(function() {

					$('#status').css("background-color", "#ffffff");
					$('#status').html("Your changes will be saved automatically.");
					reset = null;
				}, 1000);
			});
		}
	}
	
	setInterval(function() {
		
		if (!saving && waiting)
		{
			waiting = false;
			SendChanges();
		}
	}, 500);
});