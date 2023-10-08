package tn.esprit.Entities;


 
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
 
import jakarta.persistence.Entity; 
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
 
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User  {

	  @Id
	  @GeneratedValue
	  private Integer id;
	  private String firstname;
	  private String lastname;
	  private String email;
	  private String password;



	 
}
