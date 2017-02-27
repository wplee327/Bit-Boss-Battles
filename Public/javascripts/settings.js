$(document).ready(function() {
    
    parseCookies();
    
    if (getCookie("sound", "") == "true") { $("#sound").prop("checked", true); }
    if (getCookie("trans", "") == "true") { $("#trans").prop("checked", true); }
    if (getCookie("chroma", "") == "true") { $("#chroma").prop("checked", true); }
    if (getCookie("persistent", "") == "true") { $("#persistent").prop("checked", true); }
    if (getCookie("bossheal", "") == "true") { $("#bossheal").prop("checked", true); }
    
    var hpMode = getCookie("hptype", "overkill");
    
    if (hpMode == "progress")
    {
        $("input[type='radio'][name='hp'][value='progress']").click();
        
        $(".subsettings.showing").removeClass("showing").addClass("hidden");
        $("#settings-progress").removeClass("hidden").addClass("showing");

        $("p.showing").removeClass("showing").addClass("hidden");
        $("#expl-progress").removeClass("hidden").addClass("showing");
    }
    else if (hpMode == "constant")
    {
        $("input[type='radio'][name='hp'][value='constant']").click();
        
        $(".subsettings.showing").removeClass("showing").addClass("hidden");
        $("#settings-constant").removeClass("hidden").addClass("showing");

        $("p.showing").removeClass("showing").addClass("hidden");
        $("#expl-constant").removeClass("hidden").addClass("showing");
    }
    
    if (getCookie("hpmult", "") != "") { $("#hp-mult").val(parseInt(getCookie("hpmult", "")) || 1); }
    if (getCookie("hpinit", "") != "") { $("#hp-o-init").val(parseInt(getCookie("hpinit", "")) || 1000); $("#hp-p-init").val($("#hp-o-init").val()); }
    if (getCookie("hpincr", "") != "") { $("#hp-incr").val(parseInt(getCookie("hpincr", "")) || 100); }
    if (getCookie("hpamnt", "") != "") { $("#hp-amnt").val(parseInt(getCookie("hpamnt", "")) || 1000); }
    
    $("#sound").click(function() {
        
        setCookie("sound", $(this).prop("checked").toString());
    });
    
    $("#trans").click(function() {
        
        setCookie("trans", $(this).prop("checked").toString());
    });
    
    $("#chroma").click(function() {
        
        setCookie("chroma", $(this).prop("checked").toString());
    });
    
    $("#persistent").click(function() {
        
        setCookie("persistent", $(this).prop("checked").toString());
    });
    
    $("#bossheal").click(function() {
        
        setCookie("bossheal", $(this).prop("checked").toString());
    });
    
    $("input[type='radio'][name='hp']").change(function() {
        
        setCookie("currentBoss", "");
        setCookie("currentHp", "0");
        setCookie("maxHp", "0");
        
        setCookie("hptype", $(this).val());
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
        
        setCookie("hpmult", $(this).val().toString());
    });
    
    $("#hp-o-init").change(function() {
        
        setCookie("hpinit", $(this).val().toString());
        $("#hp-p-init").val($(this).val());
    });
    
    $("#hp-p-init").change(function() {
        
        setCookie("hpinit", $(this).val().toString());
        $("#hp-o-init").val($(this).val());
    });
    
    $("#hp-incr").change(function() {
        
        setCookie("hpincr", $(this).val().toString());
    });
    
    $("#hp-amnt").change(function() {
        
        setCookie("hpamnt", $(this).val().toString());
    });
});