var fs = require('fs'),
  util = require('util'),
  im = require('imagemagick');

var srcFolder = "tiff-folder/",
  dstFolder = "jpeg-folder/",
  keepSrcImg = true; // keep or remove the src image after convert

fs.exists(srcFolder, function(exists) {
  if (!exists) return console.log('ERROR! srcFolder not found.');
});

fs.exists(dstFolder, function(exists) {
  if (!exists) return console.log('ERROR! dstFolder not found.');
});

fs.watch(srcFolder, function(event, filename) {
  var srcImg = srcFolder + filename;

  fs.exists(srcImg, function(exists) {
    if (!exists) return false;

    //
    var fileParts = filename.split('.');
    var imgExt = fileParts.pop();

    if (imgExt.match(/(tif|tiff)$/)) {
      var srcImg = srcFolder + filename;

      var name = fileParts.pop(),
        dstImg = dstFolder + name + '.jpg';

      // https://github.com/rsms/node-imagemagick
      im.convert([srcImg, dstImg],
        function(err, stdout) {
          if (!err) {
            // remove the src file if keepSrcImg is false
            if (!keepSrcImg) {
              fs.unlink(srcImg, function(err) {
                if (err) util.puts(err);
              });
            }
          } else {
            util.puts(err); // output convert error
          }
        });
    }
  });
});

util.puts('> Convert service started.');