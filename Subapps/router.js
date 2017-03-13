var express = require('express');
var router = express.Router();
var dbModule = require('./database');

var User = dbModule.User;

router.get('/index.html', function(req, res) {
	
	res.redirect('/');
});

router.get('/', function(req, res) {
	
	res.render('index');
});

router.get('/launcher', function(req, res) {
	
	res.render('launcher', { revision: parseInt(process.env.REVISION) || 1 });
});

router.get('/settings', function(req, res) {
	
	res.render('settings');
});

router.get('/about', function(req, res) {
	
	res.render('about');
});

router.get('/rev', function(req, res) {
	
	res.json({ revision: process.env.REVISION || 1 });
});

router.get('/settings/*', function(req, res) {
    
    var args = req.path.substring(1).split('/');
    
    var id = args[args.length - 1];
    
    User.findOne({ userid: id }, function(err, found) {
        
        if (err) { res.json({ error: "Database Error" }); return; }
        if (found == null) { res.json({ error: "ID Not Found" }); return; }
        
        var settings = {
            sound: found.settings.sound,
            trans: found.settings.trans,
            chroma: found.settings.chroma,
            persistence: found.settings.persistence,
            bossHealing: found.settings.bossHealing,
            avtrHidden: found.settings.avtrHidden,
            hpMode: found.settings.hpMode,
            hpInit: found.settings.hpInit,
            hpMult: found.settings.hpMult,
            hpIncr: found.settings.hpIncr,
            hpAmnt: found.settings.hpAmnt
        };
        
        res.json(settings);
    });
});

router.post('/settings/*', function(req, res) {
    
    var args = req.path.substring(1).split('/');
    
    var id = args[args.length - 1];
    
    if (isNaN(id) || id.length != 8) { res.send("Invalid ID"); return; }
    
    User.findOne({ userid: id }, function(err, found) {
        
        if (err) { res.status(500).send("Database Error"); return; }
        
        var saidUser = found;
        
        var settings = {
            sound: false,
            trans: false,
            chroma: false,
            persistence: false,
            bossHealing: false,
            avtrHidden: false,
            hpMode: "overkill",
            hpInit: 1000,
            hpMult: 1,
            hpIncr: 100,
            hpAmnt: 1000
        };
        
        if (typeof req.body.sound == "boolean") { settings.sound = req.body.sound; }
        if (typeof req.body.trans == "boolean") { settings.trans = req.body.trans; }
        if (typeof req.body.chroma == "boolean") { settings.chroma = req.body.chroma; }
        if (typeof req.body.persistence == "boolean") { settings.persistence = req.body.persistence; }
        if (typeof req.body.bossHealing == "boolean") { settings.bossHealing = req.body.bossHealing; }
        if (typeof req.body.avtrHidden == "boolean") { settings.avtrHidden = req.body.avtrHidden; }
        
        if (typeof req.body.hpMode == "string")
        {
            if (req.body.hpMode == "overkill" || req.body.hpMode == "progress" || req.body.hpMode == "constant") { settings.hpMode = req.body.hpMode; }
        }
        
        if (typeof req.body.hpInit == "number") { settings.hpInit = req.body.hpInit; }
        if (typeof req.body.hpMult == "number") { settings.hpMult = req.body.hpMult; }
        if (typeof req.body.hpIncr == "number") { settings.hpIncr = req.body.hpIncr; }
        if (typeof req.body.hpAmnt == "number") { settings.hpAmnt = req.body.hpAmnt; }
        
        if (saidUser == null)
        {
            saidUser = new User({ userid: id, settings: settings });
        }
        else if (req.body.overwrite)
        {
            saidUser.settings = settings;
        }
        
        saidUser.save(function(err) {
            
            if (err) { res.status(500).send("Database Error"); }
            else { res.send("success"); }
        });
    });
});

module.exports = {
	
	router: router
};