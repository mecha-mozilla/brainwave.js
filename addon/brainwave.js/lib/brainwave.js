/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const {Cu, Ci, Cc} = require("chrome");
const { ctypes } = Cu.import("resource://gre/modules/ctypes.jsm");
const self = require("self");
const url = require("url");

const dylibURL = require("self").data.url(ctypes.libraryName('MindWaveBridge'));
const dylibPATH = url.toFilename(dylibURL).toString();
const dylib = ctypes.open(dylibPATH);  

const openMindWave = dylib.declare("openMindWave",       /* function name */  
                          ctypes.default_abi,    /* ABI type */  
                          ctypes.int32_t,       /* return type */  
                          ctypes.char.ptr, /* parameter */
                          ctypes.char.ptr, /* parameter */
                          new ctypes.PointerType(ctypes.char.ptr)
                          );

const readPackets = dylib.declare("readPackets",
                          ctypes.default_abi,
                          ctypes.int32_t
                          );

const getValue = dylib.declare("getValue",
                          ctypes.default_abi,
                          ctypes.float32_t,
                          ctypes.int32_t
                          );

exports.TYPE_BATTERY = 0;
exports.TYPE_POOR_SIGNAL = 1;
exports.TYPE_ATTENTION = 2;
exports.TYPE_MEDITATION = 3;
exports.TYPE_RAW = 4;
exports.TYPE_DELTA = 5;
exports.TYPE_THETA = 6;
exports.TYPE_ALPHA1 = 7;
exports.TYPE_ALPHA2 = 8;
exports.TYPE_BETA1 = 9;
exports.TYPE_BETA2 = 10;
exports.TYPE_GAMMA1 = 11;
exports.TYPE_GAMMA2 = 12;

exports.open = function(portname) {
    const bundleURL = require("self").data.url('ThinkGear.bundle');
    const bundlePATH = url.toFilename(bundleURL).toString();
    console.log(bundlePATH);
    var err = ctypes.char.ptr();
    if ( -1 == openMindWave(portname, bundlePATH, err.address()) ) {
        throw err.readString(); 
    }
}

exports.readPackets = function() {
    return readPackets();
}

exports.getValue = function(type) {
    return getValue(type);
}
