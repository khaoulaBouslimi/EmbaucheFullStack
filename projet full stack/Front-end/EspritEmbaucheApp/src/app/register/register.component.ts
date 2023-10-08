import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  users: any[] = [];

 
  form: any = {
    username: null,
    email: null,
    password: null,
    file: null // Initialize file to null

  };
  isSuccessful: boolean = false; // Initialize it with an initial value
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8000/api/auth/getallusers').subscribe(users => {
            this.users = users;
        });
  }

  onSubmit(): void {
    const { username, email, password } = this.form;

    this.authService.register(username, email, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.ngOnInit();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

 
  

  deleteUser(userId: number) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'question',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:8000/api/auth/deleteuser/${userId}`).subscribe(
          () => {
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
            this.ngOnInit(); // Refresh user list by re-fetching
        },
        (error) => {
            Swal.fire('Error', 'An error occurred while deleting the user.', 'error');
            console.error('Error deleting user:', error);
        }
        );
      }
    });
  }

  /******************************* with img************************ */

  userFile : any;
  imgURL: any;
  toastr: any;


  onSelectFileround(event: any) {
    if (event.target && event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userFile = file;
  
      const mimeType = file.type;
      if (!mimeType.match(/image\/*/)) {
        this.toastr.success('Only images are supported.');
        return;
      }
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imgURL = reader.result as string;
      };
    }
  }


  
  


 




 

 


}