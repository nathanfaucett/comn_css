#!/usr/bin/env node

var comnCSS = require("../src/index"),
    fileUtils = require("file_utils"),
    less = require("less"),
    argv = require("argv");


var options = argv({
    file: ["f", "start file", "string"],
    out: ["o", "out file", "string"],
    less: ["l", "less output file", "boolean"]
}).parse();

if (!options.file) {
    throw new Error("input file require");
}
if (!options.out) {
    throw new Error("out file require");
}


var str = comnCSS(options.file);


if (!!options.less) {
    less.render(str, function(err, out) {
        if (err) {
            throw err;
        }

        fileUtils.writeFileSync(options.out, out.css);
    });
} else {
    fileUtils.writeFileSync(options.out, str);
}
