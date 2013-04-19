/* remotestorage init */

var album;

$(document).ready(function () {
  remoteStorage.claimAccess('pictures', 'rw')
  remoteStorage.displayWidget();
  remoteStorage.on('ready', showApp);
  remoteStorage.on('disconnect', hideApp);

  remoteStorage.pictures.init();

  album = remoteStorage.pictures.openPublicAlbum('Camera');

});

/* buttons to take and save pictures from webcam */

$(document).on({
  click: function () {
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
  }
}, '#takePhoto');

$(document).on({
  click: function () {

    var c = document.getElementById('photo');
    var type = "image/jpeg";
    var value = c.toDataURL(type); // base64encoded picture
    var ab = dataURItoArrayBuffer(value); // arraybuffer picture
    var uuid = remoteStorage.pictures.getUuid().substring(5);
    var filename = uuid + ".jpg";
    $('#photo').fadeOut('slow', function () {
      $('#photo').remove();
    });
    $('#savePhoto').hide();
    $('#album').append('<span id="imagespinner" width="160" height="120"><img src="images/ajax-loader.gif"></span>');
    album.store(type, filename, ab).then(function (url) {
      $('#imagespinner').remove();
      $('#album').append('<a class="fancybox" href="' + url + '" rel="gHost" title="<a href=' + url + ' download=' + filename + ' title=\'Download this picture!\'>Download</a>"><img src="' + url + '"  width="160" height="120" title="' + filename + '"></img></a>').fadeIn('slow');
      return false;
    });
  }
}, '#savePhoto');


function displayPic() {
  album.list().then(function (objects) {
    objects.forEach(function (item) {
      var url = album.getPictureURL(item);
      $('#album').append('<a class="fancybox" href="' + url + '" rel="gHost" title="<a href=' + url + ' download=' + item + ' title=\'Download this picture!\'>Download</a>"><img src="' + url + '" id="' + item + '" width="160" height="120" title="' + item + '"></img></a>');
    });
    $(".fancybox").fancybox();
    $('#spinner').hide();
    $('#takePhoto').show();
  });
}

function showApp() {
  $('#splash').hide();
  $('#info').hide();
  $('#spinner').show();
  init();
  displayPic();
}

function hideApp() {
  stopVideo();
  $('#camerabox').fadeOut('slow', function () {
    $('#album').remove();
    $('#photo').remove();
    $('#splash').fadeIn('slow');
    $('#info').fadeIn('slow');
  });
}

/* HTML5 webcam stuff */

var myStream;

function init() {
  var video = document.getElementById("camFeed");
  if (navigator.getUserMedia) {
    navigator.getUserMedia({
      video: true
    }, function (stream) {
      video.src = stream;
      video.play();
      onSuccess(stream);
    }, onFail);
  } else if (navigator.mozGetUserMedia) {
    navigator.mozGetUserMedia({
      video: true
    }, function (stream) {
      video.mozSrcObject = stream;
      video.play();
      onSuccess(stream);
    }, onFail);

  } else if (navigator.webkitGetUserMedia) {
    navigator.webkitGetUserMedia({
      video: true
    }, function (stream) {
      video.src = window.webkitURL.createObjectURL(stream);
      onSuccess(stream);
    }, onFail);
  } else {
    alert('WebRTC is not available on this browser, so you can\'t take pictures. But you can still browse the pictures already in your remoteStorage.');
  }
}

function onSuccess(stream) {
  myStream = stream;
  $('#camFeed').css({
    'margin-top': '10px',
    'margin-bottom': '20px',
    'box-shadow': '0 0 50px 10px #fff'
  });
  $('#camerabox').fadeIn('slow')
  $('#takePhoto').show();
}

function onFail() {
  alert('Could not connect to your webcam.');
}

function stopVideo() {
  var video = document.getElementById("camFeed");
  if (video) video.pause();
  if (myStream) myStream.stop();
}

function dataURItoArrayBuffer(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  //var bb = new BlobBuilder();
  //bb.append(ab);
  //return bb.getBlob(mimeString);
  return ab;
}
