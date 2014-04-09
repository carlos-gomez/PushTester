$(function() {
  alert('Welcome to PushTester')

  //Connection Status
   var online = window.navigator.onLine;
   console.log('Conectado: '+ online);
   if (online){
   	var token = localStorage.endpoint || null;
   	$('#AppToken').html('Mi AppToken: ' + token);
   	//$('#AppToken').html('Mi AppToken: ' + localStorage.endpoint);
   }
   else{
   	alert('Conecte el dispositivo a una red con datos');
   }
  //timeOut_init();
});

function timeOut() {
    window.alert('Hello!');
    timeOut_init();   
}

function timeOut_init() {
    setTimeout('timeOut()', 5000);
}

document.querySelector('#pushbtn').addEventListener ('click', function(){
	alert('Sent new version to push notification server')
})


//Usar JSON.stringify({x: 5, y: 6}); 
function notify(myEndpoint, msg, issuing) {
    			request.put({
    				url: myEndpoint,
    				body: "version=" + new Date().getTime()
    			}, function (error, response, body) {
    				if(response && response.statusCode == 200){
    					var time = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    					console.log(body);
    					console.log(time + ' NOTIFICACION ENVIADA --> EMISOR: ' + issuing + ' MENSAJE: ' + msg);
    				} else {
    					console.log(error);
    					console.log(body);
    				}
    			}
    	}
function updateContact (contact) {

     jQuery.ajax({
         type: "PUT",
         url: "http://localhost:49193/Contacts.svc/Update",
         contentType: "application/json; charset=utf-8",
         data: contact.toJsonString(),
         dataType: "json",
         success: function (data, status, jqXHR) {
             // do something
         },
     
         error: function (jqXHR, status) {
             // error handler
     
         }     
     });     
}
/*document.querySelector('#hello').addEventListener ('click', function () {

alert('hacer hello');
});

document.querySelector('#register').addEventListener ('click', function () {

alert('hacer register');
});

document.querySelector('#unregister').addEventListener ('click', function () {

alert('hacer unregister');
});

document.querySelector('#notify').addEventListener ('click', function () {

alert('hacer notify');
});*/