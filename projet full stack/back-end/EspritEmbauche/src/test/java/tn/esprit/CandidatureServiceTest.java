package tn.esprit;

import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import tn.esprit.Entities.Candidature;
import tn.esprit.Repositories.CandidatureRepository;
import tn.esprit.Services.CandidatureServiceI;

@SpringBootTest
public class CandidatureServiceTest {

	
	
	@Mock
    private CandidatureRepository candidatureRepository;

    @InjectMocks
    private CandidatureServiceI yourService; // Replace with your actual service class name

	
	
    @Test
    public void testGetCandidaturesByJobOfferId() {
        Long jobId = 123L; // Replace with your desired job ID
        List<Candidature> mockCandidatures = new ArrayList<>(); // Create mock data

        // Configure the mock repository to return the mock data
        when(candidatureRepository.findCandidaturesByIdJobOffer(jobId)).thenReturn(mockCandidatures);

        // Call the method under test
        List<Candidature> result = yourService.getCandidaturesByJobOfferId(jobId);

        // Verify that the method was called with the correct argument
        verify(candidatureRepository).findCandidaturesByIdJobOffer(jobId);

        // Assert the result
        assertEquals(mockCandidatures, result);
    }
	
	
	
}
