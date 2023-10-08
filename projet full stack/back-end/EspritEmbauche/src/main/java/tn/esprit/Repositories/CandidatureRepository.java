package tn.esprit.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import tn.esprit.Entities.Candidature;

@Repository
public interface CandidatureRepository extends JpaRepository<Candidature, Long> {

    List<Candidature> findByIdCandidature(Long jobOfferId);
    
 // Retrieve all candidatures for a given idJobOffer
    @Query("SELECT c FROM Candidature c WHERE c.joboffer.idJobOffer = :idJobOffer")
    List<Candidature> findCandidaturesByIdJobOffer(@Param("idJobOffer") Long idJobOffer);

}
