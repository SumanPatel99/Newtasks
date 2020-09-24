import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  id;
  profile;
  selectedImage;
  constructor(private activatedRoute: ActivatedRoute, private userService: HeroService) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    // console.log(this.id);
    this.getUserdata(this.id)
  }
  getUserdata(id){
    this.userService.getUser("user", id).subscribe(res => {
      // console.log(res);
      this.profile = res;
    })
  }

  selectedFile(event){
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(){
      // console.log(reader.result)
      me.selectedImage = reader.result;
      me.updateImage(me.selectedImage)
    }
  }

  updateImage(image){
    this.userService.updateImage("user",this.id,image).subscribe(
      response =>{
        this.getUserdata(this.id)
      }
    )

  }

}
