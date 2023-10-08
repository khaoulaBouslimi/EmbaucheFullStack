import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { OfferService } from '../Services/offer.service';

import { HttpClient, HttpResponse , HttpErrorResponse } from '@angular/common/http';
import {  FormControl, FormGroup, NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { EmailService } from '../Services/email.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CompanyService } from '../Services/company.service';
import { JobOffer } from '../JobOffer';
import { Company } from '../company';
import Swal from 'sweetalert2';


import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css'],

})
export class OfferComponent implements OnInit {

  formGroup: FormGroup;

  @ViewChild('offerSection', { static: false }) offerSectionRef: ElementRef;
  @ViewChild('languageInput', { read: ElementRef }) languageInput: ElementRef | undefined;
  @ViewChild('countryInput', { read: ElementRef }) countryInput: ElementRef | undefined;
  @ViewChild('offerDurationInput', { read: ElementRef }) offerDurationInput: ElementRef | undefined;
  @ViewChild('expLevelInput', { read: ElementRef }) expLevelInput: ElementRef | undefined;
  @ViewChild('jobTypeInput', { read: ElementRef }) jobTypeInput: ElementRef | undefined;
  @ViewChild('jobTitleInput', { read: ElementRef }) jobTitleInput: ElementRef | undefined;
  @ViewChild('descriptionInput', { read: ElementRef }) descriptionInput: ElementRef | undefined;
  @ViewChild('startDateInput', { read: ElementRef }) startDateInput: ElementRef | undefined;
  @ViewChild('endDateInput', { read: ElementRef }) endDateInput: ElementRef | undefined;



  companyId: number; 
  jobOffer: JobOffer = {
    idOffre: 0,
    country: '',
    language: '',
    jobTitle: '',
    description: '',
    jobType: '',
    expLevel: '',
    offerDuration: '',
    hasExceededDuration: false,
    websiteLink:'',
    startDate: new Date(),
    endDate: new Date(),
    offersduration: 0,
    activejoboffer: true
  
  }; 

  


  selectedSection = 'section1';


  company: Company; 
  



  
  showError: boolean = false;

  constructor(private offerService: OfferService, private emailService: EmailService, private sanitizer: DomSanitizer,
              
              private router: Router,
              private route: ActivatedRoute,
              private companyService: CompanyService,
              private http: HttpClient,
              
              ) {
                this.formGroup = new FormGroup({
                  startDate: new FormControl(),
                  endDate: new FormControl(),
                });
              }

  ngOnInit(): void {

    this.formGroup = new FormGroup({
      startDate: new FormControl(),
      endDate: new FormControl(),
    });

    this.route.params.subscribe((params: Params) => {
      this.companyId = +params['id']; 
 
      this.getCompanyById(this.companyId);
    });


  }
  

  getCompanyById(companyId: number): void {
    this.companyService.getCompanyById(companyId).subscribe(
      (company: Company) => {
        this.company = company;
      },
      (error: any) => {
        console.error('Error retrieving company details:', error);
      }
    );
  }


  
  isLanguageInvalid: boolean = false;
  isCountryInvalid: boolean = false;
 // isOfferDurationInvalid: boolean = false;
  isExpLevelInvalid: boolean = false;
  isJobTypeInvalid: boolean = false;
  isJobTitleInvalid: boolean = false;
  isDescriptionInvalid: boolean = false;

  

 addJobOfferToCompany(companyId: number, jobOffer: JobOffer) {
  this.isLanguageInvalid = !jobOffer.language;
    this.isCountryInvalid = !jobOffer.country;
   // this.isOfferDurationInvalid = !jobOffer.offerDuration;
    this.isExpLevelInvalid = !jobOffer.expLevel;
    this.isJobTypeInvalid = !jobOffer.jobType;
    this.isJobTitleInvalid = !jobOffer.jobTitle;
    this.isDescriptionInvalid = !jobOffer.description;

    if (this.isLanguageInvalid && this.languageInput) {
      this.languageInput.nativeElement.classList.add('highlight-field');
    }
    if (this.isCountryInvalid && this.countryInput) {
      this.countryInput.nativeElement.classList.add('highlight-field');
    }
    /*
    if (this.isOfferDurationInvalid && this.offerDurationInput) {
      this.offerDurationInput.nativeElement.classList.add('highlight-field');
    }
    */
    if (this.isExpLevelInvalid && this.expLevelInput) {
      this.expLevelInput.nativeElement.classList.add('highlight-field');
    }
    if (this.isJobTypeInvalid && this.jobTypeInput) {
      this.jobTypeInput.nativeElement.classList.add('highlight-field');
    }
    if (this.isJobTitleInvalid && this.jobTitleInput) {
      this.jobTitleInput.nativeElement.classList.add('highlight-field');
    }
    if (this.isDescriptionInvalid && this.descriptionInput) {
      this.descriptionInput.nativeElement.classList.add('highlight-field');
    }

    if (
      this.isLanguageInvalid ||
      this.isCountryInvalid ||
      //this.isOfferDurationInvalid ||
      this.isExpLevelInvalid ||
      this.isJobTypeInvalid ||
      this.isJobTitleInvalid ||
      this.isDescriptionInvalid
    ) {
      return; // Don't submit the form if any field is unfilled
    }



  const url = `http://localhost:8000/company/jobOffers/${companyId}`;

  this.http.post(url, jobOffer, { responseType: 'text' }).subscribe(
    response => {
      console.log('JobOffer added to Company successfully', response);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Offre publiée avec succès',
        showConfirmButton: false,
        timer: 1500
      })
    },
    error => {
      console.error('Error adding JobOffer to Company', error);
    }
  );
}
  


  navigateToSection(sectionId: string) {
    this.selectedSection = sectionId;
  }


sendSectionToEmail() {
  const section = this.offerSectionRef.nativeElement.innerHTML;

  this.offerService.setEmailSection(section);
  this.router.navigate(['/email']);
}

redirectToAdminDashboard() {
  this.router.navigate(['adminDashboard']);
}

editorConfig = {
    editable: true,
    spellcheck: true,
    resizable: true,
    height: '300px', 
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    imageEndPoint: '',
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['alignLeft', 'alignCenter', 'alignRight'],
      ['link', 'unlink'],
    ],
  };

}









