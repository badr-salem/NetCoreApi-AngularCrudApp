import { Component, ElementRef, HostListener, OnChanges, OnInit , ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';
import { DataSource } from '@angular/cdk/collections';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

  title = 'CrudAngular';

  displayedColumns: string[] = ['id','bookName', 'authorName', 'category', 'status', 'price' , 'date' ,'imagePath' , 'action'  ];
  dataSource!: MatTableDataSource<any>;
  newDataSource !: any;
  isShowtheCards : boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public respone!:{dbPath:''}

  constructor(private dialog : MatDialog, private api : ApiService  ){
  }
  ngOnInit(): void {
    this.getAllBooks();
  

  }

 
  openDialog() {
    this.dialog.open(DialogComponent , {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val == "save"){
        this.getAllBooks();
      }else{
 //mean user upload image but he click outside the dialog and close it , so we will deletem the image he uploaded
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
      
    });


  }

  getAllBooks(){
    this.api.getAllBooks().subscribe(
      {
        next:(res)=>{
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;  

          this.newDataSource = res;
          console.log(res)
        },
        error:()=>{console.log("Error while Fetching the Data")}
      }
    )
  }

  editBook(row : any){
    this.dialog.open(DialogComponent , {
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val == "update"){
        this.getAllBooks();
      }
    });

  }

  deleteBook(id : number){
    Swal.fire({
      title: 'هل أنت متأكد أنك تريد الحذف !',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم إحذف'
    }).then((result) => {
      if (result.isConfirmed) {

        this.api.deleteBook(id).subscribe({
          next:(res)=>{
            //alert("Delete Product Successfully");
            this.getAllBooks();
          },
          error:()=>{
            alert("حدث خطأ ما");
          }
        })

        Swal.fire(
          'تم الحذف',
          'تم حذف الكتاب بنجاح',
          'success'
        )
      }
    })

    




  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public createImagePath = (serverPath:string) =>{

    if(serverPath == null){
      // show default image if no image upload
      return `https://localhost:7044/Resources/Images/default_image.png`;
    }

    return `https://localhost:7044/${serverPath}`;
  }


  openTable(){
    // const table = document.getElementById("divTable");
    // const cards = document.getElementById("divCards");
    // if (table != null){
    //   table.style.visibility='visible';

    // }
    // if(cards != null){
    //   cards.style.visibility = "hidden";
    // }
    this.isShowtheCards = false;
  }
  openCards(){

   
    this.isShowtheCards = true;

  }

  

  


}



