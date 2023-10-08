package tn.esprit.Services;

import java.util.List;


import tn.esprit.Entities.CountComp;
import tn.esprit.Entities.JobOffer;

public interface JobOfferServiceI {

	List<CountComp> getPercentageGroupByCompanysName();

	String getDaysSinceSubmission(Long jobOfferId);

	JobOffer getJobOfferById(Long idJobOffer);

	void deleteCompanyOffer(Long idJobOffer);

	Long getTotalJobOffers();


 

	
}
