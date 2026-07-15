/*
package com.unity.backend.repository;

import com.unity.backend.model.Reservation;
import com.unity.backend.model.CommonArea;
import com.unity.backend.model.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByCommonAreaAndReservationDateAndStatus(
            CommonArea commonArea, LocalDate reservationDate, ReservationStatus status);

    List<Reservation> findByCommonAreaBuildingId(Long buildingId);
}
 */



package com.unity.backend.repository;

import com.unity.backend.model.Reservation;
import com.unity.backend.model.CommonArea;
import com.unity.backend.model.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByCommonAreaAndReservationDateAndStatus(
            CommonArea commonArea, LocalDate reservationDate, ReservationStatus status);

    List<Reservation> findByCommonAreaBuildingId(Long buildingId);

    boolean existsByCommonAreaIdAndReservationDateAndStatus(Long commonAreaId, LocalDate reservationDate, ReservationStatus status);
}