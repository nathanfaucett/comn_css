#!/usr/bin/env node

var comnCSS = require(".."),
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


comnCSS(options.file, function onComnCSS(error, out) {
    if (error) {
        throw error;
    } else {
        if (!!options.less) {
            less.render(out, function(error, lessOut) {
                if (error) {
                    throw error;
                } else {
                    fileUtils.writeFileSync(options.out, lessOut.css);
                }
            });
        } else {
            fileUtils.writeFileSync(options.out, out);
        }
    }
});
