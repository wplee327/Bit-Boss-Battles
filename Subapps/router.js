var express = require('express');
var router = express.Router();
var file = require('fs');
var dbModule = require('./database');
var request = require('request');

var changelog = file.readFileSync("README.md").toString();
changelog = changelog.substring(changelog.indexOf("# CHANGELOG"));

var User = dbModule.User;

var streamlabsClient = process.env.SL_CLIENT || "";
var streamlabsSecret = process.env.SL_SECRET || "";
var streamlabsRedir = process.env.SL_REDIR || "";

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

router.get('/help', function(req, res) {
	
	res.render('help');
});

router.get('/changelog', function(req, res) {
	
	res.render('changelog', { changelogText: changelog });
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
			hpAmnt: found.settings.hpAmnt,
			volume: found.settings.volume,
			colorBg: found.settings.colorBg,
			colorHb: found.settings.colorHb,
			colorHm: found.settings.colorHm,
			colorHf: found.settings.colorHf,
			colorTx: found.settings.colorTx,
			includeSubs: found.settings.includeSubs,
			resubMult: found.settings.resubMult
		};
		
		res.json(settings);
	});
});

router.post('/settings/*', function(req, res) {
	
	var args = req.path.substring(1).split('/');
	
	var id = args[args.length - 1];
	
	if (isNaN(id) || id.length < 6 || id.length > 9) { res.send("Invalid ID"); return; }
	
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
			hpAmnt: 1000,
			volume: 100,
			colorBg: "rgba(34, 34, 34, 1)",
			colorHb: "rgba(255, 0, 0, 1)",
			colorHm: "rgba(255, 165, 0, 1)",
			colorHf: "rgba(0, 128, 0, 1)",
			colorTx: "rgba(255, 255, 255, 1)",
			includeSubs: false,
			resubMult: 0.25
		};
		
		if (typeof(req.body.sound) == "string") { settings.sound = (req.body.sound == "true"); }
		if (typeof(req.body.trans) == "string") { settings.trans = (req.body.trans == "true"); }
		if (typeof(req.body.chroma) == "string") { settings.chroma = (req.body.chroma == "true"); }
		if (typeof(req.body.persistence) == "string") { settings.persistence = (req.body.persistence == "true"); }
		if (typeof(req.body.bossHealing) == "string") { settings.bossHealing = (req.body.bossHealing == "true"); }
		if (typeof(req.body.avtrHidden) == "string") { settings.avtrHidden = (req.body.avtrHidden == "true"); }
		
		if (typeof(req.body.hpMode) == "string")
		{
			if (req.body.hpMode == "overkill" || req.body.hpMode == "progress" || req.body.hpMode == "constant") { settings.hpMode = req.body.hpMode; }
		}
		
		if (typeof(req.body.hpInit) == "string") { settings.hpInit = (isNaN(parseInt(req.body.hpInit)) ? 1000 : parseInt(req.body.hpInit)); }
		if (typeof(req.body.hpMult) == "string") { settings.hpMult = (isNaN(parseInt(req.body.hpMult)) ? 1 : parseInt(req.body.hpMult)); }
		if (typeof(req.body.hpIncr) == "string") { settings.hpIncr = (isNaN(parseInt(req.body.hpIncr)) ? 100 : parseInt(req.body.hpIncr)); }
		if (typeof(req.body.hpAmnt) == "string") { settings.hpAmnt = (isNaN(parseInt(req.body.hpAmnt)) ? 1000 : parseInt(req.body.hpAmnt)); }
		
		if (typeof(req.body.volume) == "string") { settings.volume = (isNaN(parseInt(req.body.volume)) ? 100 : parseInt(req.body.volume)); }
		
		if (typeof(req.body.colorBg) == "string") { settings.colorBg = req.body.colorBg; }
		if (typeof(req.body.colorHb) == "string") { settings.colorHb = req.body.colorHb; }
		if (typeof(req.body.colorHm) == "string") { settings.colorHm = req.body.colorHm; }
		if (typeof(req.body.colorHf) == "string") { settings.colorHf = req.body.colorHf; }
		if (typeof(req.body.colorTx) == "string") { settings.colorTx = req.body.colorTx; }
		
		if (typeof(req.body.includeSubs) == "string") { settings.includeSubs = (req.body.includeSubs == "true"); }
		if (typeof(req.body.resubMult) == "string") { settings.resubMult = (isNaN(parseFloat(req.body.resubMult)) ? 0.25 : parseFloat(req.body.resubMult)); }
		
		if (saidUser == null)
		{
			saidUser = new User({ userid: id, partner: false, settings: settings });
		}
		else if (req.body.overwrite == "true")
		{
			saidUser.settings = settings;
		}
		
		saidUser.save(function(err) {
			
			if (err) { res.status(500).send("Database Error"); }
			else { res.send("success"); }
		});
	});
});

router.post('/analytics/*', function(req, res) {
	
	var args = req.path.substring(1).split('/');
	
	var id = args[args.length - 1];
	
	if (isNaN(id) || id.length < 6 || id.length > 9) { res.send("Invalid ID"); return; }
	
	User.findOne({ userid: id }, function(err, found) {
		
		if (err) { res.status(500).send("Database Error"); return; }
		if (found == null) { res.send("Not Found"); return; }
		
		var lastAccess = parseInt(req.body.lastAccess);
		
		found.lastAccess = (isNaN(lastAccess) ? 0 : lastAccess);
		found.partner = (req.body.partner == "true");
		
		found.save(function(err) {
			
			if (err) { res.status(500).send("Database Error"); }
			else { res.send("success"); }
		});
	});
});

router.post('/slauth', function(req, res) {
	
	var slToken = req.body.slToken;
	
	if (typeof(slToken) != "string" || slToken == "") { res.json({ error: "Bad token" }); return; }
	
	var form = {
		
		grant_type: (req.body.refresh == "true" ? "refresh_token" : "authorization_code"),
		client_id: streamlabsClient,
		client_secret: streamlabsSecret,
		redirect_uri: streamlabsRedir
	};
	
	if (req.body.refresh == "true") { form.refresh_token = slToken; }
	else { form.code = slToken; }
	
	request.post({ url:'https://streamlabs.com/api/v1.0/token', form: form }, function(err, response, body) {
		
		var resp = JSON.parse(body);
		
		if (resp.error) { console.log("SL AUTH ERR: " + resp.error); res.json({ error: "SL auth error" }); return; }
		
		res.json({ token: resp.access_token, refresh: resp.refresh_token });
	});
});

module.exports = {
	
	router: router
};