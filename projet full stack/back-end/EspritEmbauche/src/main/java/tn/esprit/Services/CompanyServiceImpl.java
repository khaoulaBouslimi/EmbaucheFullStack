package tn.esprit.Services;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import tn.esprit.Entities.Company;
import tn.esprit.Entities.JobOffer;
import tn.esprit.Repositories.CompanyRepsitory;


@Service
public class CompanyServiceImpl {

	@Autowired
	private CompanyRepsitory companyRepository;
	
	
	
	public long save(Company company) {
    	
		System.out.println("Save company");
		
		Company comp = new Company();
		
		comp.setCompanySname(company.getCompanySname());
		comp.setAdress(company.getAdress());
		comp.setAdress(company.getAdress());
		comp.setNumTel(company.getNumTel());
		comp.setNbrEmployees(company.getNbrEmployees());
		
        return companyRepository.save(company)
                             .getId();
    }
	
	
	
	public Optional<Company> findById(Long id) {
		  return companyRepository.findById(id);
	}
	
	public Company getCompanyById(Long companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }
	


	  
	  
	  public int getNumberOfOffersByCompanyId(Long companyId) {
		    return companyRepository.countJobOffersByCompanyId(companyId);
		  }
	
	public List<Company> getAllCompanies() {
      return companyRepository.findAll();
  }
	
	/************************************ company * jobOffer *****************************************/
	
	public void addJobOfferToCompany(Long companyId, JobOffer jobOffer) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with ID: " + companyId));

        jobOffer.setCompany(company);
        company.getJobOffer().add(jobOffer);
        
     // Set the active field to true for the new job offer
       // jobOffer.setActive(true);
        
    

        companyRepository.save(company);
     
    }
	
	
	
	
	@Transactional
    public void deleteCompany(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        companyRepository.delete(company);
    }
	
	// to delete
	public boolean hasExceededOfferDuration2(JobOffer jobOffer) {
        LocalDate submissionDate = jobOffer.getDateSoumission();
        if (submissionDate != null) {
            LocalDate today = LocalDate.now();
            long daysSinceSubmission = ChronoUnit.DAYS.between(submissionDate, today);
            int offerDuration = Integer.parseInt(jobOffer.getOfferDuration());
            return daysSinceSubmission > offerDuration;
        }
        return false; // Return false if submission date is null
    }
	
	public boolean hasExceededOfferDuration(JobOffer jobOffer) {
	    LocalDate submissionDate = jobOffer.getDateSoumission();
	    if (submissionDate != null) {
	        LocalDate today = LocalDate.now();
	        long daysSinceSubmission = ChronoUnit.DAYS.between(submissionDate, today);
	        String offerDuration = jobOffer.getOfferDuration();
	        int durationValue = extractNumericValue(offerDuration);
	        
	        return daysSinceSubmission > durationValue;
	    }
	    return false; // Return false if submission date is null
	}

	private int extractNumericValue(String duration) {
	    String numericPart = duration.replaceAll("\\D+", ""); // Remove non-numeric characters
	    try {
	        return Integer.parseInt(numericPart);
	    } catch (NumberFormatException e) {
	        // Handle invalid numeric values
	        return 0; // Set a default value or throw an exception
	    }
	}
	
	
	public Company updateCompany(Long companyId, Company updatedCompany) {
        Optional<Company> existingCompany = companyRepository.findById(companyId);

        if (existingCompany.isPresent()) {
            Company company = existingCompany.get();
            company.setCompanySname(updatedCompany.getCompanySname());
            company.setNbrEmployees(updatedCompany.getNbrEmployees());
            company.setAdress(updatedCompany.getAdress());
            company.setNumTel(updatedCompany.getNumTel());

            return companyRepository.save(company);
        } else {
            throw new EntityNotFoundException("Company not found with ID: " + companyId);
        }
    }


	
}
