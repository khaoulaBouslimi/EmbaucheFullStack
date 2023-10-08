import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../Services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../company';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-companydetails',
  templateUrl: './companydetails.component.html',
  styleUrls: ['./companydetails.component.css']
})
export class CompanydetailsComponent implements OnInit {

  company: any = {};
  id: number;


  constructor( private companyService : CompanyService, private router: Router,  private route: ActivatedRoute) { }

  ngOnInit(): void {

        // Retrieve the idOffre parameter from the URL
    this.id = +this.route.snapshot.params['idcompany'];





    // Fetch job offer details based on the idOffre
    this.companyService.getCompanyById(this.id).subscribe(
      (response: Company) => {
        this.company = response;
      },
      (error) => {
        // Handle errors, e.g., show an error message or navigate to an error page
        console.error(error);
      }
    );



  }



  onUpdateCompany() {
    this.companyService.updateCompany(this.id, this.company)
      .subscribe(response => {
        // Gérez la réponse après la mise à jour, par exemple, affichez un message de succès
        console.log('Company updated successfully', response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Modifiés avec succès',
          showConfirmButton: false,
          timer: 1500
        })
      },(error) => {
        // Handle errors, e.g., show an error message or navigate to an error page
        console.error(error);
      });
  }


  redirectToAdminDashboard() {
    this.router.navigate(['adminDashboard']);
  }

}
