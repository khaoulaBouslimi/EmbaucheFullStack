import { Component, OnInit } from '@angular/core';
import { Offer } from '../offer';
import { OfferService } from '../Services/offer.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Candidat } from '../candidat';
import { UploadFileService } from '../Services/upload-file.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

////////////////////////////////////////////////////////////////////////////////////////////////

apiURL = 'http://localhost:8000';
candidats: Candidat[];
  selectedCandidat: any;
  cv: any ;
  lettreMotivation: any ;




  //////////////////////////////////////////////////////////////////////////////////////////////////////

	pdfSrc: string; // Variable to store the PDF file data

  constructor(private offerService: OfferService, private candidatService: UploadFileService, private http: HttpClient) { }

  ngOnInit(): void {

    this.getCandidats();


  }


handleFileInput(event: any): void {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    this.pdfSrc = reader.result as string;
  };

  reader.readAsDataURL(file);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


getCandidats() {
  this.candidatService.getAllCandidats().subscribe(
    (candidats: Candidat[]) => {
      this.candidats = candidats;
    },
    (error: any) => {
      console.error(error);
    }
  );
}

ajouterCandidat(candidat: Candidat) {
  this.candidatService.ajouterCandidat(candidat, this.cv, this.lettreMotivation).subscribe(
    () => {
      this.resetForm();
      this.getCandidats();
    },
    (error: any) => {
      console.error(error);
    }
  );
}

supprimerCandidat(id: number) {
  this.candidatService.supprimerCandidat(id).subscribe(
    () => {
      //this.resetForm();
      this.getCandidats();
    },
    (error: any) => {
      console.error(error);
    }
  );
}

onCvFileSelected(event: any) {
  this.cv = event.target.files[0];
}

onLettreMotivationFileSelected(event: any) {
  this.lettreMotivation = event.target.files[0];
}


///// à revoir !!!
resetForm() {
  this.selectedCandidat = null;
  this.cv = null;
  this.lettreMotivation = null;
}




downloadCv(candidat: Candidat) {
  this.candidatService.downloadCv(candidat.idCandidature).subscribe(
    (fileData: Blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(fileData);
      downloadLink.href = url;
      downloadLink.download = `cv_${candidat.idCandidature}.pdf`;
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    },
    (error: any) => {
      console.error(error);
    }
  );
}



downloadLettreMotivation(candidat: Candidat) {
  this.candidatService.downloadLettreMotivation(candidat.idCandidature).subscribe(
    (fileData: Blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(fileData);
      downloadLink.href = url;
      downloadLink.download = `lettre_${candidat.idCandidature}.pdf`;
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    },
    (error: any) => {
      console.error(error);
    }
  );
}



////////////////////////////////////////////////////////////////////////


downloadCvv(candidatId: number) {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  this.http.get(`${this.apiURL}/candidats/${candidatId}/cv`, {
    headers: headers,
    responseType: 'arraybuffer' // Set the response type as arraybuffer
  }).subscribe((response: ArrayBuffer) => {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cv.pdf';
    link.click();
    window.URL.revokeObjectURL(url);
  }, error => {
    console.error('Failed to download CV:', error);
  });
}

downloadCV(candidateId: number, candidateName: string): void {
  this.candidatService.downloadCV(candidateId)
    .subscribe((response: any) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${candidateName}_cv.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('CV download failed:', error);
      // Handle error, e.g., show a notification to the user
    });
}



download(candidateId: number): void {
  this.candidatService.download(candidateId);
}








}
