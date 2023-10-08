package tn.esprit.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import tn.esprit.Entities.Company;


@Repository
public interface CompanyRepsitory extends JpaRepository<Company, Long> {
	
	 @Query("SELECT COUNT(j) FROM Company c JOIN c.jobOffer j WHERE c.id = :companyId")
	  int countJobOffersByCompanyId(@Param("companyId") Long companyId);

	 
	 Optional<Company> findById(Long id);
	 
	 Optional<Company> findByJobOfferIdJobOffer(Long jobOfferId);
	 
}
