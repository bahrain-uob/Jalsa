// Copyright 2019-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0


exports.join = async(event, context) => {
  const query = event.queryStringParameters;
  if (!query.title || !query.name || !query.region || !query.role) {
    return response(400, 'application/json', JSON.stringify({error: 'Need parameters: title, name, region'}));
  }
  const id =  `${uuid().substring(0, 8)}#${query.name}`;
  // Look up the meeting by its title. If it does not exist, create the meeting.
  let meeting = await getMeeting(query.title);
  if (!meeting) {
    const request = {
      // Use a UUID for the client request token to ensure that any request retries
      // do not create multiple meetings.
      ClientRequestToken: uuid(),

      // Specify the media region (where the meeting is hosted).
      // In this case, we use the region selected by the user.
      MediaRegion: query.region,

      // Set up SQS notifications if being used
      NotificationsConfiguration: useSqsInsteadOfEventBridge ? { SqsQueueArn: sqsQueueArn } : {},

      // Any meeting ID you wish to associate with the meeting.
      // For simplicity here, we use the meeting title.
      ExternalMeetingId: query.title.substring(0, 64),
    };
    console.info('Creating new meeting: ' + JSON.stringify(request));
    meeting = await chime.createMeeting(request).promise();

    // Store the meeting in the table using the meeting title as the key.
  


  }

  // Create new attendee for the meeting
  console.info('Adding new attendee');
  const attendee = (await chime.createAttendee({
    // The meeting ID of the created meeting to add the attendee to
    MeetingId: meeting.Meeting.MeetingId,

    // Any user ID you wish to associate with the attendeee.
    // For simplicity here, we use a random UUID for uniqueness
    // combined with the name the user provided, which can later
    // be used to help build the roster.
    ExternalUserId: `${uuid().substring(0, 8)}#${query.name}`.substring(0, 64),
  }).promise());


const attendees = { id : false } 
  if(query.role == "P"){

     
     await putPresenters(attendees, query.title)
  } else {
    await putAttendees(attendees, query.title)

  }

  // Return the meeting and attendee responses. The client will use these
  // to join the meeting.
  return response(200, 'application/json', JSON.stringify({
    JoinInfo: {
      Meeting: meeting,
      Attendee: attendee,
    },
  }, null, 2));
};

