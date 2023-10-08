package tn.esprit.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.esprit.Entities.Contact;


@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
}
