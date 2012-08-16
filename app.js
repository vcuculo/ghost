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
(function (storage, helper) {

  $(function () {

    $('#connect').on('click', function () {
      var userAddress = $('#userAddress').val();

      if (helper.validateHandler(userAddress) == false) {
        alert('Please check your remotestorage address');
        return false;
      }

      helper.showSpinner();

      storage.connect(userAddress, function (error, storageInfo) {
        helper.hideSpinner();
        if (error) {
          helper.setConnectionState(false);
        } else {
          localStorage.setItem('userStorageInfo', JSON.stringify(storageInfo));
          localStorage.setItem('userAddress', userAddress);
          storage.authorize(['pictures:rw']);
          helper.setConnectionState(true);
        }
      });

      return false;
    });

    $('#takePhoto').on('click', function () {
      $('#camerabox').append('<canvas id="photo" width="320" height="240"></canvas>');

      $('#photo').css({
        'margin-top': '20px',
        'margin-bottom': '10px',
        'box-shadow': '0 0 50px 10px #fff'
      });

      var c = document.getElementById('photo');
      var v = document.getElementById('camFeed');
      c.getContext('2d').drawImage(v, 0, 0, 320, 240);

      $("html, body").animate({
        scrollTop: $(document).height()
      }, "slow");

      $('#savePhoto').show();

      return false;
    });

    $('#savePhoto').on('click', function () {
      var c = document.getElementById('photo');
      var value = c.toDataURL("image/jpeg"); // encoded picture

      storage.putData('pictures/ghost/' + picture_key, value, function (error) {

        if (!error) {
          $('#photo').fadeOut('slow', function () {
            /* 
            $('#album').append('<a href="'+value+'"><canvas id="'+picture_key+'" width="160" height="120"></canvas></a>').fadeIn('slow');
            var ctx = document.getElementById(picture_key).getContext("2d");
            ctx.drawImage(c, 0, 0, 160, 120);
            */
            $('#album').append('<a href="' + value + '" rel="lightbox[gHost]"><img src="' + value + '" id="' + picture_key + '" width="160" height="120"></img></a>').fadeIn('slow');
            $('#photo').remove();
          });

          picture_key = picture_key + 1;
          $('#savePhoto').hide();
        }
      });

      return false;
    });

    $('#disconnect').on('click', function () {
      helper.disconnect();
      return false;
    });

    helper.setConnectionState(helper.isConnected());
    helper.setAuthorizedState(helper.isAuthorized());
  });

})(storage, helper);
