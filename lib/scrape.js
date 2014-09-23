var through = require('through2'),
    gutil = require('gulp-util'),
    request = require('request'),
    PluginError = gutil.PluginError;

pushJsonFile = function(self, file, done) {
    return function(json) {
        self.push(new gutil.File({path: file.path, contents: new Buffer(JSON.stringify(json, null, 2))}))
        done();
    };
};

module.exports = function() {

    var stream = through.obj(function(file, enc, done) {
        var scraper = require(file.path),
            completeJsonFile = pushJsonFile(this, file, done);

        if (scraper.url && scraper.scrape) {
            request(scraper.url, function(err, res, body) {
                if (err) {
                    throw new PluginError("lib/download", err);
                }
                completeJsonFile(scraper.scrape(body))
            });
        } else {
            this.push(file);
            done();
        }
    });

    return stream;

};
