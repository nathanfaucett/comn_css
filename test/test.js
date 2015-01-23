var fs = require("fs"),
    less = require("less"),
    comnCSS = require("../src/index");


describe("comnCSS(index : FilePath String, options : Object)", function() {
    it("should compile dependencies into one file", function() {
        var str = comnCSS(__dirname + "/lib/index");

        fs.writeFileSync(__dirname + "/lib/index.min.less", str);

        less.render(str, function(err, out) {
            if (err) {
                throw err;
            }

            fs.writeFileSync(__dirname + "/lib/index.min.css", out.css);
        });
    });
});
