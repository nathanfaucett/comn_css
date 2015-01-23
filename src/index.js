var map = require("map"),
    forEach = require("for_each"),

    parseDependencyTree = require("parse_dependency_tree");


module.exports = comnCSS;


function comnCSS(index, options) {
    var graph;

    options = options || {};
    options.exts = ["less", "css"];
    options.packageType = "style";
    options.includeNames = "\\@import\\s*(?:\\(.*?\\))?\\s*";
    options.useBraces = false;
    options.encoding = options.encoding || "utf-8";
    options.beforeParse = beforeParse;

    graph = parseDependencyTree(index, options);

    forEach(graph.array, function(dependency) {
        dependency.content = dependency.content.replace(graph.reInclude, function() {
            return "";
        });
    });

    return render(graph.array);
}

function beforeParse(content, cleanContent, dependency) {
    dependency.content = content;
    return cleanContent;
}

function render(dependencies) {
    return map(reverse(dependencies), renderDependency).join("\n");
}

function renderDependency(dependency) {
    return dependency.content;
}

function reverse(array) {
    var i = array.length,
        results = new Array(i),
        j = 0;

    while (i--) {
        results[j++] = array[i];
    }

    return results;
}
