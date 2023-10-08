package tn.esprit.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tn.esprit.SpSecurity.Users;
import tn.esprit.SpSecurity.UsersRepository;

@Service
public class UserServiceImpl implements UserServiceI {
	
	@Autowired
	private UsersRepository userRepository;
	
	
	@Override
	public Users findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

	@Override
    public void resetPassword(String email, String newPassword) {
        Users user = userRepository.findByEmail(email);
        if (user != null) {
            // Update user's password and save changes
            user.setPassword(newPassword);
            userRepository.save(user);
        }
    }

	@Override
	public long save(Users users) {
		
		Users us = new Users();
		
		us.setUsername(users.getUsername());
		us.setEmail(users.getEmail());
		us.setPassword(users.getPassword()); 
		
        return userRepository.save(users)
                             .getId();
 	}

}
