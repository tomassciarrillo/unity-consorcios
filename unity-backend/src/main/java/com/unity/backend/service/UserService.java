package com.unity.backend.service;


import com.unity.backend.dto.AuthenticationResponse;
import com.unity.backend.dto.RegistrationRequest;
import com.unity.backend.model.*;
import com.unity.backend.model.enums.Role;
import com.unity.backend.model.enums.UserStatus;
import com.unity.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;
import java.util.List;



@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BuildingRepository buildingRepository;
    private final  UnitRepository unitRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    @Transactional
    public AuthenticationResponse registerResident(RegistrationRequest request) {
        Building building = buildingRepository.findByAccessCode(request.getAccessCode())
                .orElseThrow( ()-> new RuntimeException("Building not found with this code. "));

        Unit unit = unitRepository.findByFloorAndApartmentNumberAndBuilding(
                        request.getFloor(),
                        request.getApartmentNumber(),
                        building)
                .orElseThrow( ()-> new RuntimeException("Unit not found in this building. "));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(Role.RESIDENT);
        user.setStatus(UserStatus.PENDING);
        user.setUnit(unit);

        User savedUser = userRepository.save(user);

        var jwtToken = jwtService.generateToken(savedUser);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .userId(savedUser.getId())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole().name())
                .buildingId(savedUser.getUnit().getBuilding().getId())
                .unitId(savedUser.getUnit().getId())
                .build();
    }


    @Transactional (readOnly = true)
    public List<User> getPendingResidents (Long buildingId) {

        return userRepository.findAll().stream()
                .filter ( user -> user.getUnit() !=null &&
                        user.getUnit().getBuilding().getId().equals(buildingId) &&
                        user.getStatus() == UserStatus.PENDING)
                .collect(Collectors.toList());
    }


    @Transactional
    public User approveResident (Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow( ()-> new RuntimeException("User not found with this id."));

        if (user.getStatus() != UserStatus.PENDING) {
            throw new RuntimeException("User is not int PENDING status.");
        }

        user.setStatus(UserStatus.ACTIVE);
        return userRepository.save(user);
    }

}
