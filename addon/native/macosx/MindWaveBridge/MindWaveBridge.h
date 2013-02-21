/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef __MindWaveBridge__MindWaveBridge__
#define __MindWaveBridge__MindWaveBridge__

int readPackets(void);
float getValue(int type);
int openMindWave(char* portname, char* thinkGearBundlePath, char** error);

#endif /* defined(__MindWaveBridge__MindWaveBridge__) */
