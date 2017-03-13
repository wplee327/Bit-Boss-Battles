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
        
        if (err) { res.status(500).json({ error: "Database Error" }); return; }
        if (found == null) { res.status(404).json({ error: "ID Not Found" }); return; }
        
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
    
    User.findOne({ userid: id }, function(err, found) {
        
        if (err) { res.status(500).send("Database Error"); return; }
        
        var saidUser = found;
        
        var settings = {
            sound: req.body.sound,
            trans: req.body.trans,
            chroma: req.body.chroma,
            persistence: req.body.persistence,
            bossHealing: req.body.bossHealing,
            avtrHidden: req.body.avtrHidden,
            hpMode: req.body.hpMode,
            hpInit: req.body.hpInit,
            hpMult: req.body.hpMult,
            hpIncr: req.body.hpIncr,
            hpAmnt: req.body.hpAmnt
        };
        
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