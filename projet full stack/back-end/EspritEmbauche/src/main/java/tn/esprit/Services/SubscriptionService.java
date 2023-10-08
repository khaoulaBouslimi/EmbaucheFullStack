package tn.esprit.Services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tn.esprit.Entities.Subscription;
import tn.esprit.Repositories.SubscriptionRepository;

@Service
public class SubscriptionService implements SubscriptionServiceI {
	
	
	@Autowired
    private SubscriptionRepository subscriptionRepository;

	
	@Override
    public void subscribe(String email) {
        Optional<Subscription> existingSubscription = subscriptionRepository.findByEmail(email);
        if (!existingSubscription.isPresent()) {
            Subscription subscription = new Subscription();
            subscription.setEmail(email);
            subscriptionRepository.save(subscription);
        }
    }

	
	@Override
    public void unsubscribe(String email) {
        Optional<Subscription> subscription = subscriptionRepository.findByEmail(email);
        subscription.ifPresent(sub -> subscriptionRepository.delete(sub));
    }

	
	
	@Override
    public List<String> getSubscribedEmails() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        return subscriptions.stream().map(Subscription::getEmail).collect(Collectors.toList());
    }
    

}
