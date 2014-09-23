var jade = require('jade'),
    path = require('path'),
    fn = jade.compileFile(path.resolve('./lib/menu.jade'));

module.exports = function(file, t) {
    var fileContents = file.contents.toString();
    var locals = JSON.parse(fileContents);
    var html = fn(locals);
    file.contents = new Buffer(html);
};
