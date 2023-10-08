import { Component,Input, OnInit, ViewChild } from '@angular/core';
import { Offer } from '../offer';
import { OfferService } from '../Services/offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { JobOffer } from '../JobOffer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offerdetails',
  templateUrl: './offerdetails.component.html',
  styleUrls: ['./offerdetails.component.css']
})
export class OfferdetailsComponent implements OnInit {

  public offersList: JobOffer[];
  
  idOffre:number;
  companySname: string;
	nbrEmployees: string;
	firstAndLastname: string;
	numTel: string;
	
	country: string;
	language: string;
	jobTitle: string;
	description: string;
	
	jobType: string;
	expLevel: string;
	nbrCandaidats: string;
	offerDuration: string;

  jobOffer: any = {};


  constructor(private offerService: OfferService,  private route: ActivatedRoute, private router: Router) {}



  ngOnInit(): void {

    // Retrieve the idOffre parameter from the URL
    this.idOffre = +this.route.snapshot.params['idJobOffer'];

    // Fetch job offer details based on the idOffre
    this.offerService.getJobOfferByIdd(this.idOffre).subscribe(
      (response: JobOffer) => {
        this.jobOffer = response;
      },
      (error) => {
        // Handle errors, e.g., show an error message or navigate to an error page
        console.error(error);
      }
    );

  }








 updateJobOffer(): void {
  this.offerService.updateJobOffer(this.idOffre, this.jobOffer).subscribe(
    (response) => {
      console.log('Job offer updated successfully:', response);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Modifiés avec succès',
        showConfirmButton: false,
        timer: 1500
      })
    },
    (error) => {
      console.error('Error updating job offer:', error);
    }
  );
}

 


redirectToAdminDashboard() {
  this.router.navigate(['adminDashboard']);
}



}
