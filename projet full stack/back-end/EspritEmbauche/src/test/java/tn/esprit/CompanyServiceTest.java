package tn.esprit;


import static org.mockito.Mockito.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import tn.esprit.Entities.Company;
import tn.esprit.Entities.JobOffer;
import tn.esprit.Repositories.CompanyRepsitory;
import tn.esprit.Services.CompanyServiceImpl;

@SpringBootTest
public class CompanyServiceTest {
	
	
	@Mock
    private CompanyRepsitory companyRepository;

    @InjectMocks
    private CompanyServiceImpl yourService; // Replace with your actual service class name

	
	
	
	
	@Test
    public void testAddJobOfferToCompany() {
        Long companyId = 1L; // Replace with your desired company ID
        Company mockCompany = new Company(); // Create a mock Company instance
        JobOffer jobOffer = new JobOffer(); // Create a mock JobOffer instance

        // Configure the mock repository's behavior
        when(companyRepository.findById(companyId)).thenReturn(Optional.of(mockCompany));
        when(companyRepository.save(mockCompany)).thenReturn(mockCompany);

        // Call the method under test
        yourService.addJobOfferToCompany(companyId, jobOffer);

        // Verify that the findById method was called with the correct argument
        verify(companyRepository).findById(companyId);

        // Verify that the save method was called with the updated Company object
        verify(companyRepository).save(mockCompany);

        // Assert the changes made to the Company object
        assertEquals(mockCompany, jobOffer.getCompany());
        assertTrue(mockCompany.getJobOffer().contains(jobOffer));
    }
	
	
	
	
	
	@Test
    public void testGetNumberOfOffersByCompanyId() {
        Long companyId = 1L;
        long expectedCount = 5L; // Use a long value for expected count

        // Configure the mock repository's behavior
        when(companyRepository.countJobOffersByCompanyId(companyId)).thenReturn((int) expectedCount);

        // Call the method under test
        int result = yourService.getNumberOfOffersByCompanyId(companyId);

        // Verify interactions
        verify(companyRepository).countJobOffersByCompanyId(companyId);

        // Assert the result
        assertEquals(expectedCount, result);
    }
	
	
	
	@Test
    public void testGetCompanyById() {
        Long companyId = 1L;
        Company mockCompany = new Company(); // Replace with your mock Company instance

        // Configure the mock repository's behavior
        when(companyRepository.findById(companyId)).thenReturn(Optional.of(mockCompany));

        // Call the method under test
        Company result = yourService.getCompanyById(companyId);

        // Verify interactions
        verify(companyRepository).findById(companyId);

        // Assert the result
        assertNotNull(result);
        assertEquals(mockCompany, result);
    }

    @Test
    public void testGetCompanyByIdNotFound() {
        Long companyId = 123L;

        // Configure the mock repository's behavior
        when(companyRepository.findById(companyId)).thenReturn(Optional.empty());

        // Call the method under test and expect an exception
        assertThrows(RuntimeException.class, () -> {
            yourService.getCompanyById(companyId);
        });

        // Verify interactions
        verify(companyRepository).findById(companyId);
    }

}
