var filePath = require("file_path"),
    resolve = require("resolve"),
    parseDependencyTree = require("parse_dependency_tree");


module.exports = comnCSS;


function comnCSS(index, options) {
    var tree;

    options = options || {};

    options.exts = options.exts || ["less", "css"];
    options.packageType = "style";
    options.includeNames = "\\@import\\s*(?:\\(.*?\\))?\\s*";
    options.useBraces = false;
    options.beforeParse = beforeParse;

    tree = parseDependencyTree(index, options);
    return replaceImports(tree.root, tree);
}

function replaceImports(dependency, tree) {
    var options = tree.options,
        childHash = tree.childHash,
        parentDir = filePath.dir(dependency.fullPath);

    dependency.used = true;

    return dependency.content.replace(options.reInclude, function(match, includeName, functionName, dependencyPath) {
        var opts = resolve(dependencyPath, parentDir, options),
            id = opts ? (opts.moduleName ? opts.moduleName : opts.fullPath) : false,
            dep = id ? childHash[id] : null;

        if (dep && !dep.used) {
            return replaceImports(dep, tree);
        }

        return "";
    });
}

function beforeParse(content, cleanContent, dependency) {
    dependency.content = content;
    return cleanContent;
}
