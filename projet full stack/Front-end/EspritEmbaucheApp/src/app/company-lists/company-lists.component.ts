import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../Services/company.service';
import { Router } from '@angular/router';
import { SidenevComponent } from '../sidenev/sidenev.component';
import Swal from 'sweetalert2';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../company';

@Component({
  selector: 'app-company-lists',
  templateUrl: './company-lists.component.html',
  styleUrls: ['./company-lists.component.css']
})
export class CompanyListsComponent implements OnInit {

  companyId: number;

  searchValue : any ;
  
  jobOffersCount: number;

  items: Company[];

  jobOffersCounts: { [key: number]: number } = {}; // Object to store job offers counts by company ID


  constructor(public companyService: CompanyService,
                  private router: Router, 
                  private http: HttpClient,
                  private sidenavComponent: SidenevComponent
              ) { }

  ngOnInit(): void {
    
    this.getData();

  }
  
//done
  getData() {
    this.companyService.getAll().subscribe(
      response =>{
        this.companyService.list = response;
        this.fetchJobOffersCounts();
      },
      error => {
        console.log('Error occurred while fetching items:', error);
      }
     );
   
  }


//done
  public onDelOffer(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'question',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimez-la !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.companyService.deleteCompany(id).subscribe(
          (res) => {
            this.getData();
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    });
  }
  
//done
  getJobOffersCount(companyId: number): void {
    const apiUrl = `http://localhost:8000/company/${companyId}/job-offers/count`;
    this.http.get<number>(apiUrl).subscribe(
      count => {
        this.jobOffersCount = count;
      },
      error => {
        console.log('Error occurred while fetching job offers count:', error);
      }
    );
  }


  fetchJobOffersCounts(): void {
    this.companyService.list.forEach(item => {
      const apiUrl = `http://localhost:8000/company/${item.id}/job-offers/count`;
      this.http.get<number>(apiUrl).subscribe(
        count => {
          this.jobOffersCounts[item.id] = count;
        },
        error => {
          console.log(`Error occurred while fetching job offers count for company ${item.id}:`, error);
        }
      );
    });
  }
  
  

  redirectToDetails(idcompany: number): void {
    // Navigate to the detailsComponent with the company ID as a parameter
    this.router.navigate(['companydetail', idcompany]);
  }


}
