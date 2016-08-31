"use strict";

const commandLineArgs = require('command-line-args');
const usage = require('command-line-usage');
const util = require('util');

function isUndef(x) {
    return (typeof x === 'undefined');
}

function toBool(x) {
    if (util.isNullOrUndefined(x)) {
        return true;
    }
    if (typeof x === "boolean") {
        return x;
    }
    return x.toLowerCase() == "true";
}

module.exports = function(configFileName) {
    var config = require("./" + configFileName);

    var printUsage = function() {
        console.log(usage(config));
        process.exit(1);
    }

    config[1].optionList.forEach((opt) => {
        if (opt.typeLabel) {
            if (opt.typeLabel == "Flag") {
                opt.type = String
                opt.bool = true;
            } else {
                opt.type = eval(opt.typeLabel)
            }
            if (!isUndef(process.env[opt.name])) {
                if (opt.typeLabel == "Flag") {
                    opt.defaultValue = toBool(process.env[opt.name]);
                } else if (opt.typeLabel == "Boolean") {
                    opt.defaultValue = true;
                } else {
                    opt.defaultValue = process.env[opt.name];
                }
            }
        }
    });

    var options;

    try {
        options = commandLineArgs(config[1].optionList);
    } catch (err) {
        printUsage();
    }

    // for (var k in options) {
    //     var opt = options[k];
    //     if (opt && process.env[opt.name]) {
    //         options[opt.name] = process.env[opt.name];
    //     }
    //     if (opt && opt.bool) {
    //         options[opt.name] = (options[opt.name].toLowerCase() == "true");
    //     }
    // }

    if (options.help) {
        printUsage();
    }

    config[1].optionList.forEach((opt) => {
        if (opt.typeLabel) {
            if (opt.typeLabel == "Flag") {
                if (!isUndef(options[opt.name])) {
                    options[opt.name] = toBool(options[opt.name]);
                }
            }
        }
    });

    return options;
}
