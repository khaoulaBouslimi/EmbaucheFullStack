import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Email } from 'src/_model/Emails';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})


export class EmailService {

  private apiUrl = 'http://localhost:8000/send-multiple';

  private baseUrl= 'http://localhost:8000/send-email';


  constructor(private http: HttpClient ) { }

  /***************************************************no nneed for this one ******************************************** */
  sendEmailToMultipleRecipients(emailRequest: Email): Observable<any> {
    return this.http.post<any>(this.apiUrl, emailRequest);
  }
  
  /***************************************************************************** */

  

}
