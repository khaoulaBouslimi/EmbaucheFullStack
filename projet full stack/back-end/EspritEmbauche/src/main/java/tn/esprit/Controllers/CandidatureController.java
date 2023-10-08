package tn.esprit.Controllers;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;
import tn.esprit.Entities.Candidature;
import tn.esprit.Entities.Company;
import tn.esprit.Entities.JobOffer;
import tn.esprit.Repositories.CandidatureRepository;
import tn.esprit.Repositories.CompanyRepsitory;
import tn.esprit.Repositories.JobOfferRepository;
import tn.esprit.Services.CandidatureServiceI;
import tn.esprit.Services.EmailServiceI;

import org.springframework.util.StringUtils;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
@RequestMapping("/candidatures")
public class CandidatureController {

	
	@Autowired
    private CandidatureRepository candidatureRepository;
	
	@Autowired
	private CandidatureServiceI candidatureService;
    
    @Autowired
    private JobOfferRepository jobOfferRepository;
    
    @Autowired
    private CompanyRepsitory companyRepository;
    
  

	@Autowired
	private EmailServiceI emailService ;

   
    

@PostMapping("/off/postuler/{jobOfferId}")
public ResponseEntity<String> postulerrOffer(@PathVariable Long jobOfferId,
                                       @RequestParam("nometprenom") String nometprenom,
                                       @RequestParam("email") String email,
                                       @RequestParam("specialite") String specialite,
                                       @RequestParam("option") String option,
                                       @RequestParam("cv") MultipartFile cv) {
    try {
        // Vérifier si l'offre d'emploi existe
        Optional<JobOffer> jobOfferOptional = jobOfferRepository.findById(jobOfferId);
        if (!jobOfferOptional.isPresent()) {
            return ResponseEntity.badRequest().body("L'offre d'emploi spécifiée n'existe pas.");
        }

        // Vérifier si le fichier est un PDF
        if (!cv.getContentType().equals("application/pdf")) {
            return ResponseEntity.badRequest().body("Veuillez sélectionner un fichier PDF pour le CV.");
        }
        
        

        // Save the CV to the server's filesystem
        String cvStorageLocation = "./uploads"; // Set the directory path where CV files will be stored
        String cvFileName = StringUtils.cleanPath(cv.getOriginalFilename());
        Path cvPath = Paths.get(cvStorageLocation + File.separator + cvFileName);
        
        // Create the directory if it does not exist
        Files.createDirectories(cvPath.getParent());

        // Save the file to the destination path
        Files.copy(cv.getInputStream(), cvPath);

        // Créer une nouvelle candidature
        Candidature candidature = new Candidature();
        candidature.setNometprenom(nometprenom);
        candidature.setEmail(email);
        candidature.setSpecialite(specialite);
        candidature.setOption(option);
        candidature.setCvName(cvFileName);
        candidature.setCvType(cv.getContentType());
        candidature.setJoboffer(jobOfferOptional.get());

        // Enregistrer la candidature
        candidatureRepository.save(candidature);

        return ResponseEntity.ok("Candidature soumise avec succès !");
    } catch (IOException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors du traitement du fichier.");
    }
}





@PostMapping("/postuler/{jobOfferId}")
public ResponseEntity<String> postuler(@PathVariable Long jobOfferId,
        @RequestParam("nometprenom") String nometprenom,
        @RequestParam("email") String email,
        @RequestParam("specialite") String specialite,
        @RequestParam("option") String option,
        @RequestParam("cv") MultipartFile cv,
        @RequestParam("lettreMotivation") MultipartFile lettreMotivation) throws MessagingException {
try {
// Vérifier si l'offre d'emploi existe
Optional<JobOffer> jobOfferOptional = jobOfferRepository.findById(jobOfferId);
Optional<Company> companyOptional = companyRepository.findByJobOfferIdJobOffer(jobOfferId);

if (!jobOfferOptional.isPresent()) {
return ResponseEntity.badRequest().body("L'offre d'emploi spécifiée n'existe pas.");
}

// Vérifier si le fichier est un PDF
if (!cv.getContentType().equals("application/pdf")) {
return ResponseEntity.badRequest().body("Veuillez sélectionner un fichier PDF pour le CV et la lettre de motivation.");
}



// Save the CV to the server's filesystem
String storageLocation = "./uploads"; // Set the directory path where CV files will be stored

String cvFileName = StringUtils.cleanPath(cv.getOriginalFilename());
String lettreMotivationFileName = StringUtils.cleanPath(lettreMotivation.getOriginalFilename());


// Chemins vers les fichiers
Path cvPath = Paths.get(storageLocation + File.separator + cvFileName);
Path lettreMotivationPath = Paths.get(storageLocation + File.separator + lettreMotivationFileName);


// Create the directory if it does not exist
Files.createDirectories(cvPath.getParent());
Files.createDirectories(lettreMotivationPath.getParent());


// Save the file to the destination path
Files.copy(cv.getInputStream(), cvPath);
Files.copy(lettreMotivation.getInputStream(), lettreMotivationPath);


// Créer une nouvelle candidature
Candidature candidature = new Candidature();
candidature.setNometprenom(nometprenom);
candidature.setEmail(email);
candidature.setSpecialite(specialite);
candidature.setOption(option);

candidature.setCvName(cvFileName);
candidature.setCvType(cv.getContentType());

candidature.setLettreMotivationName(lettreMotivationFileName);
candidature.setLettreMotivationType(lettreMotivation.getContentType());

candidature.setJoboffer(jobOfferOptional.get());


// Enregistrer la candidature
candidatureRepository.save(candidature);

// Send a confirmation email to the applicant
String confirmationSubject = "Confirmation de réception de votre candidature";
String confirmationBody = "<div style='font-size: 18px; '>Cher(e) <strong>" + nometprenom + "</strong>,<br><br>" +
	    "Nous vous remercions d'avoir postulé pour le poste de <strong>" + jobOfferOptional.get().getJobTitle() + "</strong> chez <strong  >" + companyOptional.get().getCompanySname() + "</strong>.<br>" +
	    "Nous avons bien reçu votre candidature et nous vous confirmons que votre dossier est complet.<br><br>" +
	    "Notre équipe des ressources humaines examinera attentivement votre candidature dans les prochains jours. Si votre profil correspond à nos besoins, nous vous contacterons pour la prochaine étape du processus de recrutement.<br><br>" +
	    "Nous vous remercions de l'intérêt que vous portez à <strong >" + companyOptional.get().getCompanySname() + "</strong> et nous vous souhaitons bonne chance dans votre candidature.<br><br>" +
	    "Cordialement,<br>" +
	    companyOptional.get().getCompanySname() +
	    "</div>";



emailService.sendEmailWithAttachment(email, confirmationSubject, confirmationBody, null);


return ResponseEntity.ok("Candidature soumise avec succès !");
} catch (IOException e) {
return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors du traitement des fichiers.");
}
}





@GetMapping("/total-candidates-count")
public ResponseEntity<Long> getTotalCandidatesCount() {
    Long totalCount = candidatureService.getTotalCandidates();
    return ResponseEntity.ok(totalCount);
}




    
@GetMapping("/downloadCV/{candidatureId}")
public ResponseEntity<byte[]> downloadCV(@PathVariable Long candidatureId) {
    Optional<Candidature> candidatureOptional = candidatureRepository.findById(candidatureId);
    if (candidatureOptional.isPresent()) {
        Candidature candidature = candidatureOptional.get();
        String cvStorageLocation = "./uploads"; // Set the same directory path used for CV storage
        String cvFileName = candidature.getCvName();
        Path cvPath = Paths.get(cvStorageLocation + File.separator + cvFileName);
        try {
            // Read the CV file as a byte array
            byte[] cvContent = Files.readAllBytes(cvPath);
            
            // Set the response headers for file download
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header("Content-Disposition", "attachment; filename=\"" + cvFileName + "\"")
                    .body(cvContent);
        } catch (IOException e) {
            // Handle the error if the file cannot be read
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    } else {
        // Handle the case when candidature with the given ID is not found
        return ResponseEntity.notFound().build();
    }
}

@GetMapping("/downloadLettreMotivation/{candidatureId}")
public ResponseEntity<byte[]> downloadLettreMotivation(@PathVariable Long candidatureId) {
    Optional<Candidature> candidatureOptional = candidatureRepository.findById(candidatureId);
    if (candidatureOptional.isPresent()) {
        Candidature candidature = candidatureOptional.get();
        String lettreMotivationStorageLocation = "./uploads"; // Set the directory path where lettreMotivation files are stored
        String lettreMotivationFileName = candidature.getLettreMotivationName();
        Path lettreMotivationPath = Paths.get(lettreMotivationStorageLocation + File.separator + lettreMotivationFileName);
        try {
            // Read the lettreMotivation file as a byte array
            byte[] lettreMotivationContent = Files.readAllBytes(lettreMotivationPath);
            
            // Set the response headers for file download
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF) // You can change the content type as needed
                    .header("Content-Disposition", "attachment; filename=\"" + lettreMotivationFileName + "\"")
                    .body(lettreMotivationContent);
        } catch (IOException e) {
            // Handle the error if the file cannot be read
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    } else {
        // Handle the case when candidature with the given ID is not found
        return ResponseEntity.notFound().build();
    }
}

    


    
    @GetMapping("/{idJobOffer}/jobOffers")
    public List<Candidature> getCandidaturesByJobOfferId(@PathVariable Long idJobOffer) {
        return candidatureService.getCandidaturesByJobOfferId(idJobOffer);
    }


    
}
