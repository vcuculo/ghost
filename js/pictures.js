remoteStorage.defineModule('ghost', function(privateClient, publicClient) {
  return {
    name: "gHost",

    dataHints: {
      "module" : "Take and save pictures from your webcam"
    },

    exports: {
      dontSync: function() {
        publicClient.use('', true);
      },
      setPic: function (filename, mimetype, data) {
        return publicClient.storeFile(mimetype, filename, data, false).then(function(){
          return publicClient.getItemURL(filename);
        });
      },
      getPicsListing: function () {
        return publicClient.getListing('').then(function(objects) {
          return objects;
        });
      },
      getPicURL: function (item) {
        return publicClient.getItemURL(item);
      },
      getUuid: function () {
        return publicClient.uuid();
      }
    }
  };
});
