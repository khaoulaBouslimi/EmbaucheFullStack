package tn.esprit.Entities;


import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;




@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class Candidature {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idCandidature;
	
	private String nometprenom;
	

	private String email;
	private String specialite;
	private String option;

	@Lob
	private byte[] cv;
    private String cvName;
    private String cvType;
    
    @Lob
    private byte[] lettreMotivation;  
    private String lettreMotivationName;  
    private String lettreMotivationType;  
    
	
	
    @JsonIgnore
	@ManyToOne
	@JoinColumn(name = "id_joboffer")
	private JobOffer joboffer;




	public Candidature(String nometprenom, String email, String specialite, String option) {
		super();
		this.nometprenom = nometprenom;
		this.email = email;
		this.specialite = specialite;
		this.option = option;
	}
}
