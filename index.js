"use strict";

const commandLineArgs = require('command-line-args');
const usage = require('command-line-usage');

module.exports = function(configFileName) {
    var config = require("./" + configFileName);

    var printUsage = function() {
        console.log(usage(config));
        process.exit(1);
    }

    config[1].optionList.forEach((opt) => {
        if (opt.typeLabel) {
            opt.type = eval(opt.typeLabel)
        }
    });

    var options;

    try {
        options = commandLineArgs(config[1].optionList);
    } catch (err) {
        printUsage();
    }

    if (options.help) {
        printUsage();
    }

    for (var k in options) {
        var opt = options[k];
        if (opt && opt.name && process.env[opt.name]) {
            options[opt.name] = process.env[opt.name];
        }
    }

    return options;
}
