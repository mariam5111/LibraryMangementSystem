package com.authservice.authservice.authController;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.authservice.authservice.authRequests.AuthRequest;

import org.springframework.http.ResponseEntity;
import com.authservice.authservice.authService.JwtService;
import com.authservice.authservice.authService.UserInfoDetails;
import com.authservice.authservice.authService.UserInfoService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;

//General route authcontroller -> UserinfoService -> UserInfoRepository (database layer uses mongoDB)
// userinfoService (also uses userInfoDetails) Implements UserDetailsService (interface by spring sec,(IOC.))
// (via method "loadbyusername") -> SecurityConfig (authenticationProvider)
//and securityconfig uses jwtAuthFilter (filter) -> JwtService (token operations)
// finally JwtService uses io.jsonwebtoken library to generate and validate tokens
//also passwords are encoded using BCrypt
// + signing key for JWT is defined in application.properties file and encoded in base64 format
@RestController
@RequestMapping("/auth")
public class authController {

    private UserInfoService userservice;
    private AuthenticationManager authenticationManager;
    private JwtService jwtService;

    public authController(UserInfoService userservice,
            AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userservice = userservice;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerNewUser(@RequestBody AuthRequest registerRequest) {

        // problem: we shouldn't interact with entity directly from controller
        // fixed: created a separate DTO (data transfer object) for requests
        // role will be set in service to USER and id will be autogen'd. by Mongo
        HttpStatus status = userservice.registerUser(registerRequest);
        if (status == HttpStatus.CREATED) {
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered");

        } else if (status == HttpStatus.CONFLICT) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed");
    }

    @PostMapping("/login")
    public ResponseEntity<String> authenticationPlusToken(@RequestBody AuthRequest authRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getUsername(),
                        authRequest.getPassword()));
        if (authentication.isAuthenticated()) {
            // Extract roles, id from authenticated user
            List<String> roles = authentication.getAuthorities().stream()
                    .map(auth -> auth.getAuthority())
                    .toList();
            UserInfoDetails user = (UserInfoDetails) authentication.getPrincipal();

            return ResponseEntity.status(HttpStatus.OK)
                    .body(jwtService.generateToken(authRequest.getUsername(), user.getId(), roles));
        } else {
            throw new UsernameNotFoundException(HttpStatus.UNAUTHORIZED.toString());
        }

    }

    @PutMapping("/users/{id}/roles")
    public ResponseEntity<String> updateUserRole(@PathVariable String id,
            @RequestBody List<String> roles) {
        userservice.updateUserRole(id, roles);
        return ResponseEntity.ok("Roles updated successfully");
    }
}
