function $(id) {
  return document.getElementById(id);
};

function close_connection() {
  var c = navigator.push.closeWebsocket();
};

function register(_IN,callback) {
  var c = navigator.push.register(_IN);
  c.onsuccess=function(url) {
    $('endpointURL').innerHTML = url;
    $('uaid').innerHTML = navigator.push.token;
    _IN.pushEndPointURL = url;
    if (callback)
      callback(url, 1);
  };
  c.onmessage=function(msg) {
    $('asyncmsg').innerHTML = JSON.stringify(msg);
  };
};

function register_fake(_IN,callback) {
  var c = navigator.push.register_fake(_IN);
  c.onsuccess=function(url) {
    $('endpointURL').innerHTML = url;
    _IN.pushEndPointURL = url;
    if (callback)
      callback(url, 1);
  };
  c.onmessage=function(msg) {
    $('asyncmsg').innerHTML = JSON.stringify(msg);
  };
};

function generateMQJSON() {
  t = $('queuedata');
  json = {
    "uaid": navigator.push.token,
    "messageId": "abcd",
    "payload": {
      "appToken": navigator.push.publicURLs[0],
      "channelID":"1234",
      "version": 1
    }
  };
  t.innerHTML = JSON.stringify(json);
};

function getSetup() {
  var c = navigator.push.getSetup();
  $('setup_debug').checked = (c.debug === "true" || c.debug ? true : false);
  $('setup_host').value = c.host;
  $('setup_port').value = c.port;
  $('setup_ssl').checked = (c.ssl === "true" || c.ssl ? true : false);
  $('setup_ka').value = c.keepalive;
  $('setup_wu_enabled').checked = (c.wakeup_enabled === "true" ? true : false);
  $('setup_wu_host').value = c.wakeup_host;
  $('setup_wu_port').value = c.wakeup_port;
  $('setup_wu_proto').value = c.wakeup_protocol;
  $('setup_wu_mcc').value = c.wakeup_mcc;
  $('setup_wu_mnc').value = c.wakeup_mnc;
  $('endpointURL').value = c.pushEndPointURL;
};

function changeSetup(param, value) {
  navigator.push.setup(JSON.parse('{"'+param+'": "'+value+'"}'));
  getSetup();
};

function updateVersion(URL,version) {
  var oReq = new XMLHttpRequest();
  oReq.onload = function() {
    $('updateversion-msg').innerHTML = "Message=" + this.responseText;

  };
  console.log("URL: " + URL + " Version: "+ version);
  //oReq.open('put', $('endpointURL').innerHTML, true);
  //oReq.send('version='+$('channelVersion').value);
  oReq.open('put', URL, true);
  oReq.send('version=' + version);
  oReq.onerror = function() {
    $('updateversion-msg').innerHTML = "Error putting a new version";
  }
};

function updateVersion_noVersion() {
  var oReq = new XMLHttpRequest();
  oReq.onload = function() {
    console.log(this.responseText);
  };
  oReq.open('put', $('endpointURL').innerHTML, true);
  oReq.send('version=');

  oReq.onerror = function() {
    $('updateversion-msg').innerHTML = "Error putting a new version";
  }
};

function updateVersion_wrongEndPoint() {
  var oReq = new XMLHttpRequest();
  oReq.onload = function() {
    console.log(this.responseText);
  };
  oReq.open('put', 'https://push-nv.srv.openwebdevice.com:443/v1/notify/6529a94b1ffd75da4d5b6a7eff85e13b5905903dbe7d69ee60e135df09b1ce27', true);
  oReq.send('version='+$('channelVersion').value);
};

function updateVersion_incorrectVersion() {
  var oReq = new XMLHttpRequest();
  oReq.onload = function() {
    console.log(this.responseText);
  };
  oReq.open('put', $('endpointURL').innerHTML, true);
  oReq.send('version=HELLO');
};

window.onload = getSetup;

// a partir de aqui mario

document.querySelector('#hello').addEventListener ('click', function () {

alert('registering device (wait 4 seconds before clicking on register');

});


