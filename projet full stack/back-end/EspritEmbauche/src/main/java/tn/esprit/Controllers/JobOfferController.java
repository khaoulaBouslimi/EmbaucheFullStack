package tn.esprit.Controllers;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tn.esprit.Entities.CountComp;
import tn.esprit.Entities.JobOffer;
import tn.esprit.Repositories.JobOfferRepository;
import tn.esprit.Services.JobOfferServiceI; 


@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
@RestController
@RequestMapping("/joboffer")
public class JobOfferController {

	
	@Autowired
	private JobOfferServiceI jobOfferService;
	
	@Autowired
	private JobOfferRepository jobrepo;
	
	
	
	//sstatistic
	@GetMapping("/percentCountCompany")
	public List<CountComp> getPercentageGroupByCompanysName(){
		return jobOfferService.getPercentageGroupByCompanysName();
	
	}
	
	@GetMapping("/total-count")
    public ResponseEntity<Long> getTotalJobOffersCount() {
        Long totalCount = jobOfferService.getTotalJobOffers();
        return ResponseEntity.ok(totalCount);
    }
    
	
	@GetMapping("/getJobOfferById/{id}")
    public JobOffer getJobOfferById(@PathVariable("id") Long idJobOffer) {
        return jobOfferService.getJobOfferById(idJobOffer);
    }
	
	
	@DeleteMapping("/delete/{idJobOffer}")
	public ResponseEntity<HttpStatus> deleteOffer(@PathVariable("idJobOffer") Long idJobOffer) {
	    try {
	        jobrepo.deleteById(idJobOffer);
	        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	    } catch (EmptyResultDataAccessException e) {
	        // Handle the case where the job offer with the provided ID is not found
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    } catch (Exception e) {
	        // Handle other exceptions, e.g., database errors
	        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	
	

    
  
    
    
    
	@GetMapping("/getAllJobOffers")
    public List<JobOffer> getAllJobOffers() {
        return jobrepo.findAll();
    }
	

	@PutMapping("/updatejoboffers/{id}")
	public ResponseEntity<JobOffer> updateJobOffer(@PathVariable Long id, @RequestBody JobOffer updatedJobOffer) {
	    // Check if the job offer with the given ID exists
	    Optional<JobOffer> existingJobOffer = jobrepo.findById(id);
	    if (!existingJobOffer.isPresent()) {
	        return ResponseEntity.notFound().build();
	    }

	    // Update the existing job offer
	    JobOffer jobOffer = existingJobOffer.get();
	    jobOffer.setCountry(updatedJobOffer.getCountry());
	    jobOffer.setLanguage(updatedJobOffer.getLanguage());
	    jobOffer.setJobTitle(updatedJobOffer.getJobTitle());
	    jobOffer.setDescription(updatedJobOffer.getDescription());
	    jobOffer.setJobType(updatedJobOffer.getJobType());
	    jobOffer.setExpLevel(updatedJobOffer.getExpLevel());
	    jobOffer.setEndDate(updatedJobOffer.getEndDate());
	    jobOffer.setStartDate(updatedJobOffer.getStartDate());
	    jobOffer.setWebsiteLink(updatedJobOffer.getWebsiteLink());
	    


	    // Save the updated job offer
	    JobOffer updatedOffer = jobrepo.save(jobOffer);
	    return ResponseEntity.ok(updatedOffer);
	}

 
	

	
}
