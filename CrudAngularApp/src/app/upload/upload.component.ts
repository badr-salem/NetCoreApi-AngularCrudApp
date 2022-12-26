import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { timestamp } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  public message!:string;
  public progress!:number;
  public onUploadFinshed = new EventEmitter();
  public date: Date = new Date();

  constructor(private http:HttpClient , private api : ApiService) { }

  ngOnInit(): void {
  }


  

public uploadFile(files:any){
  if(files.length === 0){
  return;
   }

   //check for seesion ig=f there is file delete it then change
   var string1 = localStorage.getItem("filePathLocal")?.toString()
   if(string1 != null){
      // var string2 = string1!.replace('Resources\\Images\\' , '');
  var string2 = string1!.replace('\\' , '');
  var string3 = string2!.replace('Images' , '');
  var string4 = string3!.replace('Resources' , '');
  var string5 = string4!.replace('/' , '');
  var imagePath = string5;

  imagePath = imagePath.replace('\\','');
  imagePath = imagePath.replace('\\','');
  imagePath = imagePath.replace('\\','');


     console.log("1");
     console.log(string1);

     console.log("2");
     console.log(string2);

     console.log("3");
    console.log(string3);

    console.log("4");
    console.log(string4);

    console.log("5");
    console.log(imagePath);

      this.api.UnuploadFile(imagePath!).subscribe({
        next:(res)=>{
         
          localStorage.removeItem("filePathLocal");
        },
        error :()=>{
          
        }
      });
   }

let fileToUpload = <File>files[0];
const formData = new FormData();
formData.append('file' , fileToUpload , fileToUpload.name);



// this.api.uploadFile(formData , {reportProgress:true , observe:'events'})

this.http.post('https://localhost:7044/api/upload',formData , {reportProgress:true , observe:'events' , responseType: 'text'})
.subscribe(event=>{
  if(event.type === HttpEventType.UploadProgress){
    this.progress = Math.round(100*event.loaded /event.total!);
  }
  else if(event.type === HttpEventType.Response){
    
    this.message = "تم الرفع بنجاح";
    this.onUploadFinshed.emit(event.body);
    
  
   var string1 = event.body!;
   var string2 = string1.replace('{"dbPath":"' , '');
   var string3 = string2.replace('"}','')

   
    

   
    // var imagePath = string3+"-"+this.date.getDate().toString()+"-"+this.date.getMonth().toString();

    console.log(string3);
    localStorage.setItem("filePathLocal" , string3);
  }else{
    this.message = 'صيغة الملف غير مقبولة';
    
  }
});

  }

}
