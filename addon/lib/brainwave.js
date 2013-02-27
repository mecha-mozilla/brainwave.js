/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const {Cc,Ci,Cr} = require("chrome");

var transport;
var istream;
var rdata;

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

exports.open = function() {
    var socketService = Cc["@mozilla.org/network/socket-transport-service;1"]
    .getService(Ci.nsISocketTransportService);
    transport = socketService.createTransport(null, 0, "127.0.0.1", 13854, null);

    var parameter = "{'enableRawOutput': true, 'format': 'Json'}";
    var ostream = transport.openOutputStream(0,0,0);
    ostream.write(parameter, parameter.length);
    ostream.close();

    var input = transport.openInputStream(0, 0, 0);
    istream = Cc["@mozilla.org/scriptableinputstream;1"]
    .createInstance(Ci.nsIScriptableInputStream);
    istream.init(input);
    
}

exports.readPackets = function() {
    var availableBytes = istream.available();
    rdata = istream.read(availableBytes); 
    console.log(rdata);
    return availableBytes;
}

exports.getValue = function(type) {
}

exports.close = function() {
    istream.close();
    transport.close(0);
}