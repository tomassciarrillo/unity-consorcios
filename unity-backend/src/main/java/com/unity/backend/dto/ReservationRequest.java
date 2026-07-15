package com.unity.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReservationRequest {

    private Long userId;
    private Long commonAreaId;
    private LocalDate reservationDate;

}
