/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const {Cc,Ci,Cr} = require("chrome");
const windows = require("window-utils");
const brainwave = require("brainwave.js");
const timers = require("timers");

const OPACITY_DELTA = 0.01;
var current_opacity = 0;
var target_opacity = 0;

function observe() {
    var packetCount = brainwave.readPackets();
    if (packetCount > 0) {
        target_opacity = brainwave.getAttention() / 100;
    }
    if (target_opacity > current_opacity) {
        current_opacity += OPACITY_DELTA;
        if (current_opacity > 1) {
            current_opacity = 1;
        }
    } else {
        current_opacity -= OPACITY_DELTA;
        if (current_opacity < 0) {
            current_opacity = 0;
        }
    }
    windows.activeWindow.gBrowser.setAttribute("style", "opacity:"+current_opacity+";");
    timers.setTimeout(observe, 20);
}

brainwave.open();
observe();