$(function() {
  alert('Welcome to PushTester')
  var token = localStorage.endpoint || null;
  $('#AppToken').html('Mi AppToken: ' + token);
  timeOut_init();
});

function timeOut() {
    window.alert('Hello!');
    timeOut_init();   
}

function timeOut_init() {
    setTimeout('timeOut()', 5000);
}

document.querySelector('#hello').addEventListener ('click', function () {

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
});