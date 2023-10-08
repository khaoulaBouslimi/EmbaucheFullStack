import { Component, OnInit } from '@angular/core';
import { Candidat } from '../candidat';
import { OfferService } from '../Services/offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOfferDTO } from '../jobofferdto';
import { Company } from '../company';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-candidature',
  templateUrl: './candidature.component.html',
  styleUrls: ['./candidature.component.css']
})
export class CandidatureComponent implements OnInit {

  list : Company[];

  jobOffer: JobOfferDTO;

  candidatures: Candidat[] = [];

  jobOfferId: number;

  constructor(private candidatureService: OfferService,
              private route: ActivatedRoute,
              private http: HttpClient, 
              private router: Router 
              ) { }

  ngOnInit(): void {

    const idJobOffer = this.route.snapshot.params['idJobOffer'];
    this.getJobOffer(idJobOffer);

    this.route.params.subscribe(params => {
      this.jobOfferId = params['idJobOffer'];
      this.getCandidatures();
    });
  }

  getJobOffer(id: number): void {
    this.candidatureService.getJobOfferById(id)
      .subscribe(jobOffer => {
        this.jobOffer = jobOffer;
      });
  }

  getCandidatures(): void {
    this.candidatureService.getCandidaturesByJobOfferId(this.jobOfferId)
      .subscribe(candidatures => this.candidatures = candidatures);
  }

 


   downloadFile(candidatureId: number) {
  // Make a GET request to download the CV file
  this.http.get(`http://localhost:8000/candidatures/downloadCV/${candidatureId}`, { responseType: 'arraybuffer' })
    .subscribe(response => {
      // Create a Blob from the response data
      const blob = new Blob([response], { type: 'application/pdf' });

      // Create a download link for the Blob
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = `cv_${candidatureId}.pdf`;

      // Append the download link to the DOM and trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Clean up the download link after the download is triggered
      document.body.removeChild(downloadLink);
    },
    error => {
      console.error('Failed to download CV:', error);
    });
}


 downloadLettreMotivation(candidatureId: number) {
  // Make a GET request to download the CV file
  this.http.get(`http://localhost:8000/candidatures/downloadLettreMotivation/${candidatureId}`, { responseType: 'arraybuffer' })
    .subscribe(response => {
      // Create a Blob from the response data
      const blob = new Blob([response], { type: 'application/pdf' });

      // Create a download link for the Blob
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = `LM_${candidatureId}.pdf`;

      // Append the download link to the DOM and trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Clean up the download link after the download is triggered
      document.body.removeChild(downloadLink);
    },
    error => {
      console.error('Failed to download CV:', error);
    });
}


redirectToAdminDashboard() {
  this.router.navigate(['adminDashboard']);
}

}
