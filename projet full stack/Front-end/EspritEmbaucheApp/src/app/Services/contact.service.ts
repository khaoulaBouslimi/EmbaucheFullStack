import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from '../contact';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  readonly apiURL ='http://localhost:8000/contact/submitmessage';

  constructor(private http: HttpClient) { }

  
    addContact(contact: Contact): Observable<any> {  
    return this.http.post(this.apiURL, contact, { responseType: 'text' });  
  }

   getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`http://localhost:8000/contact/getContacts`);
  }

  deleteContact(contactId: number): Observable<string> {
    const url = `http://localhost:8000/contact/delete/${contactId}`;
    return this.http.delete<string>(url, { responseType: 'text' as 'json' });
}



}
