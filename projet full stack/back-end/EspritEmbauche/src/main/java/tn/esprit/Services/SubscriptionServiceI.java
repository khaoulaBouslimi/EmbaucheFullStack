package tn.esprit.Services;

import java.util.List;

public interface SubscriptionServiceI {

	void subscribe(String email);

	void unsubscribe(String email);

	List<String> getSubscribedEmails();

}
