"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
function validateVar(_a) {
    var spec = _a.spec, name = _a.name, rawValue = _a.rawValue;
    var value = spec._parse(rawValue);
    if (value == null) {
        console.log("environment: " + name + " unset");
        process.exit(0);
    }
    return value;
}
var readRawEnvValue = function (env, k) {
    return env[k];
};
function getSanitizedEnv(environment, specs) {
    var _a;
    var cleanedEnv = {};
    var varKeys = Object.keys(specs);
    for (var _i = 0, varKeys_1 = varKeys; _i < varKeys_1.length; _i++) {
        var k = varKeys_1[_i];
        var spec = specs[k];
        var rawValue = (_a = readRawEnvValue(environment, k)) !== null && _a !== void 0 ? _a : undefined;
        if (rawValue === undefined) {
            console.log("environment: " + k + " unset");
            process.exit(0);
        }
        else {
            cleanedEnv[k] = validateVar({ name: k, spec: spec, rawValue: rawValue });
        }
    }
    return cleanedEnv;
}
function str() {
    return {
        _parse: function (input) {
            if (typeof input === "string")
                return input;
            throw new Error("Not a string: \"" + input + "\"");
        },
    };
}
var env = getSanitizedEnv(process.env, {
    PORT: str(),
    NODE_ENV: str(),
});
exports.env = env;
