package tn.esprit.Controllers;


import org.springframework.beans.factory.annotation.Autowired;
import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;
import tn.esprit.Services.EmailServiceImpl;



@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
@RestController
@RequestMapping("/email")
public class EmailController {
	
	
	@Autowired
    private EmailServiceImpl emailService;
	

    
    @PostMapping("/send-email")
    public ResponseEntity<?> sendEmail(@RequestParam("to") String to,
                                             @RequestParam("subject") String subject,
                                             @RequestParam("body") String body,
                                             @RequestParam(value = "attachment", required = false) MultipartFile attachment) {
        try {

            emailService.sendEmailWithAttachment(to, subject, body, attachment);
            return ResponseEntity.ok().body("{\"message\": \"Email sent successfully.\"}");
        } catch (MessagingException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"message\": \"Failed to send email.\"}");
        }
    }

    @PostMapping("/multiple")
    public ResponseEntity<?> sendEmailToMultipleRecipients(
    		@RequestParam("toaddresses") List<String> toaddresses,
    	    @RequestParam("subject") String subject,
    	    @RequestParam("body") String body,
    	    @RequestParam(value = "attachment", required = false) MultipartFile attachment) {
    	    try {
            emailService.sendEmailToMultipleRecipients(toaddresses, subject, body, attachment);
            return ResponseEntity.ok().body("{\"message\": \"Email sent successfully.\"}");
            } catch (MessagingException | IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("{\"message\": \"Failed to send email.\"}");
            }
        }


	
    
    
    
    
   
}
