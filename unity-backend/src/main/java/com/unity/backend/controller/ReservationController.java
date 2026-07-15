package com.unity.backend.controller;

import com.unity.backend.dto.ReservationRequest;
import com.unity.backend.dto.ReservationResponse;
import com.unity.backend.model.Reservation;
import com.unity.backend.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import  java.util.stream.Collectors;


@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;


    @PostMapping
    public ResponseEntity<ReservationResponse> create(@RequestBody ReservationRequest request) {

        Reservation res = reservationService.createReservation(request);
        return ResponseEntity.ok(convertToResponse(res));
    }


    @GetMapping("/building/{buildingId}")
    public ResponseEntity<List<ReservationResponse>> getByBuilding(@PathVariable Long buildingId) {
        List<Reservation> reservations = reservationService.getReservationsByBuilding(buildingId);
        List<ReservationResponse> response = reservations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }


    private ReservationResponse convertToResponse(Reservation res) {
        ReservationResponse response = new ReservationResponse();
        response.setId(res.getId());
        response.setReservationDate(res.getReservationDate());
        response.setStatus(res.getStatus().name());
        response.setUserName(res.getUser().getFullName());
        response.setApartment(res.getUser().getUnit().getFloor() + " " + res.getUser().getUnit().getApartmentNumber());
        response.setCommonAreaName(res.getCommonArea().getName());
        return response;
    }
}
