/*
Copyright 2012 Vittorio Cuculo <vittorio.cuculo@gmail.com>

Portions Copyright 2012 Unhosted

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
var helper = (function () {
  var connected = false;
  var authorized = false;

  function setConnectionState(state) {
    connected = state;

    if (connected) {
      init();
      $('#connect').hide();
      $('#disconnect').show();
      $('#userAddress').val(localStorage.getItem('userAddress'));
      $('#splash').hide();
      $('#info').hide();
      $('#login').css({
        "position": "fixed",
        "right": "10px",
        "top": "10px",
        "z-index": "2"
      });
      $('#userAddress').attr('disabled', 'disabled');
    } else {
      deauthorize();
      stopVideo();
      helper.hideSpinner();
      $('#connect').show();
      $('#disconnect').hide();
      $('#userAddress').val('');
      $('#camerabox').fadeOut('slow', function () {
        $('#album').remove();
        $('#photo').remove();
        $('#savePhoto').attr('hidden', 'hidden');
        $('#login').removeAttr('style');
        $('#userAddress').removeAttr('disabled');
        $('#splash').fadeIn('slow');
        $('#info').fadeIn('slow');
      });
    }
  }

  function stopVideo() {
    var video = document.getElementById("camFeed");
    video.pause();
    if (myStream) myStream.stop();
  }

  function isConnected() {
    return localStorage.getItem('userStorageInfo') != null;
  }

  function disconnect() {
    localStorage.removeItem('userStorageInfo');
    localStorage.removeItem('userAddress');
    setConnectionState(false);
  }

  function setAuthorizedState(state) {
    authorized = state;

    if (authorized) {
      picture_key = 1;
      storage.getData('pictures/ghost/' + picture_key, getPic);
      $('body').append('<div id="album" style="z-index:1"></div>');
      helper.showSpinner();
    }
  }

  function isAuthorized() {
    return localStorage.getItem('bearerToken') != null;
  }

  function deauthorize() {
    localStorage.removeItem('bearerToken');
    setAuthorizedState(false);
  }

  function showSpinner() {
    $('#spinner').show();
  }

  function hideSpinner(id) {
    $('#spinner').hide();
  }

  function validateHandler(elementValue) {
    var handlerPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return handlerPattern.test(elementValue);
  }

  return {
    setConnectionState: setConnectionState,
    isConnected: isConnected,
    disconnect: disconnect,
    setAuthorizedState: setAuthorizedState,
    isAuthorized: isAuthorized,
    deauthorize: deauthorize,
    showSpinner: showSpinner,
    hideSpinner: hideSpinner,
    validateHandler: validateHandler
  };
})();
