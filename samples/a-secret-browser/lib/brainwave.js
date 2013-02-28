/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const {Cc,Ci,Cr} = require("chrome");
const jsonParser = Cc["@mozilla.org/dom/json;1"].createInstance(Ci.nsIJSON);

var transport;
var istream;
var brainwave;

exports.open = function() {
    var socketService = Cc["@mozilla.org/network/socket-transport-service;1"]
    .getService(Ci.nsISocketTransportService);
    transport = socketService.createTransport(null, 0, "127.0.0.1", 13854, null);

    //if enableRawOutput is true, JSON format is wrong...
    var parameter = "{'enableRawOutput': false, 'format': 'Json'}";
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
    if (availableBytes > 0) {
        var rdata = istream.read(availableBytes); 
        try {
            brainwave = jsonParser.decode(rdata);
            if (brainwave.eSense && brainwave.eegPower) {
            } else {
                availableBytes = 0;
            }
        } catch (e) {
            console.log(e);
            availableBytes = 0;
        }
    }
 
    return availableBytes;
}

//Sense -----------------------------------------------
exports.getAttention = function() {
    return brainwave.eSense.attention;
}

exports.getMeditation = function() {
    return brainwave.eSense.meditation;
}

//EEG -------------------------------------------------
exports.getDelta = function() {
    return brainwave.eegPower.delta;
}

exports.getTheta = function() {
    return brainwave.eegPower.theta;
}

exports.getLowAlpha = function() {
    return brainwave.eegPower.lowAlpha;
}

exports.getHighAlpha = function() {
    return brainwave.eegPower.highAlpha;
}

exports.getLowBeta = function() {
    return brainwave.eegPower.lowBeta;
}

exports.getHighBeta = function() {
    return brainwave.eegPower.highBeta;
}

exports.getLowGamma = function() {
    return brainwave.eegPower.lowGamma;
}

exports.getHighGamma = function() {
    return brainwave.eegPower.highGamma;
}

exports.close = function() {
    istream.close();
    transport.close(0);
}