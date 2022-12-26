import { asNativeElements, Component, ElementRef, HostListener, Inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { timestamp } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';



@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit   {


  statusList = ["جديد" , "مستعمل"]
  bookForm !: FormGroup
  actionBtn : string = "حفظ";
  labelForm : string = "نموذج الإضافة";
  public filePath : any = null

  public respone!:{dbPath:''}

  constructor(private formBuilder : FormBuilder ,
     private api : ApiService ,
     private http:HttpClient,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<DialogComponent> ) { }

  ngOnInit(): void {


    this.bookForm = this.formBuilder.group({
      bookName : ['' , Validators.required],
      authorName : ['' , Validators.required],
      category : ['' , Validators.required],
      status : ['' , Validators.required],
      price : ['' , Validators.required],
      date : ['' , Validators.required],
      imagePath: ['']
     
    });

    if(this.editData){
      this.actionBtn  = "تحديث";
      this.labelForm  = "نموذج التعديل";
      this.filePath = localStorage.getItem("filePathLocal");

      this.bookForm.controls['bookName'].setValue(this.editData.bookName)
      this.bookForm.controls['authorName'].setValue(this.editData.authorName)
      this.bookForm.controls['category'].setValue(this.editData.category)
      this.bookForm.controls['status'].setValue(this.editData.status)
      this.bookForm.controls['price'].setValue(this.editData.price)
      this.bookForm.controls['date'].setValue(this.editData.date)
      this.bookForm.controls['imagePath'].setValue(this.filePath)
    }
   
  }
  

  upsert(){
    if(this.bookForm.valid){
      if(!this.editData){
        //Mean Add New
        this.addBook();
        localStorage.removeItem("filePathLocal");
      }else{
        //Mean Updated Existing one
        this.updateBook();
        localStorage.removeItem("filePathLocal");
      }
    }

  }

  addBook(){
    if(this.bookForm.valid){
      this.filePath = localStorage.getItem("filePathLocal");
      var obj = { 
        bookName:this.bookForm.controls['bookName'].getRawValue(), 
        authorName:this.bookForm.controls['authorName'].getRawValue() ,
        category :this.bookForm.controls['category'].getRawValue() ,
        status : this.bookForm.controls['status'].getRawValue(),
        price : this.bookForm.controls['price'].getRawValue(),
        date : this.bookForm.controls['date'].getRawValue(),
        imagePath : this.filePath

     }; 

     console.log("For add")
     console.log(this.filePath);



      this.api.postBook(obj).subscribe({
        next:(res)=>{
          //alert("Adding Product Successfully");
          Swal.fire(
            'تم إضافة الكتاب بنجاح',
            '',
            'success'
          )
          this.bookForm.reset();
          this.dialogRef.close('save');
          
        },
        error :()=>{
          alert("حدث خطأ ما");
        }
      });

      // localStorage.removeItem("filePathLocal");
    }
  }

  updateBook(){

 

    console.log('For Update');
    console.log(this.filePath);


    this.filePath = localStorage.getItem("filePathLocal");
      var obj = { 
        bookName:this.bookForm.controls['bookName'].getRawValue(), 
        authorName:this.bookForm.controls['authorName'].getRawValue() ,
        category :this.bookForm.controls['category'].getRawValue() ,
        status : this.bookForm.controls['status'].getRawValue(),
        price : this.bookForm.controls['price'].getRawValue(),
        date : this.bookForm.controls['date'].getRawValue(),
        imagePath : this.filePath

     }; 


    this.api.putBook(obj , this.editData.id)
    .subscribe({
      next:(res)=>{
        //alert("Product Updated Successfully");
        Swal.fire(
          'تم تحديث الكتاب بنجاح',
          '',
          'success'
        )
        this.bookForm.reset();
        this.dialogRef.close("update");
      },
      error:()=>{
        alert("حدث خطأ ما");
      }
    });
    // localStorage.removeItem("filePathLocal");



  }

  public uploadFinished = (event:any)=>{
    this.respone = event;
      }



  public UnuploadFile(){

    //when user upload image then he click cancel , se we will delete the image
    var string1 = localStorage.getItem("filePathLocal")?.toString();

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

      
      
}     





}
