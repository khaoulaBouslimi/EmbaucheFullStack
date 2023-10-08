package tn.esprit.Services;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAccessor;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import tn.esprit.Entities.CountComp;
import tn.esprit.Entities.JobOffer;
import tn.esprit.Repositories.JobOfferRepository;

@Service
public class JobOfferServiceImpl implements JobOfferServiceI {
	
	
	@Autowired
	private JobOfferRepository jobOfferRepository;

	
	@Override
	public List<CountComp> getPercentageGroupByCompanysName(){
		return jobOfferRepository.getPercentageGroupByCompanysName();
	}
	
	@Override
	public Long getTotalJobOffers() {
        return jobOfferRepository.count(); 
    }
	
	@Override
	public String getDaysSinceSubmission(Long jobOfferId) {
        JobOffer jobOffer = jobOfferRepository.findById(jobOfferId).orElse(null);
        if (jobOffer == null) {
            return "Job offer not found";
        }

        LocalDate submissionDate = jobOffer.getDateSoumission();
        LocalDate today = LocalDate.now();
        long daysSinceSubmission = ChronoUnit.DAYS.between(submissionDate, today);

        if (daysSinceSubmission == 0) {
            return "Today";
        } else {
            return daysSinceSubmission + " day(s) ago";
        }
    }
    
    public static LocalDate toLocalDate(TemporalAccessor temporal) {
        if (temporal instanceof LocalDate) {
            return (LocalDate) temporal;
        }
        return LocalDate.from(temporal);
    }
    
    
    @Override
    public JobOffer getJobOfferById(Long idJobOffer) {
        return jobOfferRepository.findByIdJobOffer(idJobOffer);
    }
    
    
    @Override
    public void deleteCompanyOffer(Long idJobOffer) {
    	JobOffer joboffer = jobOfferRepository.findById(idJobOffer)
                .orElseThrow(() -> new IllegalArgumentException("job offer not found"));

        jobOfferRepository.delete(joboffer);
    }
    
    
    public void deleteJobOfferById(Long idJobOffer) {
        Optional<JobOffer> jobOfferOptional = jobOfferRepository.findJobOfferByIdJobOffer(idJobOffer);
        if (jobOfferOptional.isPresent()) {
            JobOffer jobOffer = jobOfferOptional.get();
            jobOfferRepository.delete(jobOffer);
        } else {
            // Handle the case where the job offer with the given ID doesn't exist.
            throw new NoSuchElementException("JobOffer not found with ID: " + idJobOffer);
        }
    }
    

    
    

    
    
     
}
