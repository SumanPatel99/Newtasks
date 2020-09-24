import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HeroService } from '../hero.service';
import { AuthService } from '../auth.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('closeBtn') closeBtn: ElementRef;

  public prodata: any
  public firstname = ''
  public lastname = ''
  public emailId = ''
  public age = ''
  public address1 = ''
  public address2 = ''
  public mobile = ''
  public state = ''
  public checked = false

  isHome = false;
  isCompany = false;

  selectedImage;


  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Fruit[] = [
    
  ];

  public profile = false
  public formdata = true
  registerForm: FormGroup;

  constructor(private frm: FormBuilder, private Hero: HeroService, private Auth: AuthService, private router: Router) {
    this.registerForm = this.frm.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20),Validators.pattern('^[a-zA-Z \-\']+')]],
      lastname: ['', Validators.required],
      number: ['', [Validators.required, Validators.minLength(10)]],
      age: [20, Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(20)]],
      address1: [''],
      address2: [''],
      companyAddress1: [''],
      companyAddress2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      tags:[''],
      subscribe: [false]
    })
  }

  selectAddress(selectedAddress) {
    if (selectedAddress === 'home') {
      this.isHome = true;
      this.isCompany = false;
      this.updateValidators('address1')
      this.updateValidators('address2')
      this.removeValidators('companyAddress1')
      this.removeValidators('companyAddress2')
      this.clearValue('companyAddress1')
      this.clearValue('companyAddress2')
    } else if (selectedAddress === 'company') {
      this.isHome = false;
      this.isCompany = true;
      this.updateValidators('companyAddress1')
      this.updateValidators('companyAddress2')
      this.removeValidators('address1')
      this.removeValidators('address2')
      this.clearValue('address1')
      this.clearValue('address2')
    }
  }

  clearValue(control){
    this.registerForm.get(control).patchValue('');
  }

  removeValidators(control) {
    this.registerForm.get(control).clearValidators();
    this.registerForm.get(control).updateValueAndValidity();
  }

  updateValidators(control) {
    this.registerForm.get(control).setValidators(Validators.required)
    this.registerForm.get(control).updateValueAndValidity();
  }

  ngOnInit() {
    // this.firstname= localStorage.getItem('firstname')
    this.Hero.getdata("user").subscribe(
      (response) => {
        console.log(response)
        this.prodata = response
      },
      (error) => { console.log(error) }
    )
  }


  selectedFile(event) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(){
      // console.log(reader.result)
      me.selectedImage = reader.result;
    }
  }

  Register(form) {
    const user = this.createUser(this.registerForm.value)
    // console.log(this.registerForm.value);
    this.Hero.postdata("user",user).subscribe(
      (response)=>{
        this.closeBtn.nativeElement.click();
        // console.log(response)
        this.router.navigate(['profile/' + response.id]);
      }
    )
  }

  createUser(userData) {
    const user = {
      firstname: userData.firstname,
      lastname: userData.lastname,
      mobile: userData.number,
      email:userData.email,
      age: userData.age,
      city: userData.city,
      state: userData.state,
      country: userData.country,
      address: {
        home: {
          address1: userData.address1,
          address2: userData.address2
        },
        company: {
          companyAddress1: userData.companyAddress1,
          companyAddress2: userData.companyAddress2
        }
      },
      tags:userData.tags,
      subscribe: userData.subscribe,
      image: this.selectedImage ? this.selectedImage : null
    }
    return user;
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Fruit): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

 
}
