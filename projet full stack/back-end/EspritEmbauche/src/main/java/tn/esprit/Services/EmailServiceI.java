package tn.esprit.Services;



import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;



public interface EmailServiceI {



	void sendEmail(String recipientEmail, String subject, String message);

	void sendEmailWithAttachment(String to, String subject, String body, MultipartFile attachment)
			throws MessagingException, IOException;

	void sendEmailToMultipleRecipients(List<String> toAddresses, String subject, String body, MultipartFile attachment)
			throws MessagingException, IOException;



}
