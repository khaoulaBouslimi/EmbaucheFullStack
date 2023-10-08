import { Component, OnInit } from '@angular/core';
import { UploadFileService } from '../Services/upload-file.service';

import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import saveAs from 'file-saver';
import { Observable } from 'rxjs';





@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {
 
  nom: string;
  prenom: string;
  cvFile: File;

  candidateId: number;

  constructor(private candidateService: UploadFileService ,private http: HttpClient) { }

  ngOnInit(): void { 
  }

  //http://localhost:8000/addCandidat

  /*************************************************************************i had a successful download here***************************************************************************** */

  onSubmit(): void {
    const formData = new FormData();
    formData.append('nom', this.nom);
    formData.append('prenom', this.prenom);
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
  /*************************************************************************************************************************************** */
   // Download the CV file
   downloadCV(id: number): void {
    this.http
      .get('http://localhost:8000/downloadCV/' + id, { responseType: 'blob' })
      .subscribe((response: any) => {
        const filename = 'cv.pdf';
        saveAs(response, filename);
      }, (error: any) => {
        console.error('Failed to download CV:', error);
      });
  }




}

