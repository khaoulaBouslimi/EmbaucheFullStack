import { FileHandle } from "src/_model/file-handle.model";

export interface Offer {
    idOffre : number ,
	companySname: string,
	nbrEmployees: string,
	firstAndLastname: string,
	numTel: string,
	
	country: string,
	language: string,
	jobTitle: string,
	description: string,
	
	jobType: string,
	expLevel: string,
	nbrCandaidats: string,
	offerDuration: string,

	offerImages: FileHandle[]

	dateAdded: string; 


}