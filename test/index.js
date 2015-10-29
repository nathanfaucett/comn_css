var tape = require("tape"),
    fs = require("fs"),
    less = require("less"),
    comnCSS = require("..");


tape("comnCSS(index : FilePath String, options : Object) ", function(assert) {
    var out = comnCSS(__dirname + "/lib/index.less");

    fs.writeFileSync(__dirname + "/build/index.min.less", out);

    less.render(out, function(error, lessOut) {
        if (error) {
            assert.end(error);
        } else {
            fs.writeFileSync(__dirname + "/build/index.min.css", lessOut.css);
            assert.end();
        }
    });
});
