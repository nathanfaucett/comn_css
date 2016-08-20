var resolve = require("@nathanfaucett/resolve"),
    extend = require("@nathanfaucett/extend"),
    DependencyTree = require("@nathanfaucett/dependency_tree"),
    getDependencyId = require("@nathanfaucett/dependency_tree/src/utils/getDependencyId");


module.exports = comnCSS;


function comnCSS(index, options) {
    var tree;

    options = options || {};

    options.extensions = options.extensions || ["less", "css"];
    options.packageType = "style";
    options.useBraces = false;
    options.parseAsync = false;
    options.functionNames = "\\@import\\s*(?:\\(.*?\\))?\\s*";
    options.maxUseTimes = 100;

    tree = new DependencyTree(index, options);
    extend(options, tree.options);

    tree.parse();

    chunk = tree.chunks[0];

    if (chunk && chunk.dependencies[0]) {
        return replaceImports(chunk.dependencies[0], tree, options);
    } else {
        throw new Error("Something weird happened with dependency tree parser");
    }
}

function replaceImports(dependency, tree, options) {
    var out = "",
        error;

    try {
        out = baseReplaceImports(dependency, tree, options);
    } catch (e) {
        error = e;
    }

    return out;
}

function baseReplaceImports(dependency, tree, options) {
    var dependencyHash = tree.dependencyHash;

    dependency.used = (dependency.used || 0) + 1;

    return dependency.content.replace(options.reInclude, function onReplace(match, includeName, functionName, dependencyPath) {
        var resolved = resolve(dependencyPath, dependency.fullPath, options),
            resolvedModule = resolved.pkg ? resolved : dependency.module,
            id = resolved ? getDependencyId(resolved, resolvedModule) : false,
            dep = id ? dependencyHash[id] : false;

        if (dep && dep.used > options.maxUseTimes) {
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
