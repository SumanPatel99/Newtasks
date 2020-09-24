import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/Common/Http';
import { Observable } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private url = "http://localhost:3000/"

  constructor(private Http: HttpClient) { }

  getdata(record) {
    // console.log(record)
    let finalurl = this.url + record
    // console.log(finalurl)
    return this.Http.get(finalurl)
  }

  postdata(record, data_fromuser): any {
    // console.log(record)
    // console.log(data_fromuser)
    let finalurl = this.url + record
    // console.log(finalurl)
    return this.Http.post(finalurl, data_fromuser)
  }

  getUser(record, id): Observable<any> {
    return this.Http.get(this.url + record + '/' + id);
  }


  updateImage(record,id,image){
    return this.Http.patch(this.url + record + '/' + id,{image:image})

  }

}
