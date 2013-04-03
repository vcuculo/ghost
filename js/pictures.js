remoteStorage.defineModule('pictures', function(privateClient, publicClient) {
  return {
    name: "pictures",

    dataHints: {
      "module" : "Picture module needs a definition, here!"
    },

    exports: {
      dontSync: function() {
        privateClient.use('', true);
        publicClient.use('', true);
      },
      setPic: function (filename, mimetype, data) {
        var path = 'albums/' + filename;
        return publicClient.storeFile(mimetype, path, data, false).then(function(){
          return publicClient.getItemURL(path);
        });
      },
      getPicsListing: function (folder) {
        return publicClient.getListing('albums/' + folder).then(function(objects) {
          return objects;
        });
      },
      getPicURL: function (item) {
        return publicClient.getItemURL('albums/' + item);
      },
      getUuid: function () {
        return publicClient.uuid();
      }
    }
  };
});
