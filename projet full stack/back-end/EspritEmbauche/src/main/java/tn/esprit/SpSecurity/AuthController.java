package tn.esprit.SpSecurity;



import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;


import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import jakarta.servlet.ServletContext;


import tn.esprit.Services.EmailServiceI;
import tn.esprit.Services.UserServiceI;
import org.springframework.web.bind.annotation.RequestParam;



@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UsersRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;
  
  @Autowired 
  UserServiceI userService;
  
  @Autowired
  EmailServiceI emailService;
  
  
	@Autowired  ServletContext context;

  
  
  
  
  

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);

    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
        .body(new UserInfoResponse(userDetails.getId(),
                                   userDetails.getUsername(),
                                   userDetails.getEmail(),
                                   roles));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    Users user = new Users(signUpRequest.getUsername(),
                         signUpRequest.getEmail(),
                         encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    if (strRoles == null) {
    	Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(adminRole);
    } else {
      strRoles.forEach(role -> {
        switch (role) {
        case "user":
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
            	.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);

            break;
 
        case "mod":
          Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(modRole);

          break;
        default:
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(adminRole);
        }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }

  @PostMapping("/signout")
  public ResponseEntity<?> logoutUser() {
    ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new MessageResponse("You've been signed out!"));
  }
  
  
  


  
  @PostMapping("/forgotpassword")
  public ResponseEntity<String> forgotPassword(@RequestParam String email) {
      // Validate user email and generate reset token
      Users user = userService.findByEmail(email);
      if (user == null) {
          return ResponseEntity.badRequest().body("User not found");
      }
      
      String resetToken = jwtUtils.generatePasswordResetToken(email);

      // Send reset token to user's email along with reset link
      String resetLink = "http://localhost:8000/resetpassword?token=" + resetToken;
      String emailMessage = "To reset your password, click the following link: " + resetLink;
      emailService.sendEmail(email, "Password Reset Request", emailMessage);

      return ResponseEntity.ok("Password reset email sent successfully");
  }

  @PostMapping("/resetpassword")
  public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
      // Validate reset token
      if (!jwtUtils.validateJwtToken(token)) {
          return ResponseEntity.badRequest().body("Invalid reset token");
      }

      // Extract user email from reset token
      String userEmail = jwtUtils.getUserNameFromJwtToken(token);
      
      // Reset user's password using userEmail and newPassword
      userService.resetPassword(userEmail, newPassword);

      return ResponseEntity.ok("Password reset successfully");
  }

  
  
  
  @GetMapping("/getallusers")
  public List<Users> getUsers() {
      return userRepository.findAll();
  }
  

  @DeleteMapping("/deleteuser/{userId}")
  public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
       userRepository.deleteById(userId);
      return ResponseEntity.noContent().build();
  }

  
	

  
}