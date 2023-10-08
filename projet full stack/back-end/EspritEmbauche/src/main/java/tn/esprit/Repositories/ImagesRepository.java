package tn.esprit.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.esprit.Entities.OfferImages;

@Repository
public interface ImagesRepository extends JpaRepository<OfferImages, Long> {

}
