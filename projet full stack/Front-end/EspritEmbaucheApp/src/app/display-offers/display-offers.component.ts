import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Offer } from '../offer';
import { OfferService } from '../Services/offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { type } from 'os';
import { FileHandle } from 'src/_model/file-handle.model';
import { JobOfferDTO } from '../jobofferdto';
import { CompanyService } from '../Services/company.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
 
@Component({
  selector: 'app-display-offers',
  templateUrl: './display-offers.component.html',
  styleUrls: ['./display-offers.component.css'],
  
})



export class DisplayOffersComponent implements OnInit {

  jobOffers: JobOfferDTO[] = [];

  @ViewChild('sectionFadeIn') sectionFadeIn: ElementRef | undefined;

   animationStateFadeIn: string = 'hidden';
 

  public offersList: Offer[];
  
  idOffer: number;


  searchValue : any ;

  data : any ;

  imgSrc="";

  offer: Offer={
    companySname: "",
    nbrEmployees: "",
    firstAndLastname: "",
    numTel: "",

    country: "",
    language: "",
    jobTitle: "",
    description: "",

    jobType: "",
    expLevel: "",
    nbrCandaidats: "",
    offerDuration: "",
    dateAdded:"",
    offerImages: [],
    idOffre: 0
  }
  

  constructor(private offerService: OfferService, 
              private router:Router, 
              private route: ActivatedRoute,
              public companyService:CompanyService,
              private sanitizer: DomSanitizer,
              private http: HttpClient
              ) {    
              }

  
  
  ngOnInit(): void { 

    this.getJobOffersDto();

 

    //this.getAllOffers();

    this.idOffer = this.route.snapshot.params['idOffer'];
    //this.getOfById(this.idOffer);
    
  }

 
/**************************** activer desactiver ************************************** */
hasJobOfferExpired(jobOffer: JobOfferDTO): boolean {
  // Check if the end date has been exceeded
  return new Date(jobOffer.endDate) < new Date();
}

toggleVisibility(jobOfferId: number) {
  this.offerService.toggleJobOfferVisibility(jobOfferId).subscribe(
    () => {
      console.log('Visibility toggled successfully.');
      // Update the visibility status in the frontend
      const jobOffer = this.jobOffers.find((o) => o.idJobOffer === jobOfferId);
      if (jobOffer) {
        jobOffer.activejoboffer = !jobOffer.activejoboffer;
      }
    },
    (error) => {
      console.error('Error toggling visibility:', error);
    }
  );
}

/************************************************************** company * job offers ************************************************* */
  
  getJobOffersDto() {
    this.offerService.getAllJobOffersWithCompany().subscribe(
      (data: JobOfferDTO[]) => {
        this.jobOffers = data;
      },
      (error) => {
        console.error('Error fetching job offers:', error);
      }
    );
  }

  getLogoUrl(id: number): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(`${this.companyService.host}/company/Imglogo/${id}`);
  }


  redirectToCandidatures(idCandidature: number) {
    this.router.navigate(['candidaturesList', idCandidature]);
  }
  

  redirectToDetails(idJobOffer: number): void {
    // Navigate to the detailsComponent with the job offer ID as a parameter
    this.router.navigate(['jobofferdetail', idJobOffer]);
  }
  
 

/*
  public getAllOffers(): void{
    this.offerService.getOffers().subscribe(
      (response: Offer[]) => {
        this.offersList= response;
      }, 
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }


  getOfById(idOffer: number){
    this.offerService.getOfferById(this.idOffer).subscribe(
      (response) => {
        this.data = response;
      }, 
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }
*/


public onDelOffer(idOffer: number) {
  console.log('onDelOffer called with id:', idOffer);
  Swal.fire({
    title: 'Are you sure?',
    icon: 'question',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.offerService.deleteOffer(idOffer).subscribe(
        (res) => {
          // Handle success here, if needed
          this.getJobOffersDto();
        },
        (error: HttpErrorResponse) => {
          
          console.error('Error deleting offer:', error);
          alert(error.message);
          // Handle the error here
        }
      );
    }
  });
}






/**
   image(url:any){
     
    return this.offer.offerImages;
  }
 */


}
