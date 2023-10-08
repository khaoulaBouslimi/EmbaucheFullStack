package tn.esprit.Controllers;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletContext;
import tn.esprit.Entities.Company;
import tn.esprit.Entities.JobOffer;
import tn.esprit.Entities.JobOfferDTO; 
import tn.esprit.Repositories.JobOfferRepository;
import tn.esprit.Services.CompanyServiceImpl;
import tn.esprit.Services.EmailServiceI;
import tn.esprit.Services.SubscriptionServiceI;


@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
@RequestMapping("/company")
public class CompanyController {

	@Autowired
	private CompanyServiceImpl companyService;
	
	
	@Autowired
	private JobOfferRepository jobOfferRepository;
	
	
	@Autowired
	private EmailServiceI emailService;
	
	@Autowired
	private SubscriptionServiceI subscriptionService; 

	
	
	@Autowired  ServletContext context;
	
	@PostMapping("/createCompany")
	public ResponseEntity<Long> createCompany(@RequestParam("file") MultipartFile file, @RequestParam("company") String company) {
	    try {
	        Company arti = new ObjectMapper().readValue(company, Company.class);

	        boolean isExit = new File(context.getRealPath("/Images/")).exists();
	        if (!isExit) {
	            new File(context.getRealPath("/Images/")).mkdir();
	        }

	        String filename = file.getOriginalFilename();
	        String newFileName = FilenameUtils.getBaseName(filename) + "." + FilenameUtils.getExtension(filename);
	        File serverFile = new File(context.getRealPath("/Images/" + File.separator + newFileName));

	        FileUtils.writeByteArrayToFile(serverFile, file.getBytes());

	        arti.setFileName(newFileName);
	        long companyId = companyService.save(arti);

	        return ResponseEntity.ok(companyId);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}

	 
	 
	@GetMapping("/Imglogo/{id}")
	 public byte[] getPhoto(@PathVariable("id") Long id) throws Exception{
		 Company Company   =companyService.findById(id).get();
		 return Files.readAllBytes(Paths.get(context.getRealPath("/Images/")+Company.getFileName()));
	 }
	
	@GetMapping("/oImglogo/{filename:.+}")
	public ResponseEntity<byte[]> getPhotoo(@PathVariable("filename") String filename) {
	    try {
	        File imageFile = new File(context.getRealPath("/Images/") + filename);

	        if (!imageFile.exists()) {
	            return ResponseEntity.notFound().build();
	        }

	        byte[] imageBytes = Files.readAllBytes(imageFile.toPath());

	        HttpHeaders headers = new HttpHeaders();

	        if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
	            headers.setContentType(MediaType.IMAGE_JPEG);
	        } else if (filename.toLowerCase().endsWith(".png")) {
	            headers.setContentType(MediaType.IMAGE_PNG);
	        } else {
	            // Handle other image types here, or return an error response
	            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).build();
	        }

	        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}

	
	@GetMapping("/allcompanies")
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	 public List<Company> list() {
		 System.out.println("Get all Companies...");
	             return companyService.getAllCompanies();
	   }
	
	

	@GetMapping("/getCompanyById/{id}")
    public Company getCompanyById(@PathVariable Long id) {
        return companyService.getCompanyById(id);
    }

	
	
	@GetMapping("/getImageById/{imageId}")
	public ResponseEntity<byte[]> getImageById(@PathVariable Long imageId) {
	    try {
	        // Retrieve the image file based on the provided imageId
	        File imageFile = new File(context.getRealPath("/Images/" + imageId));
	        
	        if (imageFile.exists()) {
	            // Read the image file into a byte array
	            byte[] imageBytes = FileUtils.readFileToByteArray(imageFile);
	            
	            // Create an HTTP response with the image content
	            HttpHeaders headers = new HttpHeaders();
	            headers.setContentType(MediaType.IMAGE_JPEG); // Set the appropriate content type
	            
	            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
	        } else {
	            // Image file not found
	            return ResponseEntity.notFound().build();
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}
	
	

	
	/******************* company * job offer *********************/
	
	@PostMapping("/jobOffers/{companyId}")
    public ResponseEntity<String> addJobOfferToCompany(
            @PathVariable Long companyId,
            @RequestBody JobOffer jobOffer
    ) {
		
	    LocalDate startDate = jobOffer.getStartDate(); // Retrieve the start date from the request
	    LocalDate endDate = jobOffer.getEndDate(); // Retrieve the end date from the request

	    // Set the start and end dates in the JobOffer object
	    jobOffer.setStartDate(startDate);
	    jobOffer.setEndDate(endDate);
	    
	    // Calculate the offer duration
	    int offerDuration = calculateOfferDuration(startDate, endDate);
	    jobOffer.setOffersduration(offerDuration);
	    
	 // Set activejoboffer to true
	   // jobOffer.setActivejoboffer(true);
	    
	    // Set the activejoboffer property based on the offer duration
	    boolean activejoboffer = LocalDate.now().isBefore(endDate.plusDays(1));
	    jobOffer.setActivejoboffer(activejoboffer);

	 // Update the JobOffer in the database
	    jobOfferRepository.save(jobOffer);
	    
        companyService.addJobOfferToCompany(companyId, jobOffer);
        
     // Send job offer alert email
        sendJobOfferAlertEmail(jobOffer);


        return ResponseEntity.ok("JobOffer added to Company successfully");
    }
	
	
	private int calculateOfferDuration(LocalDate startDate, LocalDate endDate) {
	    // Calculate the difference in days between the start and end dates
	    return (int) ChronoUnit.DAYS.between(startDate, endDate);
	}
	
	
	
	
	
	
	
	
	
	private void sendJobOfferAlertEmail(JobOffer jobOffer) {
	    String subject = "Nouvelle offre d'emploi disponible";
	    String message = "Une nouvelle offre d'emploi a été publiée. Consultez-la sur notre site.<br>" +
	            "<strong>Offre d'emploi pour :</strong> " + jobOffer.getJobTitle();

	    // Retrieve the list of subscribed emails from your database
	    List<String> subscribedEmails = subscriptionService.getSubscribedEmails();

	    // Send the email to all subscribed recipients
	    for (String email : subscribedEmails) {
	        emailService.sendEmail(email, subject, message);
	    }
	}

	
	
	
	
	
	
	
	
	
	
	
	
	@DeleteMapping("/delete/{companyId}")
    public ResponseEntity<String> deleteCompany(@PathVariable Long companyId) {
        companyService.deleteCompany(companyId);
     // Assuming the deletion is successful, return a JSON response
        return ResponseEntity.ok("{\"message\": \"Company and related job offers deleted\"}");
    }
	
	

	
	@GetMapping("/getAllJobOffersWithCompanyInfo")
	public List<JobOfferDTO> getAllJobOffersWithCompanyInfo() {
	    List<JobOffer> jobOffers = jobOfferRepository.findAll();
	    List<JobOfferDTO> jobOfferDTOs = new ArrayList<>();

	    for (JobOffer jobOffer : jobOffers) {
	        JobOfferDTO jobOfferDTO = new JobOfferDTO();
	        jobOfferDTO.setIdJobOffer(jobOffer.getIdJobOffer());
	        jobOfferDTO.setCountry(jobOffer.getCountry());
	        jobOfferDTO.setLanguage(jobOffer.getLanguage());
	        jobOfferDTO.setJobTitle(jobOffer.getJobTitle());
	        jobOfferDTO.setDescription(jobOffer.getDescription());
	        jobOfferDTO.setJobType(jobOffer.getJobType());
	        jobOfferDTO.setExpLevel(jobOffer.getExpLevel());
	        jobOfferDTO.setWebsiteLink(jobOffer.getWebsiteLink());
// bch yet3awdhou
//	        jobOfferDTO.setOfferDuration(jobOffer.getOfferDuration());
//	        
//	        jobOfferDTO.setActive(jobOffer.isActive());
//	        
//	        jobOfferDTO.setHasExceededDuration(jobOffer.isHasExceededDuration());
// jdod : 
	        
	        jobOfferDTO.setStartDate(jobOffer.getStartDate());
	        
	        jobOfferDTO.setEndDate(jobOffer.getEndDate());

	        jobOfferDTO.setOffersduration(jobOffer.getOffersduration());

	        jobOfferDTO.setActivejoboffer(jobOffer.isActivejoboffer());


	        
//	     // Calculate the offer duration and set the activejoboffer property
//	        LocalDate startDate = jobOffer.getStartDate();
//	        LocalDate endDate = jobOffer.getEndDate();
//	        if (startDate != null && endDate != null) {
//	            int offerDuration = (int) ChronoUnit.DAYS.between(startDate, endDate);
//	            jobOfferDTO.setOffersduration(offerDuration);
//
//	            boolean activejoboffer = LocalDate.now().isBefore(endDate.plusDays(1));
//	            jobOfferDTO.setActivejoboffer(activejoboffer);
//	            
//	         // Update the activejoboffer value in the database
//	            jobOffer.setActivejoboffer(activejoboffer);
//	            jobOfferRepository.save(jobOffer);
//	        }
	        
	     // Check if activejoboffer property hasn't been set yet
	        if (jobOffer.getActivejoboffer() == null) {
	            LocalDate startDate = jobOffer.getStartDate();
	            LocalDate endDate = jobOffer.getEndDate();
	            if (startDate != null && endDate != null) {
	                int offerDuration = (int) ChronoUnit.DAYS.between(startDate, endDate);
	                jobOfferDTO.setOffersduration(offerDuration);

	                boolean activejoboffer = LocalDate.now().isBefore(endDate.plusDays(1));
	                jobOfferDTO.setActivejoboffer(activejoboffer);

	                // Update the activejoboffer value in the database
	                jobOffer.setActivejoboffer(activejoboffer);
	                jobOfferRepository.save(jobOffer);
	            }
	        } else {
	            // If activejoboffer has been set, use the existing value from the database
	            jobOfferDTO.setActivejoboffer(jobOffer.getActivejoboffer());
	        }
	        
	        
	        
	        Company company = jobOffer.getCompany();
	        jobOfferDTO.setCompanyId(company.getId());
	        jobOfferDTO.setCompanySname(company.getCompanySname());
	        jobOfferDTO.setNbrEmployees(company.getNbrEmployees());
	        jobOfferDTO.setAddress(company.getAdress());
	        jobOfferDTO.setNumTel(company.getNumTel());
	        jobOfferDTO.setFileName(company.getFileName());
	        
	         

	        jobOfferDTOs.add(jobOfferDTO);
	    }

	    return jobOfferDTOs;
	}
	
	
	@PutMapping("/toggleJobOfferVisibility/{jobOfferId}")
	public ResponseEntity<Object> toggleJobOfferVisibility(@PathVariable Long jobOfferId) {
        Optional<JobOffer> jobOfferOptional = jobOfferRepository.findById(jobOfferId);

        if (jobOfferOptional.isPresent()) {
            JobOffer jobOffer = jobOfferOptional.get();
            boolean newVisibilityStatus = !jobOffer.isActivejoboffer(); // Toggle the status
            jobOffer.setActivejoboffer(newVisibilityStatus);
            jobOfferRepository.save(jobOffer);
            return ResponseEntity.ok().body("Job offer visibility toggled successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
	 

	  @GetMapping("/{companyId}/job-offers/count")
	  public ResponseEntity<Integer> getJobOffersCountByCompanyId(@PathVariable Long companyId) {
	    int offerCount = companyService.getNumberOfOffersByCompanyId(companyId);
	    return ResponseEntity.ok(offerCount);
	  }
	


	  @PutMapping("/updatecompany/{id}")
	    public ResponseEntity<Company> updateCompany(@PathVariable Long id, @RequestBody Company updatedCompany) {
	        Company updated = companyService.updateCompany(id, updatedCompany);
	        return ResponseEntity.ok(updated);
	    }



    

			@GetMapping("/getAllNonExpiredJobOffers")
			public List<JobOfferDTO> getAllNonExpiredJobOffers() {
			    LocalDate currentDate = LocalDate.now();
			    List<JobOffer> expiredJobOffers = jobOfferRepository.findByEndDateAfter(currentDate);

			    List<JobOfferDTO> jobOfferDTOs = new ArrayList<>();

			    for (JobOffer jobOffer : expiredJobOffers) {
			        JobOfferDTO jobOfferDTO = new JobOfferDTO();

			        jobOfferDTO.setIdJobOffer(jobOffer.getIdJobOffer());
			        jobOfferDTO.setCountry(jobOffer.getCountry());
			        jobOfferDTO.setLanguage(jobOffer.getLanguage());
			        jobOfferDTO.setJobTitle(jobOffer.getJobTitle());
			        jobOfferDTO.setDescription(jobOffer.getDescription());
			        jobOfferDTO.setJobType(jobOffer.getJobType());
			        jobOfferDTO.setExpLevel(jobOffer.getExpLevel());
			        jobOfferDTO.setWebsiteLink(jobOffer.getWebsiteLink());

			        jobOfferDTO.setStartDate(jobOffer.getStartDate());
			        jobOfferDTO.setEndDate(jobOffer.getEndDate());

			        jobOfferDTO.setOffersduration(jobOffer.getOffersduration());

			        if (jobOffer.getActivejoboffer() == null) {
			            LocalDate startDate = jobOffer.getStartDate();
			            LocalDate endDate = jobOffer.getEndDate();

			            if (startDate != null && endDate != null) {
			                int offerDuration = (int) ChronoUnit.DAYS.between(startDate, endDate);
			                jobOfferDTO.setOffersduration(offerDuration);

			                boolean activejoboffer = LocalDate.now().isBefore(endDate.plusDays(1));
			                jobOfferDTO.setActivejoboffer(activejoboffer);

			                // Update the activejoboffer value in the database
			                jobOffer.setActivejoboffer(activejoboffer);
			                jobOfferRepository.save(jobOffer);
			            }
			        } else {
			            // If activejoboffer has been set, use the existing value from the database
			            jobOfferDTO.setActivejoboffer(jobOffer.getActivejoboffer());
			        }

			        Company company = jobOffer.getCompany();
			        jobOfferDTO.setCompanyId(company.getId());
			        jobOfferDTO.setCompanySname(company.getCompanySname());
			        jobOfferDTO.setNbrEmployees(company.getNbrEmployees());
			        jobOfferDTO.setAddress(company.getAdress());
			        jobOfferDTO.setNumTel(company.getNumTel());
			        jobOfferDTO.setFileName(company.getFileName());

			        jobOfferDTOs.add(jobOfferDTO);
			    }

			    return jobOfferDTOs;
			}

    
    
    
    
	
}
