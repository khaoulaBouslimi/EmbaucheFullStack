package tn.esprit.Services;





import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;



@Service
public class EmailServiceImpl implements EmailServiceI{

	@Autowired
    private JavaMailSender mailSender;
	
	
	@Autowired
    private JavaMailSender javaMailSender;
	
	@Override
    public void sendEmailWithAttachment(String to, String subject, String body, MultipartFile attachment) throws MessagingException, IOException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom("your.email@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);
        
        if (attachment != null && !attachment.isEmpty()) {
            helper.addAttachment(attachment.getOriginalFilename(), new ByteArrayDataSource(attachment.getBytes(), attachment.getContentType()));
        }
        
        javaMailSender.send(message);
    }
    
    @Override
	public void sendEmailToMultipleRecipients(List<String> toAddresses, String subject, String body, MultipartFile attachment)
	        throws MessagingException, IOException {
	    MimeMessage message = javaMailSender.createMimeMessage();
	    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

	    // Set the email properties
	    helper.setTo(toAddresses.toArray(new String[0]));
	    helper.setSubject(subject);
	    helper.setText(body, true);

	    if (attachment != null && !attachment.isEmpty()) {
	        helper.addAttachment(attachment.getOriginalFilename(), new ByteArrayDataSource(attachment.getBytes(), attachment.getContentType()));
	    }

	    // Send the email
	    javaMailSender.send(message);
	}
    
    
    
    
    @Override
    public void sendEmail(String recipientEmail, String subject, String message) {
        // Create a MimeMessage
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            // Create a MimeMessageHelper for easy email creation
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // Set the email subject, message, and recipient
            helper.setSubject(subject);
            helper.setText(message, true); // Enable HTML content
            helper.setTo(recipientEmail);

            // Send the email
            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            // Handle exception
        }
    }


    
    
    
    
    

    
    
    
	
}
