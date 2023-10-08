import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Offer } from '../offer';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { IPercentage } from '../interface/percentage';
import { JobOfferDTO } from '../jobofferdto';
import { Candidat } from '../candidat';
import { EmailSubscription } from '../subscription';
import { JobOffer } from '../JobOffer';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class OfferService {


  readonly apiURL ='http://localhost:8000';

  private jobOfferId: number;

  constructor(private http: HttpClient, private storageService: StorageService) { }


  sendEmail(
    to: string,
    subject: string,
    body: string,
    attachment?: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('body', body);

    if (attachment) {
      formData.append('attachment', attachment);
    }

    return this.http.post(`${this.apiURL}/email/send-email`, formData);
  }



  sendEmailToMultipleRecipients(emailData: any, attachment: File): Observable<any> {
    const formData = new FormData();
    formData.append('emailData', JSON.stringify(emailData)); // Email data as JSON
    if (attachment) {
      formData.append('attachment', attachment); // Attachment
    }
  
    return this.http.post(`${this.apiURL}/email/multiple`, formData, { responseType: 'blob' });
  }

  sendEmailToMultipleRecipientss(
    toaddresses: string[],
    subject: string,
    body: string,
    attachment?: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('toaddresses', JSON.stringify(toaddresses));
    formData.append('subject', subject);
    formData.append('body', body);

    if (attachment) {
      formData.append('attachment', attachment);
    }

    return this.http.post(`${this.apiURL}/email/multiple`, formData);
  }

  
  /******************************* subscribe ************************************ */
  subscribeEmail(email: string): Observable<string> {
    const url = `${this.apiURL}/subscriptions/subscribe`;
    return this.http.post(url, email, { responseType: 'arraybuffer' }).pipe(
      map(response => new TextDecoder().decode(response))
    );
  }
  
  
  
  unsubscribeEmail(email: string): Observable<any> {
    const url = `${this.apiURL}/subscriptions/unsubscribe`; // Replace with your unsubscribe API endpoint
    return this.http.post(url, { email });
  }

  /*************************************************************************percentage chart works************************************************************************************* */


  //done
  getCompanyPercentage(): Observable<Array<IPercentage>> {
    return this.http
    .get<Array<IPercentage>>(`http://localhost:8000/joboffer/percentCountCompany`)
    .pipe(map((d: Array<IPercentage>) => d )) ;
     
  }

  /************************ jobOfferDTO service*********************************** */
  //done
  getAllJobOffersWithCompany(): Observable<JobOfferDTO[]> {
    return this.http.get<JobOfferDTO[]>(`${this.apiURL}/company/getAllJobOffersWithCompanyInfo`);
  }


  //done
  getAllNonExpiredJobOffers(): Observable<JobOfferDTO[]> {
    return this.http.get<JobOfferDTO[]>(`${this.apiURL}/company/getAllNonExpiredJobOffers`);
  }


  //done
  public deleteOffer(idOffre: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/joboffer/delete/${idOffre}`);
  }

  

  //done
   
  toggleJobOfferVisibility(jobOfferId: number): Observable<any> {
    return this.http.put(`http://localhost:8000/company/toggleJobOfferVisibility/${jobOfferId}`, null, {
      responseType: 'text', // Set response type to text
    });
  }
  

  /********************** candidature service  ********************* */

  //done
  getJobOfferById(id: number): Observable<JobOfferDTO> {
    const url = `${this.apiURL}/joboffer/getJobOfferById/${id}`;
    return this.http.get<JobOfferDTO>(url);
  }

  //done
  getJobOfferByIdd(id: number): Observable<JobOffer> {
    const url = `${this.apiURL}/joboffer/getJobOfferById/${id}`;
    return this.http.get<JobOffer>(url);
  }

  //done
  updateJobOffer(id: number, updatedJobOffer: JobOffer): Observable<JobOffer> {
    return this.http.put<JobOffer>(`http://localhost:8000/joboffer/updatejoboffers/${id}`, updatedJobOffer);
  }


  //done
  getCandidaturesByJobOfferId(jobOfferId: number): Observable<Candidat[]> {
    const url = `${this.apiURL}/candidatures/${jobOfferId}/jobOffers`;
    return this.http.get<Candidat[]>(url);
  }

  //done
  downloadCV(candidatureId: number): Observable<HttpResponse<Blob>> {
    const url = `http://localhost:8000/candidatures/downloadCV/${candidatureId}`;
    return this.http.get(url, { responseType: 'blob', observe: 'response' });
  }



/********************************************************************** send email with section* works ********************************************************************* */

  private emailSectionSource = new BehaviorSubject<string>('');

  emailSection$ = this.emailSectionSource.asObservable();

  setEmailSection(section: string) {
    this.emailSectionSource.next(section);
  }

  getEmailSection(): string {
    return this.emailSectionSource.getValue();
  }

/*************************************retrieve img******************************************* */

getAllOffersWithImages(): Observable<any> {
  return this.http.get<any>(`${this.apiURL}/offer/getofferswithimages`);
}












//bech yetfas5ouu/
/*
  public getOffers() : Observable<Offer[]> {
    return this.http.get<any>(`${this.apiURL}/offer/all`) ;
  }

  public getOfferById(idOffre:number) : Observable<Offer[]> {
    return this.http.get<any>(`${this.apiURL}/offer/getoffer/${idOffre}`) ;
  }


  public addOffer(offer: Offer) : Observable<Offer> {
    return this.http.post<Offer>(`${this.apiURL}/offer/add`, offer) ;
  }


  public addNewOffer(offer: FormData) {
    return this.http.post<Offer>(`${this.apiURL}/offer/add/new`, offer) ;
  }*/










/**
 
  public updateOffer(offer: Offer) : Observable<Offer> {
    return this.http.put<Offer>(`${this.apiURL}/offer/update`, offer) ;
  }


  public updateOfferById(idOffre:number, offer:Offer): Observable<Offer>{
    return this.http.put<Offer>(`${this.apiURL}/offer/update/${idOffre}`, offer);
  }

 */





}
