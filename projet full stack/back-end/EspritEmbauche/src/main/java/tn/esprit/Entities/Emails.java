package tn.esprit.Entities;





import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;




@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class Emails {

	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	@Column(name="idEmail")
	private Long idEmail; 
	
	@Column(name = "`to`")
	private String to;
	
	
    private String subject;
    
    private String body;
    
    private String  attachment;
    
    
	
    
}
