//
//  RosterAttendee.swift
//  ConferenceApplication
//
//  Created by Hassan Aljanahi on 6/9/20.
//  Copyright © 2020 Hassan Aljanahi. All rights reserved.
//

import AmazonChimeSDK
import Foundation

public class RosterAttendee {
    let attendeeId: String
    let attendeeName: String?
    var volume: VolumeLevel
    var signal: SignalStrength

    init(attendeeId: String, attendeeName: String, volume: VolumeLevel, signal: SignalStrength) {
        self.attendeeId = attendeeId
        self.attendeeName = attendeeName
        self.volume = volume
        self.signal = signal
    }
}
