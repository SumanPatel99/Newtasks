import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  store(obj){
    localStorage.setItem("firstname",obj.firstname)
    localStorage.setItem("lastname",obj.lastname)
    localStorage.setItem("email",obj.email)
    localStorage.setItem("age",obj.age)
    localStorage.setItem("state",obj.state)
    localStorage.setItem("tags",obj.tags)
  }

  get(userval){
    let ans = (localStorage.getItem(userval)===null)?false:(localStorage.getItem(userval));
    return ans;
  }
}
