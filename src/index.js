var resolve = require("resolve"),
    extend = require("extend"),
    isFunction = require("is_function"),
    DependencyTree = require("dependency_tree");


module.exports = comnCSS;


function comnCSS(index, options, callback) {
    var tree;

    if (isFunction(options)) {
        callback = options;
        options = {};
    }

    options = options || {};

    options.extensions = options.extensions || ["less", "css"];
    options.packageType = "style";
    options.useBraces = false;
    options.parseAsync = false;
    options.functionNames = "\\@import\\s*(?:\\(.*?\\))?\\s*";
    options.maxUseTimes = 100;

    tree = new DependencyTree(index, options);
    extend(options, tree.options);

    tree.parse(function onParse(error) {
        var chunk;

        if (error) {
            callback(error);
        } else {
            chunk = tree.chunks[0];

            if (chunk && chunk.dependencies[0]) {
                replaceImports(chunk.dependencies[0], tree, options, callback);
            } else {
                callback(new Error("No start file found " + index));
            }
        }
    });
}

function replaceImports(dependency, tree, options, callback) {
    var out = "",
        error;

    try {
        out = baseReplaceImports(dependency, tree, options);
    } catch (e) {
        error = e;
    }

    if (error) {
        callback(error);
    } else {
        callback(undefined, out);
    }
}

function baseReplaceImports(dependency, tree, options) {
    var dependencyHash = tree.dependencyHash;

    dependency.used = (dependency.used || 0) + 1;

    return dependency.content.replace(options.reInclude, function onReplace(match, includeName, functionName, dependencyPath) {
        var resolved = resolve(dependencyPath, dependency.fullPath, options),
            id = resolved ? resolved.fullPath : false,
            dep = id ? dependencyHash[id] : null;

        if (dep.used > options.maxUseTimes) {
            throw new Error(
                "comn css " + dep.fullPath + " reach limit of use times (" + options.maxUseTimes + ") this could be\n" +
                "    due to recursive dependencies, or if your using the file that many times set the maxUseTimes in the\n" +
                "    options to something higher"
            );
        } else {
            if (dep) {
                return baseReplaceImports(dep, tree, options);
            } else {
                return "";
            }
        }
    });
}
