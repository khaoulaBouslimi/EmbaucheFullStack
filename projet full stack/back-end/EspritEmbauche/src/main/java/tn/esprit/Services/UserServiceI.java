package tn.esprit.Services;

import tn.esprit.SpSecurity.Users;

public interface UserServiceI {

	Users findByEmail(String email);

	void resetPassword(String email, String newPassword);
	
	public long save(Users users);


}
