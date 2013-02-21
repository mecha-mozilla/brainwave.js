/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include <Foundation/Foundation.h>
#include <CoreFoundation/CoreFoundation.h>
#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>
#include "MindWaveBridge.h"

/** * Baud rate for use with TG_Connect() and TG_SetBaudrate(). */
#define TG_BAUD_1200 1200
#define TG_BAUD_2400 2400
#define TG_BAUD_4800 4800
#define TG_BAUD_9600 9600
#define TG_BAUD_57600 57600
#define TG_BAUD_115200 115200

/** * Data format for use with TG_Connect() and TG_SetDataFormat(). */
#define TG_STREAM_PACKETS 0
#define TG_STREAM_5VRAW 1
#define TG_STREAM_FILE_PACKETS 2

/** * Data type that can be requested from TG_GetValue(). */
#define TG_DATA_BATTERY 0
#define TG_DATA_POOR_SIGNAL 1
#define TG_DATA_ATTENTION 2
#define TG_DATA_MEDITATION 3
#define TG_DATA_RAW 4
#define TG_DATA_DELTA 5
#define TG_DATA_THETA 6
#define TG_DATA_ALPHA1 7
#define TG_DATA_ALPHA2 8
#define TG_DATA_BETA1 9
#define TG_DATA_BETA2 10
#define TG_DATA_GAMMA1 11
#define TG_DATA_GAMMA2 12


//compile as .m , because some prefix is added to symbol in object
/*
 nm libMindWaveBridge.dylib
 .cpp
 0000000000000d30 T __Z11readPacketsv
 0000000000000ab0 T __Z12openMindWavePcPS_
 0000000000000a60 T __Z13closeMindWavei
 0000000000000d50 T __Z8getValuei
 
 .m
 0000000000000a30 T _closeMindWave
 0000000000000d50 T _getValue
 0000000000000a80 T _openMindWave
 0000000000000d30 T _readPackets
 
 */

static int connection_id = -1; // ThinkGear connection handle

static int (*TG_GetDriverVersion)() = NULL;
static int (*TG_GetNewConnectionId)() = NULL;
static int (*TG_Connect)(int, const char *, int, int) = NULL;
static int (*TG_ReadPackets)(int, int) = NULL;
static float (*TG_GetValue)(int, int) = NULL;
static int (*TG_Disconnect)(int) = NULL;
static void (*TG_FreeConnection)(int) = NULL;

void closeMindWave(int sig) {
    if (connection_id != -1) {
        TG_Disconnect(connection_id);
        TG_FreeConnection(connection_id);
    }
}

int openMindWave(char* portname, char* thinkGearBundlePath, char** error) {
    printf("openMindWave\n");
    if (connection_id != -1) {
        closeMindWave(0);
    }
    printf("openMindWave 1\n");
    signal(SIGINT, closeMindWave);
    
    //find the functions
    printf("openMindWave 2\n");
    NSString* bundleString = [NSString stringWithCString: thinkGearBundlePath encoding:NSUTF8StringEncoding];
    CFURLRef bundleURL = CFURLCreateWithFileSystemPath(
                                              kCFAllocatorDefault,
                                              (CFStringRef)bundleString,
                                              kCFURLPOSIXPathStyle,
                                              true);
    NSLog( @"openMindWave 3[%@]", bundleURL );
    CFBundleRef thinkGearBundle = CFBundleCreate(kCFAllocatorDefault, bundleURL);
    if (!thinkGearBundle) {
        sprintf(*error, "Error: Could not find ThinkGear.bundle. Does it exist in the current directory?");
        return -1;
    }
    printf("openMindWave 4\n");
    
    TG_GetDriverVersion =
        (int(*)()) CFBundleGetFunctionPointerForName(
                    thinkGearBundle,CFSTR("TG_GetDriverVersion"));
    TG_GetNewConnectionId =
        (int(*)()) CFBundleGetFunctionPointerForName(
                    thinkGearBundle,CFSTR("TG_GetNewConnectionId"));
    TG_Connect =
        (int(*)(int, const char *, int, int)) CFBundleGetFunctionPointerForName(
                    thinkGearBundle,CFSTR("TG_Connect"));
    TG_ReadPackets =
        (int(*)(int, int)) CFBundleGetFunctionPointerForName(
                    thinkGearBundle,CFSTR("TG_ReadPackets"));
    TG_GetValue =
        (float(*)(int, int)) CFBundleGetFunctionPointerForName(
                    thinkGearBundle,CFSTR("TG_GetValue"));
    TG_Disconnect =
        (int(*)(int)) CFBundleGetFunctionPointerForName(
                    thinkGearBundle,CFSTR("TG_Disconnect"));
    TG_FreeConnection =
        (void(*)(int)) CFBundleGetFunctionPointerForName(
                    thinkGearBundle,CFSTR("TG_FreeConnection"));
    
    if ( !TG_GetDriverVersion ||
        !TG_GetNewConnectionId ||
        !TG_Connect ||
        !TG_ReadPackets ||
        !TG_GetValue ||
        !TG_Disconnect ||
        !TG_FreeConnection) {
        sprintf(*error, "Error: Expected functions in ThinkGear.bundle were not found.");
        return -1;
    }
    
    printf("openMindWave 5\n");
    //make connection
    int connectionID = TG_GetNewConnectionId();
    printf("openMindWave 6\n");
    int retVal = TG_Connect(connectionID, portname, TG_BAUD_9600, TG_STREAM_PACKETS);
    printf("openMindWave 7\n");
    if (retVal) {
        sprintf(*error, "unable to connect. (%d)", retVal);
        return -1;
    }
    connection_id = connectionID;
    printf("connection_id %d\n", connection_id);
    return 0;
}

int readPackets(void) {
    return TG_ReadPackets(connection_id, -1);
}

float getValue(int type) {
    return TG_GetValue(connection_id, type);
}