import { Injectable } from '@angular/core';
import VoxeetSDK from '@voxeet/voxeet-web-sdk'
export interface conference {
  alias: string;
  id?: string;
  isNew?: boolean;
  params?: conferenceParams;
  pinCode?: string;
  status?: 'created|destroyed|ended|error|joined|left'
}
export interface conferenceParams {
  dolbyVoice?: boolean;
  liveRecording?: boolean;
  rtcpMode?: 'worst|average|max'
  ttl?: number;
  videoCodec?: 'H264|VP8';
}
export interface JoinOptions {
  constraints?: any;
  mixing?: any;
  preferRecvMono?: boolean;
  preferSendMono?: boolean;
  simulcast?: boolean;
}

export interface ParticipantInfo {
  avatarUrl?:string;
  externalId?:string;
  name?:string;
}


@Injectable({
  providedIn: 'root'
})
export class DolbyService {
  voxeet
  constructor() {
    this.init();
  }

  private async init() {
    let cid = 'NWaN-nUaqbNb-ZI-CvDI-A==';
    let cs = 'bHXfDXCZQWkhw0RsUJhC66gPfYAPrX8vCNYVb-xGhJs=';
    await VoxeetSDK.initialize(cid, cs);
    console.log('loaded voxeet');
  }

  async openSession(options: ParticipantInfo){
    await VoxeetSDK.session.open(options);
  }

  async createConference(option: conference) {
    return await VoxeetSDK.conference.create(option)
  }

  async joinConference(conference: any, options: JoinOptions) {
    return await VoxeetSDK.conference.join(conference, options);
  }

  async fetchConference(conferenceId: string) {
    debugger;
    return await VoxeetSDK.conference.fetch(conferenceId);
  }

  async demoConference() {
    return await VoxeetSDK.conference.demo();
  }

  startVideo() {

  }

  stopVideo() {

  }

  mute() {

  }

  events(cb: (etype: string, data:any) => void) {
    let events = ["ended", "error", "autoplayBlocked", "joined", "left", "participantAdded", "participantUpdated", "streamAdded", "streamRemoved", "streamUpdated"]
    events.forEach(e => {
      VoxeetSDK.conference.on(e, (participant, stream) => {
        console.log(e);
        cb(e, {
          participant,
          stream
        })
      })
    })
  }











}
