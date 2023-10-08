package tn.esprit.Entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List; 

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn; 
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class JobOffer {

	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idJobOffer;
	
	private String country;
	private String language;
	private String jobTitle;
	
	@Column(length = 2000)
	private String description;
	
	private String jobType;
	private String expLevel;
	private String offerDuration;
	
	@CreationTimestamp
    private LocalDate dateSoumission;
	
    private boolean hasExceededDuration;
    
    
    private String websiteLink;

    private boolean active = true;
    
    
     
    private LocalDate startDate;
 
    private LocalDate endDate;
    
    private int offersduration;
    
    private boolean activejoboffer;
	


	
	@OneToMany(mappedBy="joboffer", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Candidature> candidature = new ArrayList<>();
	
	
	@JsonIgnore
	@ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
	
	
	public boolean isHasExceededDuration() {
        return hasExceededDuration;
    }

    public void setHasExceededDuration(boolean hasExceededDuration) {
        this.hasExceededDuration = hasExceededDuration;
    }

	
    public boolean isActivejoboffer() {
        return activejoboffer;
    }

    public void setActivejoboffer(boolean activejoboffer) {
        this.activejoboffer = activejoboffer;
    }
    
    public Boolean getActivejoboffer() {
        return activejoboffer;
    }
    
//	private String profilCherche ;
//	private String competencesRequises;
//	private boolean annuler;
//	
//	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern ="yyyy-MM-dd")
//	private Date dateSoumission;
//	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
//	private Date dateCloture;

	
    
}
