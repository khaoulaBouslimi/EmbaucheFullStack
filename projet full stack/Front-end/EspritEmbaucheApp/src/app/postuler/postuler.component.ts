import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { OfferService } from '../Services/offer.service';


@Component({
  selector: 'app-postuler',
  templateUrl: './postuler.component.html',
  styleUrls: ['./postuler.component.css']
})
export class PostulerComponent implements OnInit {

  @ViewChild('formRef', { static: false }) formRef!:NgForm;

  @ViewChild('fileInputRef', { static: false }) fileInputRef!: ElementRef<HTMLInputElement>;
  
  @ViewChild('fileInputRef', { static: false }) fileInputRefLM!: ElementRef<HTMLInputElement>;



  nometprenom: string;
  email: string;

  specialite: string;
  option: string;

  cv: File;
  lettreMotivation: File;

  idOffre: number;
  jobTitle:string;

  submissionResponse: string = '';




  constructor(private http: HttpClient, private route: ActivatedRoute, private companyService: OfferService) {
    
   }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idOffre = params['idOffre'];
      this.jobTitle = this.route.snapshot.paramMap.get('jobTitle') ?? '';
  
    });
  }

  /********************************* i had a successful add + download ************************************************* 

  onSubmit(): void {
    const formData = new FormData();
    formData.append('nometprenom', this.nometprenom);
    formData.append('email', this.email);

    formData.append('specialite', this.specialite);
    formData.append('option', this.option);

    formData.append('cv', this.cvFile);

    const headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');

    const req = new HttpRequest('POST', 'http://localhost:8000/addCandidat', formData, {
      headers: headers,
      responseType: 'blob'
    });

    this.http.request(req).subscribe(
      (response: any) => {
        // Create a download link for the file
        const file = new Blob([response.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'cv.pdf';
        link.click();
      },
      (error) => {
        // Handle error response
        console.error(error);
        // Perform any error handling actions
      }
    );
  }

  onFileChange(event: any): void {
    this.cvFile = event.target.files[0];
  }
*/

onFileChange(event: any) {
  this.cv = event.target.files[0];
}

onLettreMotivationFileChange(event: any) {
  this.lettreMotivation = event.target.files[0];
}

invalidEmailFormat: boolean = false;

  checkEmailFormat() {
    // Check if the email ends with '@esprit.tn'
    this.invalidEmailFormat = !this.email.endsWith('@esprit.tn');
  }
  

onSubmit() {


  const formData: FormData = new FormData();
    formData.append('nometprenom', this.nometprenom);
    formData.append('email', this.email);

    formData.append('specialite', this.specialite);
    formData.append('option', this.option);

    formData.append('cv', this.cv);

    formData.append('lettreMotivation', this.lettreMotivation);  


  

  this.http.post(`http://localhost:8000/candidatures/postuler/${this.idOffre}`, formData, { responseType: 'text' }).subscribe(
    response => {
      this.submissionResponse = response;
      Swal.fire({
        title: 'Success',
        html: '<div style="font-size: 17px;">Candidature soumise avec succès ! Veuillez vérifier votre e-mail, vous recevrez bientôt un e-mail de confirmation.</div>',
        icon: 'success'
      });
            console.log('Application submitted successfully!');
      // Reset form values
      if (this.formRef) {
        this.formRef.reset();
      }

      // Reset file input field
      this.fileInputRef.nativeElement.value = '';
      this.fileInputRefLM.nativeElement.value = '';
    },
    error => {
      Swal.fire({
        title: 'Error',
        html: '<div style="font-size: 17px;">Erreur lors de la soumission de la candidature !</div>',
        icon: 'error'
      });
        console.error('Failed to submit application:', error);
    }
  );
}






}


