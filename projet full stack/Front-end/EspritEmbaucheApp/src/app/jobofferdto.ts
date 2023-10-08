export class JobOfferDTO {
    
    idJobOffer: number;
    country: string;
    language: string;
    jobTitle: string;
    description: string;
    jobType: string;
    expLevel: string;
    offerDuration: string;

    companyId: number;
    companySname: string;
    nbrEmployees: string;
    address: string;
    numTel: string;
    fileName: string;

    dateSoumission: string; 
    daysSinceSubmission: number;

    hasExceededDuration: boolean;

    active: boolean;

  daysSinceExpiration: number;


  daysRemaining:number;

    startDate: Date;
    endDate: Date;
    offersduration: number;
    activejoboffer: boolean;

    websiteLink: string;


    constructor() {
      this.idJobOffer = 0;
      this.country = '';
      this.language = '';
      this.jobTitle = '';
      this.description = '';
      this.jobType = '';
      this.expLevel = '';
      this.offerDuration = '';
  
      this.companyId = 0;
      this.companySname = '';
      this.nbrEmployees = '';
      this.address = '';
      this.numTel = '';
      this.fileName = '';
  
      this.dateSoumission = '';
      this.daysSinceSubmission = 0;
      //this.visible = true;
    }

  }
  