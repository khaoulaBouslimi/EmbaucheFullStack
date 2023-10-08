import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../Services/offer.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.css']
})
export class MailsComponent implements OnInit {

  emailSection: string;
  
  emailForm: FormGroup;

  @ViewChild('emailSection', { static: true }) emailSectionRef: ElementRef;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private offerService: OfferService, 
    private route: ActivatedRoute,private sanitizer: DomSanitizer,private fb: FormBuilder, private snackBar: MatSnackBar) {
      
      this.emailForm = this.formBuilder.group({
        toaddresses: ['', [Validators.required, Validators.email]],
        subject: ['', Validators.required],
        body: ['', Validators.required],
        attachment: [null] ,
      });
  }

  ngOnInit() {
  }

  
  
  onSubmit() {
    const formData = new FormData();
    formData.append('toaddresses', this.emailForm.get('toaddresses')?.value || '');
    formData.append('subject', this.emailForm.get('subject')?.value || '');
    formData.append('body', this.emailForm.get('body')?.value || '');

    formData.append('attachment', this.emailForm.get('attachment')?.value || null);


    const httpOptions = {
      headers: new HttpHeaders(),
      withCredentials: true // Enable sending credentials with the request
    };

    this.http.post<any>('http://localhost:8000/email/multiple', formData).subscribe(
      response => {
        console.log('Email sent successfully');

        this.emailForm.reset();
        this.snackBar.open('Email sent successfully', 'OK'); // Show a pop-up alert
      },
      error => {
        console.error('Failed to send email:', error);
      }
    );
  }

  

  
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.emailForm.get('attachment')?.setValue(file);
    }
  }

  redirectToAdminDashboard() {
    this.router.navigate(['adminDashboard']);
  }

   
}
