var filePath = require("file_path"),
    resolve = require("resolve"),
    parseDependencyTree = require("parse_dependency_tree");


module.exports = comnCSS;


function comnCSS(index, options) {
    var graph;

    options = options || {};

    options.exts = options.exts || ["less", "css"];
    options.packageType = "style";
    options.includeNames = "\\@import\\s*(?:\\(.*?\\))?\\s*";
    options.useBraces = false;
    options.encoding = options.encoding || "utf-8";
    options.beforeParse = beforeParse;

    graph = parseDependencyTree(index, options);

    return replaceImports(graph.array[0], graph);
}

function replaceImports(dependency, graph) {
    var options = graph.options,
        hash = graph.hash,
        parentDir = filePath.dir(dependency.fullPath);

    dependency.used = true;

    return dependency.content.replace(graph.reInclude, function(match, fnType, dependencyPath) {
        var opts = resolve(dependencyPath, parentDir, options),
            id = opts && (opts.moduleName ? opts.moduleName : opts.fullPath) || false,
            dep = id ? hash[id] : null;

        if (dep && !dep.used) {
            return replaceImports(dep, graph);
        }

        return "";
    });
}

function beforeParse(content, cleanContent, dependency) {
    dependency.content = content;
    return cleanContent;
}
