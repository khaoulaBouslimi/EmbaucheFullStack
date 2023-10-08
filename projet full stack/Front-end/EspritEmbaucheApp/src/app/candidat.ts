import { JobOfferDTO } from "./jobofferdto";

export interface Candidat {
  idCandidature: number;
  nometprenom: string;
  email: string;
  specialite: string;
  option: string;
  cv: string; 
  cvName: string;
  cvType: string;
  joboffer: JobOfferDTO;
    
  }

  