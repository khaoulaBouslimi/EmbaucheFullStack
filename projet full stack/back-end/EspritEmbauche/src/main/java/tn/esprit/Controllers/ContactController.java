package tn.esprit.Controllers;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tn.esprit.Entities.Contact;
import tn.esprit.Repositories.ContactRepository; 

@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
@RequestMapping("/contact")
public class ContactController {
	
    @Autowired
    private ContactRepository contactRepository;
	
	@PostMapping("/submitmessage")
	public ResponseEntity<String> addContact(@RequestBody Contact contact) {
        try {
            Contact savedContact = contactRepository.save(contact);
            if (savedContact != null) {
                return ResponseEntity.ok("Message submitted successfully!");
            } else {
                return ResponseEntity.badRequest().body("Failed to submit the message.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error submitting the message.");
        }
    }
	
	@GetMapping("/getContacts")
	public ResponseEntity<List<Contact>> getContacts() {
	        List<Contact> contacts = contactRepository.findAll();
	        return ResponseEntity.ok(contacts);
	    }
	 
	@DeleteMapping("/delete/{contactId}")
	public ResponseEntity<String> deleteContact(@PathVariable Long contactId) {
	    try {
	        // Perform deletion logic here
	        contactRepository.deleteById(contactId);
	        return ResponseEntity.ok("Contact deleted successfully!");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete contact.");
	    }
	}

}
