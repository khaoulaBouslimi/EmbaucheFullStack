package tn.esprit.Repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;

import tn.esprit.Entities.CountComp;
import tn.esprit.Entities.JobOffer;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {
	
	@Query(value = "SELECT new tn.esprit.Entities.CountComp(COUNT(*) / (SELECT COUNT(*) FROM JobOffer) * 100, o.company.companySname) FROM JobOffer o GROUP BY o.company.companySname")
    List<CountComp> getPercentageGroupByCompanysName();
	
	JobOffer findByIdJobOffer(Long idJobOffer);
	
	Optional<JobOffer> findJobOfferByIdJobOffer(Long idJobOffer);
	


	List<JobOffer> findByEndDateAfter(LocalDate endDate);
	

}
