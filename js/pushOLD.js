/**
* This library implements the navigator.mozPush & navigator.push libraries
* on a non natively supported browsers.
* This can be used as a secure fallback since the native version is used if it
* exists
*
* Author: Fernando Rodríguez Sela, 2013
* All rights reserverd. January 2013
*
* License: GNU Affero V3 (see LICENSE file)
*/


 'use strict';

/**
* Implementation of navigator.push
* W3C spec: http://www.w3.org/TR/push-api/
*/

 function _Push() {

 }

 _Push.prototype = {
  /////////////////////////////////////////////////////////////////////////
  // Push methods
  /////////////////////////////////////////////////////////////////////////
  very_long_message: "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 \ 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",

  setGlobals: function(_IN){
    _IN = typeof _IN !== 'undefined' ? _IN : {whatever:true};
    this._uaid = typeof _IN.uaid !== 'undefined' ? _IN.uaid : this.token;
    this._channels = typeof _IN.channels !== 'undefined' ? _IN.channels : [];
    this._ip = typeof _IN.ip !== 'undefined' ? _IN.ip : this.wakeup.host;
    this._ip_alt = typeof _IN.ip_alt !== 'undefined' ? _IN.ip_alt : this.wakeup.host_alt;
    this._port = typeof _IN.port !== 'undefined' ? _IN.port : this.wakeup.port;
    this._port_alt = typeof _IN.port_alt !== 'undefined' ? _IN.port_alt : this.wakeup.port_alt;
    this._mcc = typeof _IN.mcc !== 'undefined' ? _IN.mcc : this.wakeup.mcc;
    this._mcc_alt = typeof _IN.mcc_alt !== 'undefined' ? _IN.mcc_alt : this.wakeup.mcc_alt;
    this._mnc = typeof _IN.mnc !== 'undefined' ? _IN.mnc : this.wakeup.mnc;
    this._mnc_alt = typeof _IN.mnc_alt !== 'undefined' ? _IN.mnc_alt : this.wakeup.mnc_alt;
    this._protocol = typeof _IN.protocol !== 'undefined' ? _IN.protocol : this.wakeup.protocol;
    this._pushEndPointURL = typeof _IN.pushEndPointURL !== 'undefined' ? _IN.pushEndPointURL : this.pushEndPointURL;
    this._IN = _IN;
  },

  requestURL: function(watoken, certUrl) {
    this.debug('[requestURL] Warning, DEPRECATED method. Use register instead');
    return this.register(watoken, certUrl);
  },

  requestHello: function(_IN) {
    this.hello(_IN,false);
  },

  registerEx: function(watoken, certUrl) {
    var cb = {};

    if(!watoken || !certUrl) {
      this.debug('[registerEx] Error, no WAToken nor certificate URL provided');
      setTimeout(function() {
        if(cb.onerror) cb.onerror('Error, no WAToken nor certificate URL provided');
      });
      return cb;
    }

    this.registerUA(function () {
      this.registerWA(watoken, certUrl, function(URL) {
        this.debug('[registerWA Callback] URL: ',URL);
        if(cb.onsuccess) {
          cb.onsuccess(URL);
        }
      }.bind(this));
    }.bind(this));

    var self=this;
    window.addEventListener('pushmessage', function(event) {
      self.debug('[pushmessage Callback] Message: ',event);
      if(cb.onmessage) {
        cb.onmessage(JSON.parse(event.detail.message));
      }
    });

    return cb;
  },

  register: function(_IN) {
    var cb = {};

    this.setGlobals(_IN);

    this.registerUA(function () {
      this.registerWA(function(URL) {
        this.debug('[registerWA Callback] URL: ',URL);
        if(cb.onsuccess) {
          cb.onsuccess(URL);
        }
      }.bind(this));
    }.bind(this));

    var self=this;
    window.addEventListener('pushmessage', function(event) {
      self.debug('[pushmessage Callback] Message: ',event);
      if(cb.onmessage) {
        cb.onmessage(JSON.parse(event.detail.message));
      }
    });

    return cb;
  },

  register_fake: function(_IN) {
    var cb = {};

    this.setGlobals(_IN);
    this.openWebsocket_reg();

    this.sendWS({
     channelID: "1234",
     messageType: 'register'
   });

    return cb;
  },


  unregister: function(_IN) {

    this.setGlobals(_IN);

    this.unregisterWA(_IN);
  },

  /**
* Setup PUSH interface
* data is a JSON object with these attributes:
* {
* "host": "PUSH_SERVER_HOSTNAME",
* "port": PUSH_SERVER_PORT,
* "ssl": [ true | false ],
*
* ---> FOLLOWING attributes are only used in this fallback library <---
* "debug": [ true | false ],
* "keepalive": WEBSOCKET_KEEPALIVE_TIMER (in msecs),
*
* ---> FOLLOWING attributes are only used for testing purpose in order
* to simulate UDP/TCP wakeup service in the client machine.
* use only if you know what are you doing <---
* "wakeup_enabled": [ true | false ],
* "wakeup_host": "WAKEUP_HOSTNAME",
* "wakeup_port: WAKEUP_PORT,
* "wakeup_protocol: [ 'tcp' | 'udp' ],
* "wakeup_mcc: 'MOBILE COUNTRY CODE',
* "wakeup_mnc: 'MOBILE NETWORK CODE'
* }
*/
   setup: function(data) {
    if(!data)
      return;

    // Setupable parameters:
    // id: [ 'DESCRIPTION', 'attribute to store in', Shall be reinit? ]
    var _params = {
      host: ['hostname', 'this.server.host', true],
      port: ['port', 'this.server.port', true],
      ssl: ['ssl', 'this.server.ssl', true],

      // Out of the W3C standard
      debug: ['DEBUG', 'this.DEBUG', false],
      keepalive: ['keepalive', 'this.server.keepalive', true],

      // WakeUp development parameters
      wakeup_enabled: ['WakeUp ENABLED', 'this.wakeup.enabled', true],
      wakeup_host: ['WakeUp host', 'this.wakeup.host', true],
      wakeup_alt_host: ['WakeUp alt host', 'this.wakeup.host_alt', true],
      wakeup_port: ['WakeUp port', 'this.wakeup.port', true],
      wakeup_alt_port: ['WakeUp alt port', 'this.wakeup.port_alt', true],
      wakeup_protocol: ['WakeUp protocol', 'this.wakeup.protocol', true],
      wakeup_mcc: ['WakeUp MCC', 'this.wakeup.mcc', true],
      wakeup_alt_mcc: ['WakeUp alt MCC', 'this.wakeup.mcc_alt', true],
      wakeup_mnc: ['WakeUp MNC', 'this.wakeup.mnc', true],
      wakeup_alt_mnc: ['WakeUp alt MNC', 'this.wakeup.mnc_alt', true],

      //ACK message type
      ack: ['ack','this.ack', true],
      ack_null_updates: ['ack_null_updates', 'this.ack_null_updates', true],
      ack_invalid_channelID: ['ack_invalid_channelID','this.ack_invalid_channelID', true],
      ack_null_channelID: ['ack_null_channelID','this.ack_null_channelID', true],
      ack_null_version: ['ack_null_version','this.ack_null_version', true],
      ack_invalid_version: ['ack_invalid_version','this.ack_invalid_version', true],
      no_ack: ['no_ack','this.no_ack',true],

      //keep alive
      ping: ['ping','this.ping', true],
      pong: ['pong','this.pong', true],
      other: ['other','this.other', true],

      pushEndPointURL: ['pushEndPointURL','this.pushEndPointURL',true]
    };
    var _setup = function(param, value) {
      if(param === undefined) {
        this.debug('[setup::_setup] No recognized param value');
        return;
      }
      if (value === undefined) {
        return;
      }

      this.debug('[setup::_setup] Changing ' + param[0] + ' to: ' + value);
      if(typeof(value) == 'string') {
        eval(param[1] += ' = "' + value + '"');
      } else {
        eval(param[1] += ' = ' + value);
      }
      if (param[2])
        this.initialized = false;
    }.bind(this);

    this.debug('[setup] Setup data received: ', data);
    _setup(_params.host, data.host);
    _setup(_params.port, data.port);
    _setup(_params.ssl, data.ssl);

    // Out of the W3C standard
    _setup(_params.debug, data.debug);
    _setup(_params.keepalive, data.keepalive);

    // WakeUp development parameters
    _setup(_params.wakeup_enabled, data.wakeup_enabled);
    _setup(_params.wakeup_host, data.wakeup_host);
    _setup(_params.wakeup_alt_host, data.wakeup_alt_host);
    _setup(_params.wakeup_port, data.wakeup_port);
    _setup(_params.wakeup_alt_port, data.wakeup_alt_port);
    _setup(_params.wakeup_protocol, data.wakeup_protocol);
    _setup(_params.wakeup_mcc, data.wakeup_mcc);
    _setup(_params.wakeup_alt_mcc, data.wakeup_alt_mcc);
    _setup(_params.wakeup_mnc, data.wakeup_mnc);
    _setup(_params.wakeup_alt_mnc, data.wakeup_alt_mnc);

    // ACK parameters
    _setup(_params.ack, data.ack);
    _setup(_params.ack_null_updates, data.ack_null_updates);
    _setup(_params.ack_invalid_channelID, data.ack_invalid_channelID);
    _setup(_params.ack_null_channelID, data.ack_null_channelID);
    _setup(_params.ack_null_version, data.ack_null_version);
    _setup(_params.ack_invalid_version, data.ack_invalid_version);
    _setup(_params.no_ack, data.no_ack);

    // Ping pong params
    _setup(_params.ping, data.ping);
    _setup(_params.pong, data.pong);
    _setup(_params.other, data.other);

    _setup(_params.pushEndPointURL, data.pushEndPointURL);

    //_setup(_params.)

    if (!this.initialized) {
      this.debug('[setup] Reinitializing . . .');
      this.init();
    }
    this.debug('[setup] Current status SERVER: ', this.server);
    this.debug('[setup] Current status WAKEUP: ', this.wakeup);
    this.debug('[setup] Current status DEBUG: ', (this.DEBUG ? 'ON' : 'OFF'));
  },

  /**
* Current setup recovery
*/
   getSetup: function() {
    return {
      debug: this.DEBUG,
      host: this.server.host,
      port: this.server.port,
      ssl: this.server.ssl,
      keepalive: this.server.keepalive,
      wakeup_enabled: this.wakeup.enabled,
      wakeup_host: this.wakeup.host,
      wakeup_alt_host: this.wakeup.host_alt,
      wakeup_port: this.wakeup.port,
      wakeup_alt_port: this.wakeup.port_alt,
      wakeup_protocol: this.wakeup.protocol,
      wakeup_mcc: this.wakeup.mcc,
      wakeup_alt_mcc: this.wakeup.mcc_alt,
      wakeup_mnc: this.wakeup.mnc,
      wakeup_alt_mnc: this.wakeup.mnc_alt,
      ack: this.ack,
      ack_null_updates: this.ack_null_updates,
      ack_invalid_channelID: this.ack_invalid_channelID,
      ack_null_channelID: this.ack_null_channelID,
      ack_null_version: this.ack_null_version,
      ack_invalid_version: this.ack_invalid_version,
      no_ack: this.noack,
      ping: this.ping,
      pong: this.pong,
      other: this.other,
      pushEndPointURL: this.pushEndPointURL
    };
  },

  /////////////////////////////////////////////////////////////////////////
  // Auxiliar methods (out of the standard, only used on this fallback)
  /////////////////////////////////////////////////////////////////////////

  /**
* Set to defaults
*/
   defaultconfig: function() {
    this.server = {};
    this.wakeup = {};
    this.setup({
      debug: true,
      host: 'ua.push.tefdigital.com',
      port: 443,
      ssl: true,
      keepalive: 60000,
      wakeup_enabled: false,
      wakeup_host: '10.95.30.173',
      wakeup_alt_host: '10.95.30.174',
      wakeup_port: 8080,
      wakeup_alt_port: 8081,
      wakeup_protocol: 'udp',
      wakeup_mcc: '214',
      wakeup_alt_mcc: '215',
      wakeup_mnc: '07',
      wakeup_alt_mnc: '08',
      ack: true,
      ack_null_updates: false,
      ack_invalid_channelID: false,
      ack_null_channelID: false,
      ack_null_version: false,
      ack_invalid_version: false,
      no_ack: false,
      ping: true,
      pong: false,
      other: false
    });
  },

  /**
* Initialize
*/
   init: function() {
    if(this.initialized) {
      return;
    }

    this.debug('Initializing',this.server);

    this.server.ad_ws = 'ws'+(this.server.ssl == "true" || this.server.ssl ? 's' : '')+'://';
    if(this.server.port) {
      this.server.ad_ws += this.server.host + ':' + this.server.port;
    } else {
      this.server.ad_ws += this.server.host;
    }

    this.server.ws = {
      connection: null,
      ready: false
    };

    this.server.registeredUA = false;

    this.token = null;
    //this.token = 'dd9cbbe1-b255-48d5-8c6a-21702664ec33@98885403e99df8411e063fc8dbc88eac7efed54b';
    this.publicURLs = [];

    this.initialized = true;
  },

  /**
* Hello
*/
   hello: function(_IN) {

    this.setGlobals(_IN);
    this.openWebsocket();

    if (this.wakeup.enabled) {
      this.sendWS({
        uaid: this._uaid,
        channelIDs: this._channels,
        'wakeup_hostport': {
          ip: this._ip,
          port: this._port
        },
        mobilenetwork: {
          mcc: this._mcc,
          mnc: this._mnc
        },
        protocol: this._protocol,
        messageType: 'hello'
      });
    } else {
      this.sendWS({
        uaid: this._uaid,
        channelIDs: this._channels,
        messageType: 'hello'
      });
    }

    this.onHelloMessage = function(msg) {
      this.token = msg.uaid;
    }.bind(this);


  },

  /**
* Register UA
*/
   registerUA: function(cb) {
    if(this.server.registeredUA) {
      if(cb) cb();
      return;
    }

    this.onRegisterUAMessage = function(msg) {
      this.token = msg.uaid;
      if(cb) cb();
    }.bind(this);

    //this.openWebsocket();
  },

  /**
* Register WA
*/
   registerWA: function(cb) {
    this.onRegisterWAMessage = function(msg) {
      this.debug('[onRegisterWAMessage] ', msg);

      this.publicURLs.push(msg.pushEndpoint);

      if(cb) cb(msg.pushEndpoint);
    }.bind(this);

    this.debug('[registerWA] Going to register WA');
    this.sendWS({
      channelID: this._channels,
      messageType: 'register'
    });
  },

  /**
* Unregister WA
*/
   unregisterWA: function(_IN) {

    _IN = typeof _IN !== 'undefined' ? _IN : {whatever:true};
    this._channels = typeof _IN.channels !== 'undefined' ? _IN.channels : [];

    this.debug('[unregisterWA] Going to unregister WA');
    this.sendWS({
      channelID: this._channels,
      messageType: 'unregister'
    });
  },

  /**
* Open Websocket connection
*/
   openWebsocket: function() {
    if (this.server.ws.ready)
      return;

    this.debug('[openWebsocket] Openning websocket to: ' + this.server.ad_ws);
    this.server.ws.connection =
    new WebSocket(this.server.ad_ws, 'push-notification');

    this.server.ws.connection.onopen = this.onOpenWebsocket.bind(this);
    this.server.ws.connection.onclose = this.onCloseWebsocket.bind(this);
    this.server.ws.connection.onerror = this.onErrorWebsocket.bind(this);
    this.server.ws.connection.onmessage = this.onMessageWebsocket.bind(this);
  },

  /**
* Open Websocket connection special version with register operation instead of hello
*/
   openWebsocket_reg: function() {
    if (this.server.ws.ready)
      return;

    this.debug('[openWebsocket] Openning websocket to ++++: ' + this.server.ad_ws);
    this.server.ws.connection =
    new WebSocket(this.server.ad_ws, 'push-notification');

    this.server.ws.connection.onopen = this.onOpenWebsocket_reg.bind(this);
    this.server.ws.connection.onclose = this.onCloseWebsocket.bind(this);
    this.server.ws.connection.onerror = this.onErrorWebsocket.bind(this);
    this.server.ws.connection.onmessage = this.onMessageWebsocket.bind(this);
  },

  /**
* Close Websocket connection
*/
   closeWebsocket: function() {
    if (!this.server.ws.ready)
      return;

    this.debug('[closeWebsocket] Closing websocket to ++++: ' + this.server.ad_ws);
    if (this.server.ws.connection) {
      this.server.ws.connection.close();
    }
  },

  /**
* Send a Websocket message (object)
*/
   sendWS: function(json) {
    var msg = JSON.stringify(json);
    this.debug('[sendWS] Preparing to send: ' + msg);
    if (this.server.ws.ready)
      this.server.ws.connection.send(msg);
  },

  /**
* Websocket callbacks
*/

   onOpenWebsocket: function() {
    this.debug('[onOpenWebsocket] Opened connection to ' + this.server.host);
    this.server.ws.ready = true;

    // We shall registerUA each new connection
    this.debug('[onOpenWebsocket] Started registration to the notification server');
    this.hello(this._IN);

    if(this.server.keepalive > 0) {
      this.keepalivetimer = setInterval(function() {
        if (this.pong){
          this.debug('[Websocket Keepalive] Sending keepalive message. {"hello"}');
          this.server.ws.connection.send('{"hello"}');
        } else if (this.other) {
          this.debug('[Websocket Keepalive] Sending keepalive message. {"verylongmessage"}');
          this.server.ws.connection.send('{"' + this.very_long_message + '"}');
        } else if (this.ping) {
          this.debug('[Websocket Keepalive] Sending keepalive message. {}');
          this.server.ws.connection.send('{}');
        }
      }.bind(this), this.server.keepalive);
    }
  },

  onOpenWebsocket_reg: function() {
    this.debug('[onOpenWebsocket] Opened connection to +++++' + this.server.host);
    this.server.ws.ready = true;

    // We shall registerUA each new connection
    this.debug('[onOpenWebsocket] Started registration to the notification server +++++');
    this.register_fake(this._IN);
  },


  onCloseWebsocket: function(e) {
    this.debug('[onCloseWebsocket] Closed connection to ' + this.server.ad +
      ' with code ' + e.code + ' and reason ' + e.reason);
    this.server.ws.ready = false;
    this.server.registeredUA = false;
    clearInterval(this.keepalivetimer);
  },

  onErrorWebsocket: function(e) {
    this.debug('[onErrorWebsocket] Error in websocket in ' + this.server.ad +
      ' with error ' + e.error);
    this.server.ws.ready = false;
  },

  onMessageWebsocket: function(e) {
    this.debug('[onMessageWebsocket] Message received --- ' + e.data);
    if (e.data === 'PONG') {
      return;
    }
    var msg = JSON.parse(e.data);
    if(msg[0]) {
      for(var m in msg) {
        this.manageWebSocketResponse(msg[m]);
      }
    } else {
      this.manageWebSocketResponse(msg);
    }
  },

  manageWebSocketResponse: function(msg) {
    switch(msg.messageType) {
    case 'hello':
      this.server.registeredUA = true;
      this.onHelloMessage(msg);
      break;

    case 'register':
      this.debug('[manageWebSocketResponse register] Registered channelID');
      this.onRegisterWAMessage(msg);
      break;

    case 'notification':
    case 'desktopNotification':
      this.debug('[manageWebSocketResponse notification] Going to ack the message ', msg);
      var event = new CustomEvent('pushmessage', {
        "detail": { "message": JSON.stringify(msg.updates) }
      });
      window.dispatchEvent(event);

      if (this.ack_null_updates) {
        this.debug('[sendWS]{"messageType": "ack", "updates": null}');
        this.sendWS({
          messageType: 'ack',
          updates: null
        });
        break;
      } else if (this.ack_invalid_channelID) {
        this.debug('[sendWS]{"messageType": "ack", "updates": {"channelID": "", "version": 1}}');
        this.sendWS({
          messageType: 'ack',
          updates: { channelID: "", version: 1}
        });
        break;
      } else if (this.ack_null_channelID) {
        this.debug('[sendWS]{"messageType": "ack", "updates": { "channelID": null, "version": 1}}');
        this.sendWS({
          messageType: 'ack',
          updates: { channelID: null, version: 1}
        });
        break;
      } else if (this.ack_null_version) {
        this.debug('[sendWS]{"messageType": "ack", "updates": { "channelID": "1234", "version": null}}');
        this.sendWS({
          messageType: 'ack',
          updates: { channelID: "1234", version: null}
        });
        break;
      } else if (this.ack_invalid_version) {
        this.debug('[sendWS]{"messageType": "ack", "updates": { "channelID": "1234", "version": ""}}');
        this.sendWS({
          messageType: 'ack',
          updates: { channelID: "1234", version: ""}
        });
        break;
      } else if (this.no_ack) {
        //We won't send nothing
        this.debug('NO ACK');
        break;
      } else {
        this.debug('[sendWS]{"messageType": "ack", "updates"', msg.updates);
        this.sendWS({
          messageType: 'ack',
          updates: msg.updates
        });
        break;
      }
    }
  },

  /**
* Debug logger method
*/
   debug: function(msg, obj) {
    if(this.DEBUG) {
      var message = msg;
      if(obj) {
        message += ': ' + JSON.stringify(obj);
      }
      console.log('[PUSH (LIBRARY) LIBRARY DEBUG] ' + message);
    }
  }
};

/**
* Autoinitialization and redefinition of navigator.push if needed
*/

 (function() {
  // Enable/Disable DEBUG traces
  var DEBUG = true;

  /**
* Debug logger method
*/
   function debug(msg, obj) {
    if(DEBUG) {
      var message = msg;
      if(obj) {
        message += ': ' + JSON.stringify(obj);
      }
      console.log('[PUSH (INIT) LIBRARY DEBUG] ' + message);
    }
  }

  /**
* Check navigator.push support and fallback if not supported
*/
   function init() {
    debug('Checking navigator.push existance');
    if(navigator.push) {
      debug('navigator.push supported by your browser');
      return;
    }
    debug('No push supported by your browser. Falling back');
    navigator.push = new _Push();
    navigator.push.defaultconfig();
    navigator.push.init();
  }

  init();
})();
