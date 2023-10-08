package tn.esprit.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class OfferImages {
	

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long idImage;
	private String name;
    private String type;

    @Lob
    @Column(length = 50000000)
    private byte[] picByte;
    
    
    
    public OfferImages(String name, String type, byte[] picByte) {
		this.name= name;
		this.type= type;
		this.picByte = picByte;
	}

}
