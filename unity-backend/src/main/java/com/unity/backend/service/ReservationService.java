/*
package com.unity.backend.service;

import com.unity.backend.dto.ReservationRequest;
import com.unity.backend.model.*;
import com.unity.backend.model.enums.ReservationStatus;
import com.unity.backend.model.enums.UserStatus;
import com.unity.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final CommonAreaRepository commonAreaRepository;

    @Transactional
    public Reservation createReservation(ReservationRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow( ()-> new RuntimeException("User not found."));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("User must be ACTIVE to reserve amenities.");
        }

        CommonArea area = commonAreaRepository.findById(request.getCommonAreaId())
            .orElseThrow( ()-> new RuntimeException("Common Area not found."));


        if (reservationRepository.findByCommonAreaAndReservationDateAndStatus(
                area, request.getReservationDate(), ReservationStatus.CONFIRMED).isPresent()) {
            throw new RuntimeException("This area is already reserved for this date");
        }

        Reservation reservation = new Reservation();
        reservation.setReservationDate(request.getReservationDate());
        reservation.setUser(user);
        reservation.setCommonArea(area);
        reservation.setStatus(ReservationStatus.CONFIRMED);

        return reservationRepository.save(reservation);
    }

    @Transactional(readOnly = true)
    public List<Reservation> getReservationsByBuilding(Long buildingId) {
        return reservationRepository.findByCommonAreaBuildingId(buildingId);
    }
}

 */

package com.unity.backend.service;

import com.unity.backend.dto.ReservationRequest;
import com.unity.backend.model.CommonArea;
import com.unity.backend.model.Reservation;
import com.unity.backend.model.User;
import com.unity.backend.model.enums.ReservationStatus;
import com.unity.backend.repository.CommonAreaRepository;
import com.unity.backend.repository.ReservationRepository;
import com.unity.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final CommonAreaRepository commonAreaRepository;

    @Transactional
    public Reservation createReservation(ReservationRequest request) {

        // 1. Validamos si el espacio ya cuenta con una reserva confirmada para ese día exacto
        boolean yaReservado = reservationRepository.existsByCommonAreaIdAndReservationDateAndStatus(
                request.getCommonAreaId(),
                request.getReservationDate(),
                ReservationStatus.CONFIRMED
        );

        if (yaReservado) {
            throw new IllegalStateException("El área común ya se encuentra reservada para la fecha seleccionada.");
        }

        // 2. Buscamos el usuario que intenta reservar
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));

        // 3. Buscamos el área común (SUM o Parrilla)
        CommonArea area = commonAreaRepository.findById(request.getCommonAreaId())
                .orElseThrow(() -> new IllegalArgumentException("Área común no encontrada."));

        // 4. Construimos e impactamos la reserva
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setCommonArea(area);
        reservation.setReservationDate(request.getReservationDate());

        return reservationRepository.save(reservation);
    }

    // --- EL MÉTODO QUE FALTABA PARA SOLUCIONAR EL ERROR ---
    @Transactional(readOnly = true)
    public List<Reservation> getReservationsByBuilding(Long buildingId) {
        return reservationRepository.findByCommonAreaBuildingId(buildingId);
    }
}
