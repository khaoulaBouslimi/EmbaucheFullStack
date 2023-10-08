package tn.esprit.Services;

import java.util.List;

import tn.esprit.Entities.Candidature;

public interface CandidatureServiceI {

	List<Candidature> getCandidaturesByJobOfferId(Long jobOfferId);

	Long getTotalCandidates();

}
