import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HeroService } from '../hero.service';
import { AuthService } from '../auth.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ResizeOptions, ImageResult} from 'ng2-imageupload'

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
  uploadedImage: File;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Fruit[] = [
    
  ];

  resizeOptions: ResizeOptions= {
    resizeMaxHeight: 310,
    resizeMaxWidth: 325

  }

  public profile = false
  public formdata = true
  registerForm: FormGroup;

  constructor(private frm: FormBuilder, private Hero: HeroService, private Auth: AuthService, private router: Router,  private restrictImg:Ng2ImgMaxService) {
    this.registerForm = this.frm.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20),Validators.pattern('^[a-zA-Z \-\']+')]],
      lastname: ['', Validators.required],
      number: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      age: [20, Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(20)]],
      address1: ['',[Validators.required]],
      address2: ['', Validators.required],
      companyAddress1: ['',Validators.required],
      companyAddress2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      tags:['',Validators.required],
      subscribe: [false],
      image: this.selectedImage ? this.selectedImage : null
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

  // window.URL = window.URL || window.webkitURL;

  selectedFile(event,imageResult: ImageResult) {
    console.log(event.target.files[0].size == 325 * 310,event.target.files[0].size)
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
   
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
    
      let img = new Image();
    
      img.src = window.URL.createObjectURL( file );
      reader.readAsDataURL(file);
      reader.onload = () => {
        setTimeout(() => {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
    
          window.URL.revokeObjectURL( img.src );
          console.log(width + '*' + height);
          if ( width !== 325 && height !== 310 ) {
            alert('photo should be 325 * 310 size');
            this.registerForm.reset();
          } else {
            this.selectedImage = reader.result;
          }
        }, 200);
          };
    // let imaguplo:any = img.src
    // imaguplo = imageResult.resized && imageResult.resized.dataURL || imageResult.dataURL
    // console.log(imaguplo,"hhh")
  
        }
  }

  Register(form) {
    const user = this.createUser(this.registerForm.value)
    // console.log(this.registerForm.value);
    this.Hero.postdata("user",user).subscribe(
      (response)=>{
        this.closeBtn.nativeElement.click();
        console.log(response)
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
