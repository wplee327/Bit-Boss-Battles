var ws = null;

var pingWait = null;

var maxWait = 128000;
var currentWait = 1000;

var queue = [];

var nonce = "";

var preventReconnect = false;

var topics = [];

function Jitter() {
	
	return Math.floor(Math.random() * 10);
}

function NewNonce() {
	
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	
	var length = Math.floor(Math.random() * 10) + 10;

	for(var i = 0; i < length; i++)
	{
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

function Connect(url, success) {
	
	// Connect
	ws = new WebSocket(url);
	
	// Establish handlers
	ws.onopen = function() {
		
		success();
		
		setTimeout(function() {
			
			ws.send(JSON.stringify({ type: "PING"}));
			pingWait = setTimeout(function() {
				
				ws.close();
			}, 10000);
		}, 180000 + Jitter());
	};
	
	ws.onerror = function() {
		
		setTimeout(function() {
			
			Connect(url, success);
		}, currentWait);
		currentWait *= 2;
	};
	
	ws.onclose = function() {
		
		console.log("Closed connection.");
		
		if (!preventReconnect)
		{
			setTimeout(function() {

			   Connect(url, success); 
			});
		}
	};
	
	ws.onmessage = InterpretMessage;
}

function Listen(topic, auth, msgCallback, listenFailure) {
	
	if (ws != null)
	{
		if (ws.readyState == ws.OPEN)
		{
			var nonce = NewNonce();
			var command = {
				"type": "LISTEN",
				"nonce": nonce,
				"data": {
					topics: [topic],
					auth_token: auth
				}
			};
			
			ws.send(JSON.stringify(command));
			
			for (var i = 0; i < topics.length; i++)
			{
				if (topics[i].topic == topic)
				{
					return;
				}
			}
			
			queue.push({ topic: topic, nonce: nonce, callback: msgCallback, listenFailure: listenFailure });
		}
	}
}

//function Fake(topic, msgCallback) {
//	
//	topics.push({ topic: topic, callback: msgCallback });
//}

function InterpretMessage(message) {
	
	var parsed = JSON.parse(message.data);
	
	if (parsed.type == "RESPONSE")
	{
		for (var i = 0; i < queue.length; i++)
		{
			if (queue[i].nonce == parsed.nonce)
			{
				var queued = queue[i];
				queue.splice(i, 1);
				
				if (parsed.error != "")
				{
					if (queued.listenFailure) { queued.listenFailure(parsed.error); }
					console.log("Failed Listen: " + queued.topic);
					return;
				}
				
				topics.push(queued);
				console.log("Listened to " + queued.topic);
				return;
			}
		}
	}
	
	if (parsed.type == "PONG")
	{
		if (pingWait != null) { clearTimeout(pingWait); }
		
		setTimeout(function() {
			
			ws.send(JSON.stringify({ type: "PING"}));
			pingWait = setTimeout(function() {
				
				ws.close();
			}, 10000);
		}, 180000 + Jitter());
		
		return;
	}
	
	if (parsed.type == "MESSAGE")
	{
		for (var i = 0; i < topics.length; i++)
		{
			if (topics[i].topic == parsed.data.topic)
			{
				try
				{
					topics[i].callback(JSON.parse(parsed.data.message));
					console.log("Stringified internal data. " + parsed.data.topic);
				}
				catch (e)
				{
					topics[i].callback(parsed.data.message);
					console.log("Non-stringified internal data. " + parsed.data.topic);
				}
				return;
			}
		}
	}
}