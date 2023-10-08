import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Contact } from '../contact';
import { ContactService } from '../Services/contact.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CompanyService } from '../Services/company.service';
import { JobOfferDTO } from '../jobofferdto';
import { OfferService } from '../Services/offer.service';
import { Company } from '../company';

 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slideIn', [
      state('hidden', style({ transform: 'translateY(100%)' })),
      state('visible', style({ transform: 'translateY(0)' })),
      transition('hidden => visible', animate('1000ms ease-in-out')),
    ]),
    trigger('fadeIn', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', animate('1500ms ease-in-out')),
    ]),
    trigger('slideAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate('20s linear', style({ transform: 'translateX(-100%)' }))
      ])
    ]),
    trigger('slideToRight', [
      state('hidden', style({ transform: 'translateX(-100%)' })),
      state('visible', style({ transform: 'translateX(0)' })),
      transition('hidden => visible', animate('900ms ease-in')),
    ]), 
  ]
})





export class HomeComponent implements OnInit {

  liveJobsCount = 8000;
  companiesCount = 802;
  candidatesCount = 689;
  newJobsCount = 102;

  currentLiveJobsCount = 0;
  currentCompaniesCount = 0;
  currentCandidatesCount = 0;
  currentNewJobsCount = 0; 

  private countersInitialized = false;



  companies: JobOfferDTO[] = [];
  
  jobOffer: JobOfferDTO[] = [];


  companiess: Company[] = [];

  currentIndex = 0;
  slideInterval = 10000; // 5 seconds
  intervalId: any;

  animationState = 'in'; // Set the initial animation state to 'in'
  animationStateFadeIn: string = 'hidden';
  animationStateFadeInn: string = 'hidden';


  animationStateLiveJobs = 'hidden';
  animationStateCandidates = 'hidden';
  animationStateOtherCounter = 'hidden';


  id: any
  nometprenom: string;
  email: string;
  tel: string;
  sujet: string;
  message: string;

  animationStates: 'hidden' | 'visible' = 'hidden';


  constructor(private contactService: ContactService, private http: HttpClient, 
              public companyService:CompanyService,
              private offerService:OfferService, 
              private sanitizer: DomSanitizer,
              private elementRef: ElementRef
              ) { }

              

  ngOnInit(): void {
    
    this.startCarousel();
        
    this.getJobOffersDto();

    this.checkIfInView(); // Check if the section is initially in view
    
    this.initializeCounters();
  }


 

  initializeCounters(): void {
    this.currentLiveJobsCount = 0;
    this.currentCompaniesCount = 0;
    this.currentCandidatesCount = 0;
    this.currentNewJobsCount = 0;
  }

  
  
  getJobOffersDto() {
    this.http.get<JobOfferDTO[]>('http://localhost:8000/company/getAllJobOffersWithCompanyInfo').subscribe(
      (data: JobOfferDTO[]) => {  
 
        this.companies = data;
        },
      (error) => {
        console.error('Error fetching job offers:', error);
      }
    );
  }

  numbersArray: number[] = [1, 2, 3, 6, 7, 4];

  getLogoUrl(fileName: string): SafeUrl {
    console.log('File Name:', fileName);
    return this.sanitizer.bypassSecurityTrustUrl(`${this.companyService.host}/company/oImglogo/${fileName}`);
}


getUniqueFileNames(companies: JobOfferDTO[]): string[] {
  const uniqueFileNames = [...new Set(companies.map(company => company.fileName))];
  return uniqueFileNames;
}

  

  

  startCarousel() {
    setInterval(() => {
      this.animationState = this.animationState === 'in' ? 'out' : 'in';
    }, 10000); // Adjust the interval as per your preference
  }
  

  @HostListener('window:scroll', ['$event'])
  checkIfInView() {
    const contactSection = document.querySelector('#contact');
  
    if (contactSection) {
      const rect = contactSection.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        this.animationState = 'visible';
      } else {
        this.animationState = 'hidden';
      }
    }


    //new effect 
    const sectionFadeIn = document.querySelector('#section-fade-in');

  if (sectionFadeIn) {
    const rect = sectionFadeIn.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0) {
      this.animationStateFadeIn = 'visible';
    } else {
      this.animationStateFadeIn = 'hidden';
    }
  }

  //new effect 
  const sectionFadeInn = document.querySelector('#section-fade-inn');

  if (sectionFadeInn) {
    const rect = sectionFadeInn.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0) {
      this.animationStateFadeInn = 'visible';
    } else {
      this.animationStateFadeInn = 'hidden';
    }
  }

  //new effect 
  const sectionSlideRight = document.querySelector('#section-slide-right');

    if (sectionSlideRight) {
      const rect = sectionSlideRight.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        this.animationStates = 'visible';
      } else {
        this.animationStates = 'hidden';
      }
    }
  


    //new effect 
    const liveJobsSection = document.querySelector('#liveJobsSection'); // Replace with the actual ID of the section
    if (liveJobsSection) {
      const rect = liveJobsSection.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        this.animateCounters();
      }
    }

  }
  



  

  animateCounters(): void {
    const interval = 110; // Duration of each animation step in milliseconds
    const steps = 100; // Total number of animation steps

    const liveJobsStep = Math.ceil(this.liveJobsCount / steps);
    const companiesStep = Math.ceil(this.companiesCount / steps);
    const candidatesStep = Math.ceil(this.candidatesCount / steps);
    const newJobsStep = Math.ceil(this.newJobsCount / steps);

    const animate = () => {
      if (this.currentLiveJobsCount < this.liveJobsCount) {
        this.currentLiveJobsCount += liveJobsStep;
      }
      if (this.currentCompaniesCount < this.companiesCount) {
        this.currentCompaniesCount += companiesStep;
      }
      if (this.currentCandidatesCount < this.candidatesCount) {
        this.currentCandidatesCount += candidatesStep;
      }
      if (this.currentNewJobsCount < this.newJobsCount) {
        this.currentNewJobsCount += newJobsStep;
      }

      if (
        this.currentLiveJobsCount >= this.liveJobsCount &&
        this.currentCompaniesCount >= this.companiesCount &&
        this.currentCandidatesCount >= this.candidatesCount &&
        this.currentNewJobsCount >= this.newJobsCount
      ) {
        clearInterval(intervalId);
      }
    };

    const intervalId = setInterval(animate, interval);
  }

  














 
  onSubmit(form: NgForm): void {
    if (form.valid) {
      const contact: Contact = {
        id:this.id,
        nometprenom: this.nometprenom,
        email: this.email,
        tel: this.tel,
        sujet: this.sujet,
        message: this.message
      };

      this.contactService.addContact(contact).subscribe(
        () => {
          console.log('Message submitted successfully!');
          Swal.fire({
            title: 'Success',
            html: '<div style="font-size: 17px;">Votre réclamation a été envoyer ! </div>',
            icon: 'success'
          });
          form.resetForm();
        },
        (error) => {
          Swal.fire('Error', 'Erreur lors de la soumission du complaint.', 'error');
          console.error('Error submitting the message:', error);
        }
      );
    }
  }


  
}  