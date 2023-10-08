package tn.esprit.Entities;


import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class JobOfferDTO {
	
	private Long idJobOffer;
    private String country;
    private String language;
    private String jobTitle;
    private String description;
    private String jobType;
    private String expLevel;
    private String offerDuration;
    private LocalDate dateSoumission;
    private long daysSinceSubmission; 
    
    private LocalDate expirationDate;
    
    private boolean hasExceededDuration;
    
    private boolean active = true;
    
    
    private LocalDate startDate;
    private LocalDate endDate;
    private int daysRemaining;
    private int offersduration;    
    private boolean activejoboffer;
    
 
    private String websiteLink;
    
    private Long companyId;
    private String companySname;
    private String nbrEmployees;
    private String address;
    private String numTel;
    private String fileName;
    
    public boolean isActivejoboffer() {
        return activejoboffer;
    }

    public void setActivejoboffer(boolean activejoboffer) {
        this.activejoboffer = activejoboffer;
    }
    
    public Boolean getActivejoboffer() {
        return activejoboffer;
    }

     
    
}
