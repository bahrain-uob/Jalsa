//
//  JoinMeetingResponse.swift
//  ConferenceApplication
//
//  Created by sara adel on 6/10/20.
//  Copyright © 2020 Hassan Aljanahi. All rights reserved.
//

import Foundation

struct CreateMediaPlacementInfo: Codable {
    var audioFallbackUrl: String
    var audioHostUrl: String
    var signalingUrl: String
    var turnControlUrl: String

    enum CodingKeys: String, CodingKey {
        case audioFallbackUrl = "AudioFallbackUrl"
        case audioHostUrl = "AudioHostUrl"
        case signalingUrl = "SignalingUrl"
        case turnControlUrl = "TurnControlUrl"
    }
}

struct CreateMeetingInfo: Codable {
    var externalMeetingId: String
    var mediaPlacement: CreateMediaPlacementInfo
    var mediaRegion: String
    var meetingId: String

    enum CodingKeys: String, CodingKey {
        case externalMeetingId = "ExternalMeetingId"
        case mediaPlacement = "MediaPlacement"
        case mediaRegion = "MediaRegion"
        case meetingId = "MeetingId"
    }
}

struct CreateAttendeeInfo: Codable {
    var attendeeId: String
    var externalUserId: String
    var joinToken: String

    enum CodingKeys: String, CodingKey {
        case attendeeId = "AttendeeId"
        case externalUserId = "ExternalUserId"
        case joinToken = "JoinToken"
    }
}

struct CreateMeeting: Codable {
    var meeting: CreateMeetingInfo

    enum CodingKeys: String, CodingKey {
        case meeting = "Meeting"
    }
}

struct CreateAttendee: Codable {
    var attendee: CreateAttendeeInfo

    enum CodingKeys: String, CodingKey {
        case attendee = "Attendee"
    }
}

struct CreateJoinInfo: Codable {
    var meeting: CreateMeeting
    var attendee: CreateAttendee

    enum CodingKeys: String, CodingKey {
        case meeting = "Meeting"
        case attendee = "Attendee"
    }
}

struct JoinMeetingResponse: Codable {
    var joinInfo: CreateJoinInfo

    enum CodingKeys: String, CodingKey {
        case joinInfo = "JoinInfo"
    }
}
