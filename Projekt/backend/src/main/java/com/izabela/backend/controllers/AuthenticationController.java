package com.izabela.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.izabela.backend.dtos.LoginUserRequest;
import com.izabela.backend.dtos.RegisterUserRequest;
import com.izabela.backend.dtos.UserInformation;
import com.izabela.backend.dtos.VerifyUserRequest;
import com.izabela.backend.responses.LoginResponse;
import com.izabela.backend.service.AuthenticationService;
import com.izabela.backend.service.JwtService;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import com.izabela.backend.entities.User;
import com.izabela.backend.repositories.UserRepository;

@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3010")
@RestController
public class AuthenticationController {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService, UserRepository userRepository){
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterUserRequest registerUserRequest){
        User registerUser = authenticationService.register(registerUserRequest);
        registerUser.setUserRole();
        return userRepository.save(registerUser);
    }
        
    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginUserRequest loginUserRequest){
        try {
            User authenticatedUser = authenticationService.authenticate(loginUserRequest);
            String jwtToken = jwtService.generateToken(authenticatedUser);
            LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
            return ResponseEntity.ok(loginResponse);
        } catch (RuntimeException e) { // albo dokładniejszy typ np. BadCredentialsException
            return ResponseEntity.status(401).body(Map.of(
                "error", "Niepoprawny email lub hasło"
            ));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserRequest verifyUserRequest){
        try{
            authenticationService.verifyUser(verifyUserRequest);

            User user = userRepository.findByEmailIgnoreCase(verifyUserRequest.getEmail())
                          .orElseThrow(() -> new RuntimeException("User not found"));
            user.setEnabled(true);
            userRepository.save(user);

            //tworzenie tokena JWT
            String token = jwtService.generateToken(user);

            //zwrócenie tokena w JSON
            Map<String, String> response = new HashMap<>();
            response.put("token", token);

            return ResponseEntity.ok(response);

        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email){
        try{
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Wysłano kod weryfikacyjny");
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ){
        String token = authorizationHeader.replace("Bearer ", ""); 
        String username = jwtService.extractUsername(token);
        UserDetails userDetails = userRepository.findByEmailIgnoreCase(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        boolean valid = jwtService.isTokenValid(token, userDetails);
        String user = valid ? jwtService.extractUsername(token) : null;

        Map<String, Object> response = new HashMap<>();
        response.put("ok", valid);
        response.put("username", user);
    
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/getUserDetails")
    public UserInformation getUserDetails(@RequestParam String email) {
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return new UserInformation(
            user.getEmail(),
            user.getName()
        );

    }
    


}
