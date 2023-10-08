import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Company } from '../company';
import { Offer } from '../offer';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {


  readonly apiURL ='http://localhost:8000';

  private baseUrl = '/api/articles';

  host :string = "http://localhost:8000";



  list : Company[];
  
  tokenStr = localStorage.getItem('token');

  public dataForm:  FormGroup; 



  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    
  }

  selectedComponent: string;

  setSelectedComponent(component: string): void {
    this.selectedComponent = component;
  }



  //done
  createData(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiURL}/company/createCompany`, formData);
  }

  //done
  public deleteCompany(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/company/delete/${id}`);
  }
  //done
  getAll(): Observable<any> {
  
    return this.http.get(`${this.apiURL}/company/allcompanies`);
  }

  //done
  getCompanyById(id: number): Observable<Company> {
    const url = `${this.apiURL}/company/getCompanyById/${id}`;
    return this.http.get<Company>(url);
  }


  //done
  updateCompany(companyId: number, updatedCompany: Company): Observable<Company> {
    const apiUrl = `http://localhost:8000/company/updatecompany/${companyId}`;
    return this.http.put<Company>(apiUrl, updatedCompany);
}


  


}
