import { Injectable } from '@angular/core';
import { DolbyService } from 'src/app/core/dolby/dolby.service';
import { confObj } from '../../../core/interfaces.models/conference.models'

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {
  pCount = 0;

  constructor(private readonly dolbyService: DolbyService) {
  }

  async start(confObj: confObj) {
    this.dolbyService.events(this.eventHandler.bind(this))
    await this.dolbyService.openSession({
      name: confObj.joinAs
    })
    await this.startConference(confObj);
  }

  getConferenceLink(confId: string) {
    return `${location.host}/conference/${confId}`;
  }

  private async startConference(confObj: confObj) {
    let confO = await this.dolbyService.createConference({
      alias: confObj.confName,
      params: {
        liveRecording: false
      }
    });
    let constraint = {
      audio: confObj.mic,
      video: confObj.cam
    }
    await this.joinConf(confO, constraint);
  }

  async joinParticipant(confId: string, confObj: confObj) {
    this.dolbyService.events(this.eventHandler.bind(this))
    await this.dolbyService.openSession({
      name: name
    })
    let confO = await this.dolbyService.fetchConference(confId);
    console.log('fetchConf', confO);
    let constraint = {
      audio: confObj.mic,
      video: confObj.cam
    }
    await this.joinConf(confO, constraint);
  }

  async joinConf(confO: any, constraints: any) {
    let jConfO = await this.dolbyService.joinConference(confO, {
      constraints: constraints
    })
  }

  eventHandler(etype: string, data: any) {
    switch (etype) {
      case 'streamAdded':
        console.log(etype, data)
        this.addParticipantsStreams(data.participant, data.stream)
        break;
      default:
        console.log('default', etype, data)
        break;
    }

  }

  row = 0;
  addParticipantsStreams(p: any, stream: MediaStream) {
    let pNode = document.getElementById('p-' + p.id);
    console.log('pNode', p.id);
    if (!pNode) {
      let conf = document.getElementById('video-conf');
      let vNode = document.createElement('video');
      vNode.setAttribute('id', 'p-' + p.id);
      vNode.setAttribute('class', 'v-class');
      vNode.srcObject = stream;
      vNode.onloadeddata = () => {
        vNode.muted = true;
        vNode.play();
      }
      let vs = document.getElementsByClassName('v-class');
      if (this.row === 0 && this.pCount === 0) {
        let row = document.createElement('div');
        row.setAttribute("id",'row-' + this.row)
        row.appendChild(vNode);
        conf.appendChild(row);
      }
      else if (this.row === 0 && this.pCount >= 0) {
        let row = document.getElementById('row-' + this.row)
        row.appendChild(vNode);
      }
      else if (this.pCount % 3 === 0) {
        this.row++;
        let row = document.createElement('div');
        row.setAttribute("id",'row-' + this.row)
        row.appendChild(vNode);
        conf.appendChild(row);
      }
      else if(this.pCount % 3 > 0){
        let row = document.getElementById('row-' + this.row)
        row.appendChild(vNode);
      }
      this.pCount++;
      let width = this.pCount ? 100 / this.pCount : 100;
      for (var i = 0; i < vs.length; i++) {
        vs.item(i).setAttribute("style", "width:" + width + "%;")
      }
    }

  }
}
