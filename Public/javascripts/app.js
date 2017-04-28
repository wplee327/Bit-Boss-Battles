$(document).ready(function () {
	
	// Demo Mode
	var demoMode = false;
	
	// Channel ID
	var userId = "";
	
	// Settings
	var sound = false;
	var hideAvtr = false;

	// Boss vars
	var nextBoss = "nifty255";

	// Timeout and Interval handlers
	var imgRemove = null;
	var frstDelay = null;
	var animDelay = null;
	var shakeStop = null;
	var hitShStop = null;

	// State indicators
	var isDelayed = false;
	var shaking = false;
	var lossShowing = false;
	var refill = false;
	var preload = true;
	
	// Name scroll
	var scrollInterval = 5000;
	var resetInterval = 1000;
	var scrollDelay = null;
	var resetDelay = null;

	// Hit label offset
	var lossOffset = 0;

	// Shake intensity
	var shakeIntensity = 1000;
	
	// HP settings
	var hpType = "overkill";
	var hpMult = 1;
	var hpAmnt = 1000;
	var hpIncr = 100;
	var dontIncr = true;
	var bossHeal = false;
	
	// HP variables
	var prevHp = 0;
	var hp = 0;
	var delayed = 0;
	var loss = 0;
	var overkill = null;
	
	// Subscriber variables
	var includeSubs = false;
	var resubMultiplier = 0.25;
	
	// Streamlabs variables
	var slToken = "";
	var slRefresh = "";
	var lastId = "";
	var startTime = 0;
	var slStarted = false;
	var tipQueue = [];

	// Element containers
	var health = $("#health");
	var hitdelay = $("#hitdelay");
	var counter = $("#hp");
	var avatarimg = $("#avatar");	
	
	// Bits gifs
	
	// 1 bit
	var bits1 = [
		"http://i.imgur.com/axWaf1G.gif",
		"http://i.imgur.com/vrkWxrQ.gif",
		"http://i.imgur.com/T2RFqm3.gif",
		"http://i.imgur.com/bIUYT4E.gif"
	];
	
	// 100 bits
	var bits100 = [
		"http://i.imgur.com/qIGLfo8.gif",
		"http://i.imgur.com/AxTcMpu.gif",
		"http://i.imgur.com/ueYVt9V.gif",
		"http://i.imgur.com/p8Wxr0m.gif"
	];
	
	// 1000 bits
	var bits1000 = [
		"http://i.imgur.com/TQPP9xT.gif",
		"http://i.imgur.com/bvG9kkm.gif",
		"http://i.imgur.com/QRI0GE5.gif",
		"http://i.imgur.com/JpuqYpk.gif"
	];
	
	// 5000 bits
	var bits5000 = [
		"http://i.imgur.com/A6EIUy1.gif",
		"http://i.imgur.com/ddgxLpl.gif",
		"http://i.imgur.com/DBjwiB3.gif",
		"http://i.imgur.com/Btlkt1D.gif"
	];
	
	// 10000 bits
	var bits10000 = [
		"http://i.imgur.com/koNnePN.gif",
		"http://i.imgur.com/0HU0GFx.gif",
		"http://i.imgur.com/f8aQMPt.gif",
		"http://i.imgur.com/LCYgixP.gif"
	];
	
	// Heal
	var heal = "http://i.imgur.com/fOvRfRk.gif";
	
	try
	{
		parseCookies();
		
		var protocol = window.location.href.split(":")[0];
		var host = document.location.href.split("//")[1].split("/")[0];
		var isDev = (host == "localhost:5000" || host == "local.bitbossbattles.io:5000");

		// If the widget is not running from URL parameters, the widget was likely launched from the Launcher Page.
		if (GetUrlParameter("token") == null && GetUrlParameter("userid") == null)
		{
			// Get the OAuth token.
			oauth = getCookie("auth", "");

			// Get the Streamlabs token.
			slRefresh = getCookie("refrsl", "");
			
			// Get subscriber settings.
			includeSubs = (getCookie("includesubs", "") == "true");
			resubMultiplier = parseFloat(getCookie("resubmult", "0.25"));

			// Get the user ID.
			userId = getCookie("userid", "");

			// If the auth token wasn't found, error out.
			if (oauth == "") { $("body").html("<h1 style='color: red;'>ERROR. NO AUTH TOKEN.</h1>"); return; }

			// Get the sound setting.
			sound = (getCookie("sound", "") == "true");
						
			// Set the volume.
			gainNode.gain.value = parseInt(getCookie("volume", "100")) / 100;

			// Determine the background mode.
			if (getCookie("trans", "") == "true") { $(".allcontainer").css("background-color", "rgba(0,0,0,0)"); }
			if (getCookie("chroma", "") == "true") { $(".allcontainer").css("background-color", "#00f"); }

			// Get HP settings.
			hpType = getCookie("hptype", "overkill");
			hpMult = parseInt(getCookie("hpmult", "1"));
			hpAmnt = (hpType != "constant" ? parseInt(getCookie("hpinit", "") || hpAmnt) : parseInt(getCookie("hpamnt", "")) || hpAmnt);
			hpIncr = parseInt(getCookie("hpinit", "100"));

			// Get Boss Heal setting.
			bossHeal = (getCookie("bossheal", "") == "true");

			// Get hidden avatar setting.
			hideAvtr = (getCookie("hideavtr", "") == "true");

			// Apply color settings.
			if (getCookie("trans", "") != "true" && getCookie("chroma", "") != "true") { $("#mainbg").css("background-color", getCookie("colorbg", "#222222")); }
			$("#background").css("background-color", getCookie("colorhb", "red"));
			$("#hitdelay").css("background-color", getCookie("colorhm", "orange"));
			$("#health").css("background-color", getCookie("colorhf", "green"));
			$("#boss").css("color", getCookie("colortx", "white"));
			$("#hp").css("color", getCookie("colortx", "white"));
			$("#attackercontainer").css("color", getCookie("colortx", "white"));

			// If Persistence Mode is off,
			if (getCookie("persistent", "false") != "true")
			{
				// Clear all of the cookies.
				setCookie({ name: "currentBoss", newValue: "" });
				setCookie({ name: "maxHp", newValue: "0" });
				setCookie({ name: "currentHp", newValue: "0" });
			}

			FinishSetup();
		}
		// Else, the widget is running from the URL given on the Launcher Page.
		else
		{
			if (GetUrlParameter("rev") == null) { $("body").html("<h1 style='color: red;'>CRITICAL UPDATE!<br>RE-COPY LINK.</h1>"); return; }

			if (protocol != "https" && !isDev) { $("body").html("<h1 style='color: red;'>NOT HTTPS! RE-COPY LINK.</h1>"); return; }

			$.get("./rev", function(response) {

				if (response.revision > parseInt(GetUrlParameter("rev")) || 0)
				{
					$("body").html("<h1 style='color: red;'>UPDATE! RE-COPY LINK.</h1>");
					return;
				}

				oauth = GetUrlParameter("token");
				userId = GetUrlParameter("userid");

				if (GetUrlParameter("sl") != "")
				{
					slRefresh = getCookie("refrsl", "");
				}

				if (slRefresh == "")
				{
					slRefresh = GetUrlParameter("sl");
				}

				// If the auth token wasn't found, error out.
				if (oauth == null || oauth == "") { $("body").html("<h1 style='color: red;'>ERR. NO AUTH TOKEN.<br>RE-COPY LINK.</h1>"); return; }

				// If the user ID wasn't found, error out.
				if (userId == null || userId == "") { $("body").html("<h1 style='color: red;'>ERR. NO USER ID.<br>RE-COPY LINK.</h1>"); return; }

				// Obtain settings from the server.
				$.get("./settings/" + userId, function(response) {

					if (response.error)
					{
						// Clear all of the cookies.
						setCookie({ name: "currentBoss", newValue: "" });
						setCookie({ name: "maxHp", newValue: "0" });
						setCookie({ name: "currentHp", newValue: "0" });

						FinishSetup();
					}
					else
					{
						// Get subscriber settings.
						includeSubs = response.includeSubs;
						resubMultiplier = response.resubMult;
						
						// Get the sound setting.
						sound = response.sound;
						
						// Set the volume.
						gainNode.gain.value = response.volume / 100;

						// Determine the background mode.
						if (response.trans) { $(".allcontainer").css("background-color", "rgba(0,0,0,0)"); }
						if (response.chroma) { $(".allcontainer").css("background-color", "#00f"); }

						// Get HP settings.
						hpType = response.hpMode;
						hpMult = response.hpMult;
						hpAmnt = (hpType != "constant" ? response.hpInit : response.hpAmnt);
						hpIncr = response.hpIncr;

						// Get Boss Heal setting.
						bossHeal = response.bossHealing;

						// Get hidden avatar setting.
						hideAvtr = response.avtrHidden;

						// Apply color settings.
						if (!response.trans && !response.chroma) { $("#mainbg").css("background-color", response.colorBg); }
						$("#background").css("background-color", response.colorHb);
						$("#hitdelay").css("background-color", response.colorHm);
						$("#health").css("background-color", response.colorHf);
						$("#boss").css("color", response.colorTx);
						$("#hp").css("color", response.colorTx);
						$("#attackercontainer").css("color", response.colorTx);

						// If Persistence Mode is off,
						if (!response.persistence)
						{
							// Clear all of the cookies.
							setCookie({ name: "currentBoss", newValue: "" });
							setCookie({ name: "maxHp", newValue: "0" });
							setCookie({ name: "currentHp", newValue: "0" });
						}

						FinishSetup();
					}
				});
			})
		}
	}
	catch (e)
	{
		var err = e.name+": "+e.message;
		
		$("body").html("<div>Error! Copy this entire page, create a Pastebin, and tweet it @Nifty255.<br>"+err+"<br><p style='padding-left: 10px;'>"+e.stack.substring(err.length+1).replace("<", "&lt;").replace(">", "&gt;").replace(/\n/g, "<br>")+"</p></div>");
	}
	
	function FinishSetup() {
		
		// If the Hidden Avatar setting is true,
		if (hideAvtr)
		{
			// Hide the image container.
			$("#imgcontainer").css("display", "none");

			// Remove the 70px adjustment from the health container.
			$("#infocontainer").css("width", "100%");
		}

		// Assign the maxHp cookie to hpAmnt if it exists.
		var cookieHp = parseInt(getCookie("maxHp", "0"));
		if (cookieHp != 0)
		{
			hpAmnt = cookieHp;
		}

		// Error out the widget if no OAuth token is found.
		if (oauth == "") { $("body").html("<h1 style='color: red;'>ERROR. NO AUTH.</h1>"); return; }

		// Get the current boss and their current HP, if the cookies exist.
		nextBoss = getCookie("currentBoss", "");
		prevHp = Math.min(parseInt(getCookie("currentHp", "0")), hpAmnt);
		
		$.ajax({
			url: "https://api.twitch.tv/kraken/user",
			type: "GET",
			beforeSend: function(xhr)
			{
				xhr.setRequestHeader('Accept', "application/vnd.twitchtv.v5+json");
				xhr.setRequestHeader('Authorization', "OAuth " + oauth);
				xhr.setRequestHeader('Client-ID', twitchClientId);
			},
			success: function(data) {

				if (nextBoss == "") { nextBoss = data.name; setCookie({ name: "currentBoss", newValue: nextBoss }); }

				// Connect to Twitch's PubSub system.
				Connect("wss://pubsub-edge.twitch.tv", function() {

					// Initiate getting the next boss.
					GetNewBoss();

					// Listen for bits events using the streamer's channel ID and OAuth token.
					Listen("channel-bitsevents." + userId, oauth, ProcessBits, function(error) {
						
						$("body").html("<h1 style='color: red;'>ERROR. FAILED BITS LISTEN.</h1><p>" + error + "</p>");
					});
					
					// If the streamer wants to include subscribers, listen for subscriber events using the streamer's channel ID and OAuth token.
					if (includeSubs) { Listen("channel-subscribe-events-v1." + userId, oauth, ProcessSubs); }
				});
				
				$.post("./analytics/" + userId, { lastAccess: new Date().getTime(), partner: data.partnered }, function (res) { if (res == "success") { } });
			},
			error: function(data) {

				$("body").html("<h1 style='color: red;'>ERROR. FAILED STREAMER GET.</h1>");
				console.log("https://api.twitch.tv/kraken/users/" + userId);
			}
		});
		
		// If a refresh token has been provided,
		if (slRefresh != "" && slRefresh != null)
		{
			// Get a new access token.
			GetNewAccessToken();
			
			// Get a new access token every subsequent 50 minutes.
			setInterval(GetNewAccessToken, 1000*60*50);
		}
	}
	
	// PubSub Message Callback. Processes bits events.
	function ProcessBits(message) {
		
		// Validate data integrity.
		if (!message) { return; }
		if (!message.user_name) { return; }
		if (!message.bits_used) { return; }
		if (!message.context) { return; }
		
		// If the nextBoss variable is empty, then no transition is taking place.
		if (nextBoss == "")
		{
			// Get information about the user who cheered.
			GetUserInfo(message.user_name, function(info) {
				
				// Reset the attacker display.
				$("#attackerdisplay").css({
					
					"opacity": "0"
				});
				
				// If the attacker is the current Bit Boss,
				if (info.displayName == $("#name").html())
				{
					// If the Boss Heal setting is on, then heal. If not, do nothing.
					if (bossHeal)
					{
						Heal(message.bits_used, message.user_name, info.displayName);
					}
				}
				// Else, the attacker is not the current Bit Boss.
				else
				{
					// Strike the Bit Boss.
					Strike(message.bits_used, message.user_name, info.displayName);
				}
			});
		}
	}
	
	// PubSub Message Callback. Processes subscriber events.
	function ProcessSubs(message) {
		
		// Validate data integrity.
		if (!message) { return; }
		if (!message.user_name) { return; }
		if (!message.sub_plan) { return; }
		if (!message.months) { return; }
		
		// If the nextBoss variable is empty, then no transition is taking place.
		if (nextBoss == "")
		{
			// Get information about the user who cheered.
			GetUserInfo(message.user_name, function(info) {
				
				// Reset the attacker display.
				$("#attackerdisplay").css({
					
					"opacity": "0"
				});
				
				// Calculate the initial amount of HP to damage or heal by.
				var amount = 0;
				
				if (message.sub_plan == "Prime" || message.sub_plan == "1000")
				{
					amount = 500;
				}
				else if (message.sub_plan == "2000")
				{
					amount = 1000;
				}
				else if (message.sub_plan == "3000")
				{
					amount = 2500;
				}
				else
				{
					return;
				}
				
				// Add additional damage/healing based on the resub multiplier.
				amount += amount * (message.months - 1) * resubMultiplier;
				
				// If the attacker is the current Bit Boss,
				if (info.displayName == $("#name").html())
				{
					// If the Boss Heal setting is on, then heal. If not, do nothing.
					if (bossHeal)
					{
						Heal(amount, message.user_name, info.displayName, "sub");
					}
				}
				// Else, the attacker is not the current Bit Boss.
				else
				{
					// Strike the Bit Boss.
					Strike(amount, message.user_name, info.displayName, "sub");
				}
			});
		}
	}
	
	// Streamlabs Message Callback. Processes donation events.
	function ProcessDonation(donation) {
		
		// If the nextBoss variable is empty, then no transition is taking place.
		if (nextBoss == "")
		{
			// Get information about the user who cheered.
			GetUserInfo(donation.name, function(info) {
				
				// Reset the attacker display.
				$("#attackerdisplay").css({
					
					"opacity": "0"
				});
				
				// If the attacker is the current Bit Boss,
				if (info.displayName == $("#name").html())
				{
					// If the Boss Heal setting is on, then heal. If not, do nothing.
					if (bossHeal)
					{
						Heal(Math.floor(donation.amount * 100), donation.name, info.displayName, "donation");
					}
				}
				// Else, the attacker is not the current Bit Boss.
				else
				{
					// Strike the Bit Boss.
					Strike(Math.floor(donation.amount * 100), donation.name, info.displayName, "donation");
				}
			});
		}
	}
	
	// Heals the Bit Boss by the given amount.
	function Heal(amount, healer, display, type) {
		
		// If the nextBoss variable is empty, then no transition is taking place.
		if (nextBoss == "")
		{
			// Determine the highest bits milestone in the cheer.
			var milestone = "";
			if (amount < 100) { milestone = "1"; }
			else if (amount < 1000) { milestone = "100"; }
			else if (amount < 5000) { milestone = "1000"; }
			else if (amount < 10000) { milestone = "5000"; }
			else { milestone = "10000"; }
			
			// The associated bits gif is the default to use.
			var gif = "https://d3aqoihi2n8ty8.cloudfront.net/actions/cheer/light/animated/" + milestone + "/1.gif?a=" + Math.random();
			
			// Change the gif if the type is a donation or a subscription.
			if (type == "donation") { gif = "./images/dollar.gif"; }
			else if (type == "sub") { gif = "./images/twitch.gif"; }
			
			// Sets the attacker display.
			$("#attackerdisplay").html("<img id='cheerimg' src='" + gif + "'>" + display + " heals!");
			$("#attackerdisplay").stop().animate({ "opacity": "1" }, 1000, "linear", function() { setTimeout(function() { $("#attackerdisplay").css("opacity", "0"); $("#attackerdisplay").html("&nbsp;"); }, 1000) });
			
			// Remove the current strike gif if it exists.
			$("#strikeimg").remove();
			if (imgRemove != null) { clearTimeout(imgRemove); }
			
			// Removes the heal amount from the current loss counter.
			loss -= amount;
			
			// Update the current HP of the boss.
			setCookie({ name: "currentHp", newValue: Math.min(hp - loss, hpAmnt).toString() });
			
			// Reset and start the initial delay.
			isDelayed = true;
			if (animDelay != null) { clearTimeout(animDelay); }
			if (frstDelay != null) { clearTimeout(frstDelay); }
			frstDelay = setTimeout(PerformEffects, 1000);
		}
	}
	
	// Strikes the Bit Boss, damaging them by the given amount.
	function Strike(amount, attacker, display, type) {
		
		// If the nextBoss variable is empty, then no transition is taking place.
		if (nextBoss == "")
		{
			// Determine the highest bits milestone in the cheer.
			var milestone = "";
			if (amount < 100) { milestone = "1"; }
			else if (amount < 1000) { milestone = "100"; }
			else if (amount < 5000) { milestone = "1000"; }
			else if (amount < 10000) { milestone = "5000"; }
			else { milestone = "10000"; }
			
			// The associated bits gif is the default to use.
			var gif = "https://d3aqoihi2n8ty8.cloudfront.net/actions/cheer/light/animated/" + milestone + "/1.gif?a=" + Math.random();
			
			// Change the gif if the type is a donation or a subscription.
			if (type == "donation") { gif = "./images/dollar.gif"; }
			else if (type == "sub") { gif = "./images/twitch.gif"; }
			
			// Sets the attacker display.
			$("#attackerdisplay").html("<img id='cheerimg' src='" + gif + "'>" + display + " attacks!");
			$("#attackerdisplay").stop().animate({ "opacity": "1" }, 1000, "linear", function() { setTimeout(function() { $("#attackerdisplay").css("opacity", "0"); $("#attackerdisplay").html("&nbsp;"); }, 1000) });
			
			// Get a random strike image based on the highest cheer milestone.
			var imgToUse = "";
			if (amount < 100) { imgToUse = bits1[GetRandomInt(0, bits1.length - 1)]; }
			else if (amount < 1000) { imgToUse = bits100[GetRandomInt(0, bits100.length - 1)]; }
			else if (amount < 5000) { imgToUse = bits1000[GetRandomInt(0, bits1000.length - 1)]; }
			else if (amount < 10000) { imgToUse = bits5000[GetRandomInt(0, bits5000.length - 1)]; }
			else { imgToUse = bits10000[GetRandomInt(0, bits10000.length - 1)]; }
			
			// Play a random strike sound if sound is enabled.
			if (sound) { hits[GetRandomInt(0, hits.length - 1)].play(); }
			
			// Remove the current strike gif if it exists and create a new one.
			$("#strikeimg").remove();
			if (imgRemove != null) { clearTimeout(imgRemove); }
			avatarimg.after('<img id="strikeimg" src="' + imgToUse + '?a=' + Math.random() + '"/>');
			imgRemove = setTimeout(function() { $("#strikeimg").remove(); }, 1000);
			
			// Adds the strike amount to the current loss counter.
			loss += amount;
			
			// If the current boss's HP after the loss is zero or less,
			if (hp - loss <= 0)
			{
				prevHp = 0;
				
				// Set the next boss for transition.
				nextBoss = attacker;
				
				// Set the HP counter to show the final blow.
				counter.html("Final Blow: " + display);
				
				// Update the current boss.
				setCookie({ name: "currentBoss", newValue: nextBoss });
				
				// If the current mode is Overkill,
				if (hpType == "overkill")
				{
					// Calculate the overkill amount.
					overkill = Math.max((loss - hp) * hpMult, 100);
					
					// Update the HP cookies based on the overkill amount and the multiplier.
					setCookie({ name: "currentHp", newValue: overkill.toString() });
					setCookie({ name: "maxHp", newValue: overkill.toString() });
				}
				// If the current mode is Overkill Plus,
				else if (hpType == "strength")
				{
					// Calculate the overkill amount.
					overkill = Math.max(amount, 100);
					
					// Update the HP cookies based on the overkill plus amount and the multiplier.
					setCookie({ name: "currentHp", newValue: overkill.toString() });
					setCookie({ name: "maxHp", newValue: overkill.toString() });
				}
				// Else, if the current mode is Progressive,
				else if (hpType == "progress")
				{
					// Update the HP cookies based on the increment setting.
					setCookie({ name: "currentHp", newValue: (hpAmnt + hpIncr).toString() });
					setCookie({ name: "maxHp", newValue: (hpAmnt + hpIncr).toString() });
				}
				// Else, the current mode is Constant.
				else
				{
					// Update the HP cookies based on the default amount.
					setCookie({ name: "currentHp", newValue: hpAmnt.toString() });
					setCookie({ name: "maxHp", newValue: hpAmnt.toString() });
				}
			}
			// Else, the boss will have HP left over after calculation.
			else
			{
				// Update the current HP of the boss.
				setCookie({ name: "currentHp", newValue: (hp - loss).toString() });
			}
			
			// Reset and start the initial delay.
			isDelayed = true;
			if (animDelay != null) { clearTimeout(animDelay); }
			if (frstDelay != null) { clearTimeout(frstDelay); }
			frstDelay = setTimeout(PerformEffects, 1000);
		}
	}
	
	// Performs heal/strike effects after the initial delay.
	// All heals and strikes which occur before the initial delay can finish are grouped together into one PerformEffects run.
	function PerformEffects() {
		
		// Finalize the current HP.
		hp = Math.min(Math.max(0, hp - loss), hpAmnt);
		
		// If the resulting loss after all grouped heals and strikes is zero, no effects need to be performed.
		if (loss == 0) { return; }
		// Else, if the loss is positive, perform damage effects.
		else if (loss > 0)
		{
			// Set the width of the regular (green) health bar to the current health immediately.
			health.css("width", ((hp / hpAmnt) * 100).toString() + "%");
			
			// Play a random hit sound if sound is enabled.
			if (sound) { damage[GetRandomInt(0, damage.length - 1)].play(); }
			
			// Reset and start the hit amount label's animation.
			lossOffset = 20;
			lossShowing = true;
			$("#loss").html("-" + loss.toString());
			$("#loss").css({

				"-webkit-transform": "translateY(" + lossOffset.toString() + "px)",
				"-ms-transform": "translateY(" + lossOffset.toString() + "px)",
				"transform": "translateY(" + lossOffset.toString() + "px)",
				"visibility": "visible"
			});
			
			// Reset the hit amount label's hide delay.
			if (hitShStop != null) { clearTimeout(hitShStop); }
			// Reset the avatar shake effect's stop delay.
			if (shakeStop != null) { clearTimeout(shakeStop); }
			
			// Reset the avatar shake effect.
			shaking = true;
			shakeIntensity = 1000;
			
			// Set the delayed (yellow) health bar animation delay.
			animDelay = setTimeout(function() {

				isDelayed = false;
			}, 1000);
			
			// Set the avatar shake effect's stop delay.
			shakeStop = setTimeout(function() {

				shaking = false;
				avatarimg.css({

					"-webkit-transform": "translate(0px,0px)",
					"-ms-transform": "translate(0px,0px)",
					"transform": "translate(0px,0px)"
				});
			}, 1000);
			
			// Reset the loss counter.
			loss = 0;
		}
		// Else, if the loss is negative, perform heal effects.
		else if (loss < 0)
		{
			// Reset and start the hit amount label's animation.
			lossOffset = 20;
			lossShowing = true;
			$("#loss").html("+" + Math.abs(loss).toString());
			$("#loss").css({

				"-webkit-transform": "translateY(" + lossOffset.toString() + "px)",
				"-ms-transform": "translateY(" + lossOffset.toString() + "px)",
				"transform": "translateY(" + lossOffset.toString() + "px)",
				"visibility": "visible"
			});
			
			// If the delayed HP counter isn't yet caught up,
			if (hp < delayed)
			{
				// Update the regular (green) health bar immediately, instead of letting the delayed animation do it later.
				health.css("width", ((hp / hpAmnt) * 100).toString() + "%");
			}
			
			// Create the heal gif.
			avatarimg.after('<img id="strikeimg" src="' + heal + '?a=' + Math.random() + '"/>');
			imgRemove = setTimeout(function() { $("#strikeimg").remove(); }, 1000);
			
			// Reset the hit amount label's hide delay.
			if (hitShStop != null) { clearTimeout(hitShStop); }
			// Reset the avatar shake effect's stop delay.
			if (shakeStop != null) { clearTimeout(shakeStop); }
			
			// Reset the avatar shake effect.
			shaking = false;
			avatarimg.css({

				"-webkit-transform": "translate(0px,0px)",
				"-ms-transform": "translate(0px,0px)",
				"transform": "translate(0px,0px)"
			});
			
			// Set the delayed (yellow) health bar animation delay.
			animDelay = setTimeout(function() {

				isDelayed = false;
			}, 1000);
			
			// Reset the loss counter.
			loss = 0;
		}
	}
	
	// Performs a single shake step.
	function Shake() {
		
		// Reduce the intensity.
		shakeIntensity  = Math.max(0, shakeIntensity - 16);
		
		// Calculate this step's new offset.
		var x = Math.floor((Math.random() - 0.5) * 7) * (shakeIntensity / 1000);
		var y = Math.floor((Math.random() - 0.5) * 7) * (shakeIntensity / 1000);
		
		// Apply the new offset.
		avatarimg.css({

			"-webkit-transform": "translate(" + x.toString() + "px," + y.toString() + "px)",
			"-ms-transform": "translate(" + x.toString() + "px," + y.toString() + "px)",
			"transform": "translate(" + x.toString() + "px," + y.toString() + "px)"
		});
	}
	
	// Creates the explosion effect on the current boss's avatar, and begins the boss transition chain.
	function Explode() {
		
		// Sets the preload state to true, to prevent certain animations.
		preload = true;
		
		// Plays the explosion sound if sound is enabled.
		if (sound) { explosions[0].play(); }
		
		// Create the explosion gif.
		avatarimg.after('<img id="explodeimg" src="http://i.imgur.com/m9Ajapt.gif?a='+Math.random()+'"/>');
		
		// Fade out the current boss's avatar. When finished, remove the explosion gif and get the next boss.
		avatarimg.animate({opacity: 0}, 1000, "linear", function() {
			
			$("#explodeimg").remove();
			GetNewBoss();
		});
	}
	
	// Gets the next boss.
	function GetNewBoss() {
		
		// Ensure that a boss is in line to get.
		if (nextBoss == "") { return; }
		
		// Get the next boss's info.
		GetUserInfo(nextBoss, function(info) {
			
			// Set the next boss's avatar image, or set as default if they don't have one.
			avatarimg.attr("src", (info.logo == null ? "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png" : info.logo));
			// Once the new avatar is loaded, begin the remaining transition steps.
			avatarimg.on('load', function() {
				
				// If the widget is in Overkill Mode and the overkill value is set to a number,
				if (hpType == "overkill" && overkill != null)
				{
					// Set the new HP amount based on the overkill with multiplier.
					hpAmnt = overkill;
				}
				// Else, if the widget is in Progressive Mode,
				else if (hpType == "progress")
				{
					// Increment the new HP amount based on the increment setting.
					hpAmnt = hpAmnt + (dontIncr ? 0 : hpIncr);
					dontIncr = false;
				}
				
				// Set the name and test labels to the new boss's display name.
				$("#name").html(info.displayName);
				$("#test").html(info.displayName);
				
				// Reset the name scroll animation.
				$("#name").stop().css("margin-left", "0px");
				if (scrollDelay != null) { clearTimeout(scrollDelay); }
				if (resetDelay != null) { clearTimeout(resetDelay); }
				scrollDelay = null;
				resetDelay = null;
				
				// Transition from preload state to refill state.
				refill = true;
				preload = false;
				
				// Hide the delayed (yellow) health bar.
				hitdelay.css({
					"visibility": "hidden"
				});
				
				// Begin the avatar fade in.
				avatarimg.css("opacity", "0");
				avatarimg.animate({ opacity: 1 }, 1000, "linear");
				avatarimg.off('load');
			});
		});
	}
	
	// Gets user information from Twitch using the given username, and then fires the given callback.
	function GetUserInfo(username, callback) {
		
		// Ensure both a username and a callback were provided.
		if (username == "") { return; }
		if (!callback) { return; }
		
		// Obtain the user information from Twitch.
		$.ajax({
			url: "https://api.twitch.tv/kraken/users/" + username + "?client_id=" + twitchClientId,
			type: "GET",
			beforeSend: function(xhr)
			{
				xhr.setRequestHeader('Accept', "application/vnd.twitchtv.v3+json");
			},
			success: function(data) {

				callback({ displayName: data.display_name, logo: data.logo });
			},
			error: function(data) {

				// If the error is due to an unknown username,
				if ((data.responseJSON.status == 404 && data.responseJSON.message == "User \"" + username + "\" was not found") ||
					(data.responseJSON.status == 422 && data.responseJSON.message == "User \"" + username + "\" is unavailable"))
				{
					callback({ displayName: username, logo: null });
				}
				// Else, error out.
				else
				{
					// Log the error and response.
					console.log("Error: " + data.responseJSON.error + ". " + data.responseJSON.message);
					$("body").html("<h1 style='color: red;'>ERROR. FAILED USER GET.</h1>");
				}
			}
		});
	}
	
	// Gets a new access token for Streamlabs.
	function GetNewAccessToken() {
		
		// Post the request.
		$.post("./slauth", { slToken: slRefresh, refresh: "true" }, function(res) {
			
			// If there was no error,
			if (!res.error)
			{
				// Assign the new tokens.
				slToken = res.token;
				slRefresh = res.refresh;
				
				// Store the refresh token in cookies.
				setCookie({ name: "refrsl", newValue: res.refresh });
				
				// If the donation fetch timer isn't yet started,
				if (!slStarted)
				{
					// Set the flag to true.
					slStarted = true;
					
					// Set the start time to now.
					startTime = new Date().getTime();
					
					// Create the donations fetch interval for 15 seconds.
					setInterval(GetLatestDonations, 15000);
					
					// Create the donations queue interval for 1 second.
					setInterval(DequeueDonation, 1000);
				}
			}
		});
	}
	
	// Gets the last 10 donations after the current ID, if it is set.
	function GetLatestDonations() {
		
		// Request the last 10 donations, supplying a last ID if it is set.
		$.get("https://streamlabs.com/api/v1.0/donations?access_token="+slToken+"&verified=1&limit=10&currency=USD"+(lastId != "" ? "&after="+lastId : ""), function(res) {
			
			var i = 0;
			
			var lastIndex = res.data.length - 1;
			
			if (lastId == "")
			{
				for (i = 0; i < res.data.length; i++)
				{
					var created = parseInt(res.data[i].created_at);
					
					if (created > startTime)
					{
						lastIndex = i - 1;
					}
				}
			}
			else
			{
				lastIndex = -1;
			}
			
			if (res.data.length > 0) { lastId = res.data[0].donation_id; }
			
			for (i = res.data.length - 1; i > lastIndex; i--)
			{
				tipQueue.push({ name: res.data[i].name.toLowerCase(), amount: parseFloat(res.data[i].amount) });
			}
		});
	}
	
	// Dequeues a donation and feeds it into the bits system.
	function DequeueDonation() {
		
		// If the queue isn't empty,
		if (tipQueue.length > 0)
		{
			var donation = tipQueue[0];
			tipQueue.splice(0, 1);

			ProcessDonation(donation);
		}
	}
	
	// Gets a random integer between the min (inclusive) and max (inclusive).
	function GetRandomInt(min, max) {

		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	// Gets a parameter from the URL.
	function GetUrlParameter(sParam) {
		
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? null : sParameterName[1];
			}
		}
	}
	
	// Animation loop
	setInterval(function() {
		
		// If the refill state is enabled.
		if (refill)
		{
			if (prevHp == 0) { hp = Math.min(hpAmnt, hp + (hpAmnt / 60)); }
			else { hp = Math.min(prevHp, hp + (prevHp / 60)); }
			delayed = hp;
			counter.html("HP: " + Math.floor(delayed).toLocaleString("en-US") + " / " + hpAmnt.toLocaleString("en-US"));
			health.css("width", ((hp / hpAmnt) * 100).toString() + "%");

			if (hp == (prevHp == 0 ? hpAmnt : prevHp))
			{
				refill = false;
				nextBoss = "";
				hitdelay.css({
					"width": ((hp / hpAmnt) * 100).toString() + "%",
					"visibility": "visible"
				});
			}
		}
		
		// If neither the refill and preload states are enabled, and the delay is not active.
		if (!isDelayed && !refill && !preload)
		{
			// If the delayed HP is greater than the immediate HP,
			if (delayed > hp)
			{
				// Decrement the delayed HP, at a rate of 20% of the max health per second.
				delayed = Math.max(delayed - ((hpAmnt / 5) / 60), hp);
				
				// If there is no next boss lined up (meaning there is no "last blow" text), update the counter text with the delayed HP count.
				if (nextBoss == "") { counter.html("HP: " + Math.floor(delayed).toLocaleString("en-US") + " / " + hpAmnt.toLocaleString("en-US")); }
				
				// Update the delayed (yellow) health bar with the new delayed HP amount.
				hitdelay.css("width", ((delayed / hpAmnt) * 100).toString() + "%");
				
				// If the delayed HP is now zero,
				if (delayed == 0)
				{
					// The current boss has been defeated. Initiate the boss transntion with an explosion.
					Explode();
				}
			}
			// Else, if the delayed HP is less than the immediate HP,
			// (This happens when the boss is healed while no delay decrement animation is taking place.)
			else if (delayed < hp)
			{
				// Increment the delayed HP amount, counter, health (green) bar, and delay (yellow) bar at a rate of 20% of the max health per second.
				delayed = Math.min(delayed + ((hpAmnt / 5) / 60), hp);
				counter.html("HP: " + Math.floor(delayed).toLocaleString("en-US") + " / " + hpAmnt.toLocaleString("en-US"));
				health.css("width", ((delayed / hpAmnt) * 100).toString() + "%");
				hitdelay.css("width", ((delayed / hpAmnt) * 100).toString() + "%");
			}
		}
		
		// If the avatar state is shaking,
		if (shaking)
		{
			// Perform a shake step.
			Shake();
		}
		
		// If the hit amount label's offset is greater than zero,
		if (lossOffset > 0)
		{
			// Decrement the label's offset at a rate of 20 pixels per second.
			lossOffset = Math.max(0, lossOffset - (20 / (1000/60)));
			
			// Apply the new loss offset.
			$("#loss").css({

				"-webkit-transform": "translateY(" + lossOffset.toString() + "px)",
				"-ms-transform": "translateY(" + lossOffset.toString() + "px)",
				"transform": "translateY(" + lossOffset.toString() + "px)"
			});
		}
		// Else, if the label is still showing,
		else if (lossShowing)
		{
			// Set the hide delay to half a second.
			lossShowing = false;
			hitShStop = setTimeout(function() {
				
				// After the delay, hide the label.
				$("#loss").css("visibility", "hidden");
			}, 500);
		}
		
		// Name Scroll
		
		// Get the width of the current name, and the width of the scollable area.
		var nameWidth = $("#test").width();
		var scrollWidth = $("#scroll").width();
		
		// If the name is longer than the scrollable area,
		if (nameWidth > scrollWidth)
		{
			// If the scroll delay is disabled,
			if (scrollDelay == null)
			{
				// Set a new scroll delay.
				scrollDelay = setTimeout(function() {
					
					// After the delay, set the delay tracker to something other than null until later.
					scrollDelay = -1;
					
					// Animate the scroll. When finished scrolling, perform additional action.
					$("#name").stop().animate({"marginLeft": "-" + (nameWidth - scrollWidth).toString() + "px"}, 1000, "linear", function() {
						
						// Set a new reset delay.
						resetDelay = setTimeout(function() {
							
							// After the delay, reset the scroll to zero and disable the scroll delay to restart the cycle.
							$("#name").css("margin-left", "0px");
							scrollDelay = null;
						}, resetInterval);
					});
				}, scrollInterval);
			}
		}
	}, (1000/60));
	
//	Fake("topic", ProcessBits);
//	
//	$("#fake").click(function() {
//		InterpretMessage({ data: '{"type":"MESSAGE","data":{"topic":"topic","message":"{\\"user_name\\":\\"mrseniorfloofypants\\",\\"bits_used\\":20,\\"context\\":\\"cheer\\"}"}}' });
//	});
});