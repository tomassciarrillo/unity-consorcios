package com.unity.backend.controller;

import com.unity.backend.dto.RegistrationRequest;
import com.unity.backend.dto.UserResponse;
import com.unity.backend.model.User;
import com.unity.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /*
    @PostMapping("/register-resident")
    public ResponseEntity<UserResponse> register(@RequestBody RegistrationRequest request) {
        User savedUser = userService.registerResident(request);

        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setEmail(savedUser.getEmail());
        response.setFullName(savedUser.getFullName());
        response.setRole(savedUser.getRole().name());
        response.setStatus(savedUser.getStatus().name());

        if (savedUser.getUnit() != null) {
            response.setFloor(savedUser.getUnit().getFloor());
            response.setApartmentNumber(savedUser.getUnit().getApartmentNumber());

            if (savedUser.getUnit().getBuilding() != null) {
                response.setBuildingName(savedUser.getUnit().getBuilding().getName());
            }
        }
        return ResponseEntity.ok(response);
    }
    */

    @GetMapping("/pending/building/{buildingId}")
    public ResponseEntity<List<UserResponse>> getPending(@PathVariable Long buildingId) {

        List<User> pendingUsers = userService.getPendingResidents(buildingId);

        List<UserResponse> responseList = pendingUsers.stream().map( user -> {
            UserResponse res = new UserResponse();
            res.setId(user.getId());
            res.setEmail(user.getEmail());
            res.setFullName(user.getFullName());
            res.setRole(user.getRole().name());
            res.setStatus(user.getStatus().name());
            res.setFloor(user.getUnit().getFloor());
            res.setApartmentNumber(user.getUnit().getApartmentNumber());
            res.setBuildingName(user.getUnit().getBuilding().getName());
            return res;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }



    @PutMapping("/approve/{userId}")
    public ResponseEntity<UserResponse> approve(@PathVariable Long userId) {
        User approvedUser = userService.approveResident(userId);

        UserResponse res = new UserResponse();
        res.setId(approvedUser.getId());
        res.setEmail(approvedUser.getEmail());
        res.setFullName(approvedUser.getFullName());
        res.setRole(approvedUser.getRole().name());
        res.setStatus(approvedUser.getStatus().name());
        res.setFloor(approvedUser.getUnit().getFloor());
        res.setApartmentNumber(approvedUser.getUnit().getApartmentNumber());
        res.setBuildingName(approvedUser.getUnit().getBuilding().getName());

        return ResponseEntity.ok(res);
    }


}