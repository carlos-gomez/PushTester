var Push = (function() {
//Now we call push.register() to request an endpoint
    var endpoint = localStorage.endpoint || null;

  if (navigator.push) {
    window.navigator.mozSetMessageHandler('push', function(evt) {
      console.log(evt.pushEndpoint);


      if(endpoint == evt.pushEndpoint) {
        console.log('endpoint equals evt.pushEndpoint ' + endpoint);
      var notification = navigator.mozNotification.createNotification('Ping', 'version = ' + evt.version);
      notification.show();
      }

    });

    window.navigator.mozSetMessageHandler('push-register', function() {
      //aqui llamamos a beep
      navigator.push.unregister(endpoint);

      var req = navigator.push.register();

      req.onsuccess = function(e) {
        var endpoint = localStorage.endpoint = req.result;
        console.log('PUSH-REGISTER: nuevo endpoint --> ' + endpoint);
      }

      req.onerror = function(e) {
       console.log('PUSH-REGISTER: error --> ' + JSON.stringify(e));
     }

    });
  }

  if(!endpoint){
    if (navigator.push) {
      var req = navigator.push.register();

      req.onsuccess = function(e) {
        endpoint = localStorage.endpoint = req.result;
        console.log('PUSH: nuevo endpoint --> ' + endpoint);

      }

      req.onerror = function(e) {
       console.log('PUSH: error endpoint--> ' + JSON.stringify(e));
      }
   }
 } else {
  endpoint = localStorage.endpoint;
  console.log('PUSH: mi endpoint es: ' + endpoint);
 }
});


/*var alarmId1;
 var request = navigator.mozAlarms.add(new Date("Abr 3, 2014 21:30:00"), "ignoreTimezone", { mydata: "test" });
 request.onsuccess = function (e) { alarmId1 = e.target.result; };
 request.onerror = function (e) { alert(e.target.error.name); };

var request = navigator.mozAlarms.getAll();
 request.onsuccess = function (e) { alert(JSON.stringify(e.target.result)); };
 request.onerror = function (e) { alert(e.target.error.name); };*/
