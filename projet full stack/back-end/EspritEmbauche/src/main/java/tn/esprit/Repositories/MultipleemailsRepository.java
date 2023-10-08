package tn.esprit.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.esprit.Entities.Multipleemails;

@Repository
public interface MultipleemailsRepository extends JpaRepository<Multipleemails, Long> {

}
