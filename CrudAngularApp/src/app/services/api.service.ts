import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

  readonly booksApiUrl = "https://localhost:7044/api"

  getAllBooks(){
    return this.http.get<any>(this.booksApiUrl+'/Books');
  }

  postBook(data : any){
    return this.http.post<any>(this.booksApiUrl+'/Books',data);
  }

  

  putBook(data : any , id : number){
    return this.http.post<any>(this.booksApiUrl+`/Books/${id}` , data);
  }

  deleteBook(id : number){
    return this.http.delete<any>(this.booksApiUrl+`/Books/${id}`);
  }

  uploadFile(data:any){
   return this.http.post<any>(this.booksApiUrl+'/upload',data);
  }

  UnuploadFile(data:string){
    return this.http.post<any>(this.booksApiUrl+`/UnUpload/${data}` , data);
   }
}
