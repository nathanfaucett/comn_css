var map = require("map"),
    forEach = require("for_each"),
    filePath = require("file_path"),
    resolve = require("resolve"),
    parseDependencyTree = require("parse_dependency_tree");


module.exports = comnCSS;


function comnCSS(index, options) {
    var graph, array, order;

    options = options || {};
    options.exts = ["less", "css"];
    options.packageType = "style";
    options.includeNames = "\\@import\\s*(?:\\(.*?\\))?\\s*";
    options.useBraces = false;
    options.encoding = options.encoding || "utf-8";
    options.beforeParse = beforeParse;

    graph = parseDependencyTree(index, options);
    hash = graph.hash;
    array = graph.array;
    order = 1;

    forEach(array, function(dependency) {
        var parentDir = filePath.dir(dependency.fullPath);

        dependency.order = dependency.order || order++;

        dependency.content = dependency.content.replace(graph.reInclude, function(match, fnType, dependencyPath) {
            var opts = resolve(dependencyPath, parentDir, options),
                id = opts && (opts.moduleName ? opts.moduleName : opts.fullPath) || false,
                dependency = id ? hash[id] : null;

            if (dependency) {
                dependency.order = dependency.order || order++;
            }

            return "";
        });
    });

    array.sort(sortFn);

    return render(array);
}

function sortFn(a, b) {
    return b.order - a.order;
}

function beforeParse(content, cleanContent, dependency) {
    dependency.content = content;
    return cleanContent;
}

function render(dependencies) {
    return map(dependencies, renderDependency).join("\n");
}

function renderDependency(dependency) {
    return dependency.content;
}
