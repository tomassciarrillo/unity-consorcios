package com.unity.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReservationResponse {

    private Long id;
    private LocalDate reservationDate;
    private String status;
    private String userName;
    private String apartment;
    private String commonAreaName;


}
