export interface JobOffer {
    idOffre : number ,
  
    country: string,
    language: string,
    jobTitle: string,
    description: string,
  
    jobType: string,
    expLevel: string,
    offerDuration: string,
  

    hasExceededDuration: boolean;

    websiteLink: string,


    startDate: Date;
    endDate: Date;
    offersduration: number;
    
    activejoboffer: boolean;
  
  }