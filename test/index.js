var tape = require("tape"),
    fs = require("fs"),
    less = require("less"),
    comnCSS = require("..");


tape("comnCSS(index : FilePath String, options : Object[, callback: Function]) ", function(assert) {
    comnCSS(__dirname + "/lib/index.less", function(error, out) {
        if (error) {
            assert.end(error);
        } else {
            fs.writeFileSync(__dirname + "/lib/index.min.less", out);

            less.render(out, function(error, lessOut) {
                if (error) {
                    assert.end(error);
                } else {
                    fs.writeFileSync(__dirname + "/lib/index.min.css", lessOut.css);
                    assert.end();
                }
            });
        }
    });
});
