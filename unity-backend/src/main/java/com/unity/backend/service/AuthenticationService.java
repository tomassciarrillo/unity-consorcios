package com.unity.backend.service;

import com.unity.backend.dto.AuthenticationResponse;
import com.unity.backend.dto.LoginRequest;
import com.unity.backend.dto.RegisterRequest;
import com.unity.backend.model.User;
import com.unity.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    public AuthenticationResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .buildingId(user.getUnit() != null ? user.getUnit().getBuilding().getId() : null)
                .unitId(user.getUnit() != null ? user.getUnit().getId() : null)
                .build();
    }
}