import { Component, ElementRef, Renderer2 , OnInit, ViewChild } from '@angular/core';
import { Email } from 'src/_model/Emails';
import { EmailService } from '../Services/email.service';
import { HttpClient, HttpErrorResponse, HttpHeaders  } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfferComponent } from '../offer/offer.component';
import { OfferService } from '../Services/offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.css'],
  providers:[OfferComponent]
})
export class EmailsComponent implements OnInit {

  emailSection: string;
  
  emailForm: FormGroup;

  @ViewChild('emailSection', { static: true }) emailSectionRef: ElementRef;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private offerService: OfferService, private route: ActivatedRoute,private sanitizer: DomSanitizer,private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.emailForm = this.formBuilder.group({
      toaddresses: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      body: ['', Validators.required],
      attachment: [null] ,
    });
  }

  ngOnInit() {

    /*************to put the section in the body*********************** */
    this.emailSection = this.offerService.getEmailSection();
    this.route.queryParams.subscribe(params => {
      this.emailSection = params['section'];
    });

    /*************toaddresses display the email content in email html********** */
    this.offerService.emailSection$.subscribe(section => {
      this.emailSectionRef.nativeElement.innerHTML = section;
    });
  }



  onSubmit() {
    const formData = new FormData();
    formData.append('toaddresses', this.emailForm.get('toaddresses')?.value || '');
    formData.append('subject', this.emailForm.get('subject')?.value || '');
    
    formData.append('attachment', this.emailForm.get('attachment')?.value || null);

    const section = this.offerService.getEmailSection();
    formData.append('body', section || ''); 

    const httpOptions = {
      headers: new HttpHeaders(),
      withCredentials: true // Enable sending credentials with the request
    };

    this.http.post<any>('http://localhost:8000/email/multiple', formData).subscribe(
      response => {
        console.log('Email sent successfully');

        this.emailForm.patchValue({ body: response.htmlContent });
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
