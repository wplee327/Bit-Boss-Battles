$(document).ready(function() {
    
    var saving = false;
    var waiting = false;
    
    var reset = null;
    
    parseCookies();
    
    var settings = {
        overwrite: true,
        sound: (getCookie("sound", "") == "true"),
        trans: (getCookie("trans", "") == "true"),
        chroma: (getCookie("chroma", "") == "true"),
        persistence: (getCookie("persistent", "") == "true"),
        bossHealing: (getCookie("bossheal", "") == "true"),
        avtrHidden: (getCookie("hideavtr", "") == "true"),
        hpMode: getCookie("hptype", "overkill"),
        hpInit: parseInt(getCookie("hpinit", "1000")),
        hpMult: parseInt(getCookie("hpmult", "1")),
        hpIncr: parseInt(getCookie("hpincr", "100")),
        hpAmnt: parseInt(getCookie("hpamnt", "1000"))
    };
    
    if (settings.sound) { $("#sound").prop("checked", true); }
    if (settings.trans) { $("#trans").prop("checked", true); }
    if (settings.chroma) { $("#chroma").prop("checked", true); }
    if (settings.persistence) { $("#persistent").prop("checked", true); }
    if (settings.bossHealing) { $("#bossheal").prop("checked", true); }
    if (settings.avtrHidden) { $("#hideavtr").prop("checked", true); }
    
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
    
    $("#sound").click(function() {
        
        settings.sound = $(this).prop("checked");
        setCookie("sound", settings.sound.toString());
        SendChanges();
    });
    
    $("#trans").click(function() {
        
        settings.trans = $(this).prop("checked");
        setCookie("trans", settings.trans.toString());
        SendChanges();
    });
    
    $("#chroma").click(function() {
        
        settings.chroma = $(this).prop("checked");
        setCookie("chroma", settings.chroma.toString());
        SendChanges();
    });
    
    $("#persistent").click(function() {
        
        settings.persistence = $(this).prop("checked");
        setCookie("persistent", settings.persistence.toString());
        SendChanges();
    });
    
    $("#bossheal").click(function() {
        
        settings.bossHealing = $(this).prop("checked");
        setCookie("bossheal", settings.bossHealing.toString());
        SendChanges();
    });
    
    $("#hideavtr").click(function() {
        
        settings.avtrHidden = $(this).prop("checked");
        setCookie("hideavtr", settings.avtrHidden.toString());
        SendChanges();
    });
    
    $("input[type='radio'][name='hp']").change(function() {
        
        setCookie("currentBoss", "");
        setCookie("currentHp", "0");
        setCookie("maxHp", "0");
        
        settings.hpMode = $(this).val();
        setCookie("hptype", settings.hpMode);
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
        setCookie("hpmult", settings.hpMult.toString());
        SendChanges();
    });
    
    $("#hp-o-init").change(function() {
        
        settings.hpInit = $(this).val();
        setCookie("hpinit", settings.hpInit.toString());
        $("#hp-p-init").val(settings.hpInit);
        SendChanges();
    });
    
    $("#hp-p-init").change(function() {
        
        settings.hpInit = $(this).val();
        setCookie("hpinit", settings.hpInit.toString());
        $("#hp-o-init").val(settings.hpInit);
        SendChanges();
    });
    
    $("#hp-incr").change(function() {
        
        settings.hpIncr = $(this).val();
        setCookie("hpincr", settings.hpIncr.toString());
        SendChanges();
    });
    
    $("#hp-amnt").change(function() {
        
        settings.hpAmnt = $(this).val();
        setCookie("hpamnt", settings.hpAmnt.toString());
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
                    $('#status').html("Error saving!");
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