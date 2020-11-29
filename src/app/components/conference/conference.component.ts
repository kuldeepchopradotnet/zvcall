import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Helper } from 'src/app/core/utils/helper';
import { ConferenceService } from './service/conference.service';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { confObj } from '../../core/interfaces.models/conference.models'


@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.css']
})
export class ConferenceComponent implements OnInit {
  form: FormGroup;
  validation_messages = {
    fullName: [
      { type: 'required', message: 'Full name is required' },
      { type: 'minlength', message: 'minimum length is 2' },
    ],
    cofname: [
      { type: 'required', message: 'Conference name is required' },
      { type: 'minlength', message: 'minimum length is 2' },
    ]
  };

  confrenceAlias: string;
  conflink: string;
  isGuest: boolean;
  isConfStart: boolean;
  constructor(private readonly conferenceService: ConferenceService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,) { }

  async ngOnInit() {
    this.initForm();
    this.route.params.subscribe((params: Params) => {
      if (params && params.id) {
        let confId = params['id'];
        this.isGuest = true;
        this.confnameCrt.clearValidators();
        this.confnameCrt.updateValueAndValidity();
        this.confnameCrt.patchValue(confId)
      }
    });
  }

  get confnameCrt() {
    return this.form.get('cofname');
  }

  async startHost(confObj: confObj) {
    this.conferenceService.start(confObj);
  }

  async joinGuest(confId: string, confObj: confObj) {
    this.conferenceService.joinParticipant(confId, confObj);
  }

  async link() {
    this.conflink = this.conferenceService.getConferenceLink(this.confrenceAlias);
    console.log(this.conflink);
  }

  initForm() {
    this.form = this.formBuilder.group({
      fullName: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      cofname: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      cam: new FormControl(false),
      mic: new FormControl(false)
    })
  }

  //submit reactive form
  submitForm(form: FormGroup) {
    if (form.valid) {
      const { fullName, cofname, cam, mic } = form.value;
      this.confrenceAlias = this.isGuest ? cofname :  this.getConfName(cofname);
      let confObj = {
        joinAs: fullName,
        confName: this.confrenceAlias,
        cam,
        mic
      }
      let strForm = JSON.stringify(confObj, null, 4);
      alert(strForm)
      if (this.isGuest) {
        this.joinGuest(this.confrenceAlias, confObj);
        this.isConfStart = true;
      }
      else {
        this.startHost(confObj);
        this.isConfStart = true;
        this.link();
      }
    }
    else {
      this.form.markAllAsTouched();
    }
  }

  getConfName(name: string) {
    let d = new Date();
    let t = d.getTime();
    return `${name}_${t}`;
  }


}
