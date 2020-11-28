//
//  ViewController.swift
//  ConferenceApplication
//
//  Created by Hassan Aljanahi on 6/11/20.
//  Copyright © 2020 Hassan Aljanahi. All rights reserved.
//

import AmazonChimeSDK
import AVFoundation
import UIKit

class ViewController: UIViewController, UITextFieldDelegate, UIPickerViewDelegate, UIPickerViewDataSource {
   
    var meetingID = ""
    var name = ""
    let logger = ConsoleLogger(name: "ViewController")

    @IBOutlet var meetingIDText: UITextField!
    @IBOutlet var nameText: UITextField!
    @IBOutlet var joinButton: UIButton!
    @IBOutlet var versionLabel: UILabel!

    @IBOutlet var Roles: UIPickerView!
    
    let pickerData = ["Moderator", "Presenter", "Attendee"]
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        self.view.endEditing(true)
        return false
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        versionLabel.text = "amazon-chime-sdk-ios@\(Versioning.sdkVersion())"
        meetingIDText.delegate = self
        nameText.delegate = self
        
        Roles.dataSource = self
        Roles.delegate = self
        
    }

    override func viewWillAppear(_ animated: Bool) {
        joinButton.isEnabled = true
    }

    private func urlRewriter(url: String) -> String {
        // changing url
        // return url.replacingOccurrences(of: "example.com", with: "my.example.com")
        return url
    }
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
       }
       
       func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return pickerData.count
       }
    
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return pickerData[row]
    }
       
    @IBAction func joinMeeting(sender: UIButton) {
        meetingID = meetingIDText.text ?? ""
        name = nameText.text ?? ""
        joinButton.isEnabled = false
        postRequest(completion: { data, error in
            guard error == nil else {
                DispatchQueue.main.async {
                 
                    self.joinButton.isEnabled = true
                }
                return
            }

            if let data = data {
                let (meetingResp, attendeeResp) = self.processJson(data: data)
                guard let currentMeetingResponse = meetingResp, let currentAttendeeResponse = attendeeResp else {
                    return
                }

                let meetingSessionConfig = MeetingSessionConfiguration(createMeetingResponse: currentMeetingResponse,
                                                                       createAttendeeResponse: currentAttendeeResponse,
                                                                       urlRewriter: self.urlRewriter)
                DispatchQueue.main.async {
                    let meetingView = UIStoryboard(name: "Main", bundle: nil)
                    guard let meetingViewController = meetingView.instantiateViewController(withIdentifier: "conferencemain")
                        as? ConferenceRoomViewController else {
                        self.logger.error(msg: "Unable to instantitateViewController")
                        return
                    }
                    meetingViewController.modalPresentationStyle = .fullScreen
                    meetingViewController.meetingSessionConfig = meetingSessionConfig
                    meetingViewController.meetingId = self.meetingIDText?.text!
                    meetingViewController.selfName = self.name
                    self.present(meetingViewController, animated: true, completion: nil)
                }
            }
        })
    }

    private func postRequest(completion: @escaping CompletionFunc) {
        if meetingID.isEmpty || name.isEmpty {
            DispatchQueue.main.async {
               
            }
            return
        }
        
        let i = Roles.selectedRow(inComponent: 0)
        
        let encodedURL = HttpUtils.encodeStrForURL(
            str: "\(AppConfiguration.url)join?title=\(meetingID)&name=\(name)&region=\(AppConfiguration.region)&role=\(pickerData[i].prefix(1).lowercased())"
        )
      
        HttpUtils.postRequest(
            url: encodedURL,
            completion: completion,
            jsonData: nil, logger: logger
        )
    }

    private func processJson(data: Data) -> (CreateMeetingResponse?, CreateAttendeeResponse?) {
        let jsonDecoder = JSONDecoder()
        do {
            let joinMeetingResponse = try jsonDecoder.decode(JoinMeetingResponse.self, from: data)
            let meetingResp = CreateMeetingResponse(meeting:
                Meeting(
                    externalMeetingId: joinMeetingResponse.joinInfo.meeting.meeting.externalMeetingId,
                    mediaPlacement: MediaPlacement(
                        audioFallbackUrl: joinMeetingResponse.joinInfo.meeting.meeting.mediaPlacement.audioFallbackUrl,
                        audioHostUrl: joinMeetingResponse.joinInfo.meeting.meeting.mediaPlacement.audioHostUrl,
                        signalingUrl: joinMeetingResponse.joinInfo.meeting.meeting.mediaPlacement.signalingUrl,
                        turnControlUrl: joinMeetingResponse.joinInfo.meeting.meeting.mediaPlacement.turnControlUrl
                    ),
                    mediaRegion: joinMeetingResponse.joinInfo.meeting.meeting.mediaRegion,
                    meetingId: joinMeetingResponse.joinInfo.meeting.meeting.meetingId
                )
            )
            let attendeeResp = CreateAttendeeResponse(attendee:
                Attendee(attendeeId: joinMeetingResponse.joinInfo.attendee.attendee.attendeeId,
                         externalUserId: joinMeetingResponse.joinInfo.attendee.attendee.externalUserId,
                         joinToken: joinMeetingResponse.joinInfo.attendee.attendee.joinToken))

            return (meetingResp, attendeeResp)
        } catch {
            logger.error(msg: error.localizedDescription)
            return (nil, nil)
        }
    }
}


