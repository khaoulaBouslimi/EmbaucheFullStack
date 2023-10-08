import { HttpClient, HttpRequest, HttpEvent, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, filter, map, throwError } from 'rxjs';
import { Candidat } from '../candidat';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private apiUrl  = 'http://localhost:8000'

  constructor(private http: HttpClient) { }


 


  addCandidate(nom: string, prenom: string, cvFile: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('prenom', prenom);
    if (cvFile) {
      formData.append('cv', cvFile, cvFile.name);
    }

    return this.http.post<any>(`${this.apiUrl}/addAcandiidatadd`, formData);
  }
/**********************download******* */

downloadFileById(id: number): void {
  this.http.get(`http://localhost:8000/download/${id}`, { responseType: 'blob' }).subscribe((response: Blob) => {
    const url = window.URL.createObjectURL(response);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = `cv_${id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  });
}
 

  getFiles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/files`);
  }


  downloadFile(fileId: string): void {
    this.http.get(`${this.apiUrl}/files/${fileId}/download`, { responseType: 'blob' })
      .subscribe((data: Blob) => {
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(data);
        downloadLink.href = url;
        downloadLink.download = 'file.txt'; // Provide a default file name
        downloadLink.click();
        window.URL.revokeObjectURL(url);
      });
  }

/****************************last************************************* */


downloadCV(candidateId: number): Observable<Blob> {
  const headers = new HttpHeaders().set('Accept', 'application/pdf');
  return this.http.get(`${this.apiUrl}/telecharger/${candidateId}/cv`, { responseType: 'blob', headers });
}




download(candidateId: number): void {
  this.http.get('http://localhost:8000/telichargi/' + candidateId + '/cv', {
    responseType: 'blob',
    observe: 'response'
  }).subscribe((res: HttpResponse<Blob>) => {
    const contentDispositionHeader: string | null = res.headers.get('Content-Disposition');
    const fileName: string = contentDispositionHeader
      ? contentDispositionHeader.split(';')[1].trim().split('=')[1]
      : 'cv.pdf';

    saveAs(new Blob([res.body as BlobPart], { type: 'application/pdf' }), fileName);
  }, error => {
    console.error('CV download failed:', error);
    // Handle error, e.g., show a notification to the user
  });
}










/********************************************************************************************************* */














  ajouterCandidat(candidat: Candidat, cvFile: File, lettreMotivationFile: File): Observable<Candidat> {
    const formData = new FormData();
    formData.append('nom', candidat.nometprenom);
    formData.append('prenom', candidat.nometprenom);
    formData.append('cv', cvFile);
    formData.append('lettreMotivation', lettreMotivationFile);

    return this.http.post<Candidat>(`${this.apiUrl}/candidat/new`, formData);
  }

  

  getAllCandidats(): Observable<Candidat[]> {
    return this.http.get<Candidat[]>(`${this.apiUrl}/candidat/all`);
  }



  downloadCv(candidatId: number): Observable<Blob> {
    const url = `${this.apiUrl}/candidats/${candidatId}/cv`;
    return this.http.get(url, { responseType: 'blob' });
  }

  downloadLettreMotivation(candidatId: number): Observable<Blob> {
    const url = `${this.apiUrl}/candidats/${candidatId}/lettreMotivation`;
    return this.http.get(url, { responseType: 'blob' });
  }







  
/**************************************Candidat********************************************************/ 





  getCandidat(id: number): Observable<Candidat> {
    return this.http.get<Candidat>(`${this.apiUrl}/candidats/${id}`);
  }


  updateCandidat(candidat: Candidat, cvFile: File, lettreMotivationFile: File): Observable<Candidat> {
    const formData = new FormData();
    formData.append('nom', candidat.nometprenom);
    formData.append('prenom', candidat.nometprenom);
    formData.append('cv', cvFile);
    formData.append('lettreMotivation', lettreMotivationFile);

    return this.http.put<Candidat>(`${this.apiUrl}/candidats/${candidat.idCandidature}`, formData);
  }

  supprimerCandidat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/candidats/${id}`);
  }



}
