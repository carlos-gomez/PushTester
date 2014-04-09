var CANVAS_OK = "#00CC66";
var CANVAS_KO = "#FA5858";
var CANVAS_WR = "#F4FA58";

var CANVAS_STR_OK = "OK";
var CANVAS_STR_KO = "CRITICAL";
var CANVAS_STR_WR = "WARNING";


$(function() {
  alert('Welcome to PushTester')

  //Connection Status
   var online = window.navigator.onLine;
   console.log('Conectado: '+ online);
   if (online){
   	endpoint_register();
   	fill_token();
   	fill_canvas('pns_status',CANVAS_OK, CANVAS_STR_OK);
   }
   else{
   	alert('Conecte el dispositivo a una red con datos');
   }
});

document.querySelector('#pushbtn').addEventListener ('click', function(){
	alert('Sent new version to push notification server')
	var version = new Date().getTime();
	var token = localStorage.endpoint || null;
	console.log('Sending notification to ' + URL + 'version: ' + version);
	updateVersion(localStorage.endpoint, version);
})

function beep(severity, msj){
	switch(severity){
		case 'KO':
			fill_canvas(pns_status, CANVAS_KO, CANVAS_STR_KO);
			alert('Algo salió mal :( ' + '\r' + msj);
			//beep :) 
			break;

		case 'WR':
			fill_canvas(pns_status, CANVAS_WR, CANVAS_STR_WR);
			alert('Be carefully' + '\r' + msj);
			break;
	}

}

//Poner cuadrado status con color y msg. Nueva func no hace falta msj, hará 
function fill_canvas(id, color, string){
	var c = document.getElementById(id);
	var ctx = c.getContext("2d");
	ctx.fillStyle = color;
	ctx.fillRect(5,5,210,100);
	ctx.fillStyle = "white";
	ctx.font = "30px FiraSans";
	ctx.fillText(string,77,45);
}

function fill_token(token){
   	$('#AppToken').html('Mi AppToken: ' + token);
}

//Enviar nueva versión al AL de PNS.
function updateVersion(URL,version) {
  var oReq = new XMLHttpRequest();
  oReq.onload = function() {
    $('lastversion_R').innerHTML = "Message=" + this.responseText;

  };
  console.log("URL: " + URL + " Version: "+ version);
  //oReq.open('put', $('endpointURL').innerHTML, true);
  //oReq.send('version='+$('channelVersion').value);
  oReq.open('put', URL, true);
  oReq.send('version=' + version);
  oReq.onerror = function() {
    $('lastversion_R').innerHTML = "Error putting a new version";
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
    $('lastversion_R').innerHTML = "Error putting a new version";
  }
};

//Registro de AppToken
function endpoint_register(){
	//Now we call push.register() to request an endpoint
	console.log('Registering PushTester in PNS');
    var endpoint = localStorage.endpoint || null;

    //Si se soportan notificaciones se activa el manejador de eventos de notificaciones
  if (navigator.push) {
    window.navigator.mozSetMessageHandler('push', function(evt) {
      console.log(evt.pushEndpoint);


      if(endpoint == evt.pushEndpoint) {
        console.log('endpoint equals evt.pushEndpoint ' + endpoint);
      var notification = navigator.mozNotification.createNotification('PushTester new version', 'version = ' + evt.version);
      notification.show();
      $('#lastversion_D').html(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString());
      }

    });

    window.navigator.mozSetMessageHandler('push-register', function() {
      
      navigator.push.unregister(endpoint);

      var req = navigator.push.register();

      req.onsuccess = function(e) {
        var endpoint = localStorage.endpoint = req.result;
        console.log('PUSH-REGISTER: nuevo endpoint --> ' + endpoint);
        fill_token(endpoint);
      }

      req.onerror = function(e) {
      	//aqui llamamos a beep
       console.log('PUSH-REGISTER: error --> ' + JSON.stringify(e));
       beep(KO, JSON.stringify(e));
     }

    });
  }
  //Si no se soportan notificaciones push
  else{
  	console.log('The browser doesn\'t support notifications push')
  	alert('The browser doesn\'t support notifications push')
  }

  if(!endpoint){
    if (navigator.push) {
      var req = navigator.push.register();

      req.onsuccess = function(e) {
        endpoint = localStorage.endpoint = req.result;
        console.log('PUSH: nuevo endpoint --> ' + endpoint);
        fill_token(endpoint);

      }

      req.onerror = function(e) {
      	//aqui llamamos a beep
       console.log('PUSH: error endpoint--> ' + JSON.stringify(e));
       beep(KO, JSON.stringify(e));
      }
   }
 } else {
  endpoint = localStorage.endpoint;
  console.log('PUSH: mi endpoint es: ' + endpoint);
  fill_token(endpoint);
 }
}

function timeOut() {
    window.alert('Hello!');
    timeOut_init();   
}

function timeOut_init() {
    setTimeout('timeOut()', 5000);
}