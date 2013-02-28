/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const {Cc,Ci,Cr} = require("chrome");
var brainwave = require("brainwave.js");
var timers = require("timers");

brainwave.open();
function observe() {
    var packetCount = brainwave.readPackets();
    if (packetCount > 0) {
        var attention = brainwave.getAttention();
        var meditation = brainwave.getMeditation();
        var delta = brainwave.getDelta();
        var theta = brainwave.getTheta();
        var lowAlpha = brainwave.getLowAlpha();
        var highAlpha = brainwave.getHighAlpha();
        var lowBeta = brainwave.getLowBeta();
        var highBeta = brainwave.getHighBeta();
        var lowGamma = brainwave.getLowGamma();
        var highGamma = brainwave.getHighGamma();
        console.log("---------------------------------------");
        console.log("attention:"+attention);
        console.log("meditation:"+meditation);
        console.log("delta:"+delta);
        console.log("theta:"+theta);
        console.log("lowAlpha:"+lowAlpha);
        console.log("highAlpha:"+highAlpha);
        console.log("lowBeta:"+lowBeta);
        console.log("highBeta:"+highBeta);
        console.log("lowGamma:"+lowGamma);
        console.log("highGamma:"+highGamma);
    } else {
        //console.log("0 packet.");
    }
    timers.setTimeout(observe, 100);
}
observe();