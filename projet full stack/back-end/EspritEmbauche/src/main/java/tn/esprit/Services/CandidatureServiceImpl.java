package tn.esprit.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tn.esprit.Entities.Candidature;
import tn.esprit.Repositories.CandidatureRepository;

@Service
public class CandidatureServiceImpl implements CandidatureServiceI {
	
	@Autowired
	private CandidatureRepository candidatureRepository;

	@Override
	public List<Candidature> getCandidaturesByJobOfferId(Long idJobOffer) {
        return candidatureRepository.findCandidaturesByIdJobOffer(idJobOffer);
    }
	
	@Override
	public Long getTotalCandidates() {
        return candidatureRepository.count(); // Assuming you have a JPA repository
    }
}
