import { Component, OnInit } from '@angular/core';
import { OfferService } from '../Services/offer.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Offer } from '../offer';
import { Router } from '@angular/router';
import { JobOfferDTO } from '../jobofferdto';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CompanyService } from '../Services/company.service';
import { EmailSubscription } from '../subscription';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-joboffers',
  templateUrl: './joboffers.component.html',
  styleUrls: ['./joboffers.component.css'],

})
export class JoboffersComponent implements OnInit {

  jobOffers: JobOfferDTO[] = [];


  public offersList: Offer[];

  //selectedOffer: Offer | undefined;

  selectedOffer: JobOfferDTO | undefined;

  emailForm: FormGroup;

  constructor(private offerService:OfferService, 
              private router: Router,
              public companyService:CompanyService,
              private sanitizer: DomSanitizer,
              private http: HttpClient,
              private formBuilder: FormBuilder) {
                this.emailForm = this.formBuilder.group({
                  email: ['', [Validators.required, this.emailValidator]],
                });
              }

  ngOnInit(): void {










    
    this.fetchVisibleJobOfferss();


    //this.getJobOffersDto();
    
    //this.getAllOffers();
  }


  /******************************* search ************************************* */

  searchKeyword: string = '';
  searchCity: string = '';
  applySearchFilter() {
    this.filteredJobOffers = this.jobOffers.filter((offer) =>
      this.filterByKeywordsAndCity(offer)
    );
  }

  filterByKeywordsAndCity(offer: JobOfferDTO): boolean {
    const keywordMatch =
      this.searchKeyword === '' ||
      offer.jobTitle.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
      offer.companySname.toLowerCase().includes(this.searchKeyword.toLowerCase()) 
      ;
    const cityMatch =
      this.searchCity === '' ||
      offer.country.toLowerCase().includes(this.searchCity.toLowerCase());

    return keywordMatch && cityMatch;
  }

  /***************************** subscribe ************************************ */

  isCardVisible = true;

  hideCard() {
      this.isCardVisible = false;
  }

  email: string = '';
  isSubscribed: boolean = false;
  message: string = '';

 
 
// Custom email validator function
emailValidator(control: FormControl): { [key: string]: any } | null {
  if (!control.dirty) {
    // Only validate if the field has been touched or modified
    return null;
  }

  const validEmailPattern = /@esprit\.tn$/i; // Regular expression for email validation

  if (!validEmailPattern.test(control.value)) {
    return { invalidEmail: true };
  }

  return null;
}

  
  
  subscribe() {
    if (this.emailForm.valid) {
      // Form is valid, continue with submission
      const email = this.emailForm.value.email;
      console.log('Form submitted with valid email:', email);
  
      // Call your service method here with the valid email
      this.offerService.subscribeEmail(email).subscribe(
        (response: string) => {
          this.message = response;
          this.emailForm.reset(); // Reset the form
          Swal.fire({
            title: 'Success',
            html: '<div style="font-size: 17px;">Votre alerte d emploi est activée ! </div>',
            icon: 'success'
          });
        },
        (error) => {
          console.error(error);
          this.message = "An error occurred";
        }
      );
    } else {
      // Form is invalid, display errors
      this.emailForm.markAllAsTouched();
    }
  }
  
  
  

  unsubscribe() {
    this.offerService.unsubscribeEmail(this.email)
      .subscribe(
        (response: string) => {
          this.message = response;
          this.email = ''; // Reset the email input field
        },
        (error) => {
          console.error(error);
          this.message = "An error occurred";
        }
      );
  }



  /****************************** filter ******************************** */

  filteredJobOffers: JobOfferDTO[] = [];
  showFilterCard = false;
  filterOptions = {
    stageEte: false,
    stageIngenieur: false,
    stagePFE: false,
    CDD: false,
    CDI: false,
  };

  applyFilter(): void {
    const { stagePFE, stageIngenieur, stageEte, CDI, CDD } = this.filterOptions;
    this.filteredJobOffers = this.jobOffers.filter(jobOffer => {
      // Filter logic based on selected options
      // For example:
      return (
        (!stageEte || jobOffer.jobType === 'Stage d\'été') &&
        (!stageIngenieur || jobOffer.jobType === 'Stage Ingénieur') &&
        (!stagePFE || jobOffer.jobType === 'Stage PFE') &&
        (!CDD || jobOffer.jobType === 'CDD') &&
        (!CDI || jobOffer.jobType === 'CDI')
      );
    });
  
    // Close the filter card after applying the filter
    this.toggleFilterCard();
  }
  
  



  //showFilterCard: boolean = false;

  toggleFilterCard() {
    this.showFilterCard = !this.showFilterCard;
  }
  
/******************************************************************* */

  /*

  showDetails(offer: Offer) {
    this.selectedOffer = offer;
  }
  */

  showDetails(offer: JobOfferDTO) {
    this.selectedOffer = offer;
  }

   

  fetchVisibleJobOfferss() {
    this.http.get<JobOfferDTO[]>('http://localhost:8000/company/getAllNonExpiredJobOffers').subscribe(
      (data: JobOfferDTO[]) => { 
        this.jobOffers = data.filter(jobOffer => jobOffer.activejoboffer );

        this.filteredJobOffers = this.jobOffers.slice(); // Initialize filteredJobOffers with all jobOffers
       },
      (error) => {
        console.error('Error fetching job offers:', error);
      }
    );
  }

  
 
  
  
  
  

  /************************************************************** company * job offers************************************************************** */
  
  getJobOffersDto() {
    this.offerService.getAllNonExpiredJobOffers().subscribe(
      (data: JobOfferDTO[]) => {
        this.jobOffers = data;
      },
      (error) => {
        console.error('Error fetching job offers:', error);
      }
    );
  }

  getLogoUrl(id: number): SafeUrl {
    console.log('Company ID:', id);

    return this.sanitizer.bypassSecurityTrustUrl(`${this.companyService.host}/company/Imglogo/${id}`);
  }

  

  



postuler(jobOfferId: number, jobTitle: string) {
  this.router.navigate(['/postuler', jobOfferId, { jobTitle: jobTitle }]);
}










hasJobOfferExpired(jobOffer: JobOfferDTO): boolean {
  // Check if the end date has been exceeded
  return new Date(jobOffer.endDate) < new Date();
}





}
