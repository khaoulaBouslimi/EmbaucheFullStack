package tn.esprit.SpSecurity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;



@Configuration
//@EnableWebSecurity
@EnableMethodSecurity ( prePostEnabled = true) 
public class WebSecurityConfig {
  @Autowired
  UserDetailsServiceImpl userDetailsService;

  @Autowired
  private AuthEntryPointJwt unauthorizedHandler;

  @Bean
  public AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter();
  }

  @Bean
  public DaoAuthenticationProvider authenticationProviderr() {
      DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
       
      authProvider.setUserDetailsService(userDetailsService);
      authProvider.setPasswordEncoder(passwordEncoderr());
   
      return authProvider;
  }
  
  
  @Bean
  public AuthenticationManager theAuthenticationManager(AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoderr() {
    return new BCryptPasswordEncoder();
  }
  
  @Bean
  public WebMvcConfigurer corsConfigurer() {
      return new WebMvcConfigurer() {
          @Override
          public void addCorsMappings(CorsRegistry registry) {
              registry.addMapping("/**") // Adjust the mapping pattern as needed /api/**
                      .allowedOrigins("http://localhost:4200") // Replace with your Angular application's URL
                      .allowedMethods("GET", "POST", "PUT", "DELETE")
                      .allowedHeaders("*");
          }
      };
  }
  
  
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
    
        .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> 
          auth.requestMatchers("/api/auth/**").permitAll() 
          	
          	  .requestMatchers("/api/auth/forgotpassword").permitAll()
          	  
              .requestMatchers("/api/test/**").permitAll()
              .requestMatchers("/company/Imglogo/**").permitAll()
              .requestMatchers("/company/**").permitAll()
              .requestMatchers("/joboffer/**").permitAll()
              .requestMatchers("/candidatures/**").permitAll()
              
              .requestMatchers("/email/**").permitAll()
              .requestMatchers("/email/send-email").permitAll()
              .requestMatchers("/email/multiple").permitAll()
              
              
              .requestMatchers("/joboffer/visibility/{id}").permitAll()
              .requestMatchers("/file/**").permitAll()
              .requestMatchers("/contact/**").permitAll()
              .requestMatchers("/subscriptions/**").permitAll()
              
//              .requestMatchers("/company/getAllJobOffersWithCompanyInfo").permitAll()
              .requestMatchers("/company/Imglogo/{id}").permitAll()
//              .requestMatchers("/candidatures/postuler/{jobOfferId}").permitAll()
              
              //.requestMatchers("").permitAll()
              
              
              .anyRequest().authenticated()
        ); 
    
    http.headers(headers -> headers.frameOptions(frameOption -> frameOption.sameOrigin()));

    http.authenticationProvider(authenticationProviderr());

    http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
  }
}