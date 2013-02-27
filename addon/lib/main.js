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
        console.log(attention+" "+meditation);
    } else {
        //console.log("0 packet.");
    }
    timers.setTimeout(observe, 100);
}
observe();