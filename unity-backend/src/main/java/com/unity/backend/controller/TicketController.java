package com.unity.backend.controller;

import com.unity.backend.dto.TicketRequest;
import com.unity.backend.dto.TicketResponse;
import com.unity.backend.model.Ticket;
import com.unity.backend.model.enums.TicketStatus;
import com.unity.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketResponse> create(@RequestBody TicketRequest request) {
        Ticket ticket = ticketService.createTicket(request);
        return ResponseEntity.ok(convertToResponse(ticket));
    }

    @GetMapping("/building/{buildingId}")
    public ResponseEntity<List<TicketResponse>> getByBuildingId(@PathVariable Long buildingId) {
        List<Ticket> tickets = ticketService.getTicketsByBuilding(buildingId);
        List<TicketResponse> response = tickets.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return  ResponseEntity.ok(response);
    }


    @PutMapping("/{ticketId}/status")
    public ResponseEntity<TicketResponse> updateStatus(
            @PathVariable Long ticketId,
            @RequestParam TicketStatus status) {

        Ticket updated = ticketService.updateTicketStatus(ticketId, status);
        return ResponseEntity.ok(convertToResponse(updated));
    }


    private TicketResponse convertToResponse(Ticket ticket) {
        TicketResponse res = new TicketResponse();
        res.setId(ticket.getId());
        res.setTitle(ticket.getTitle());
        res.setDescription(ticket.getDescription());
        res.setStatus(ticket.getStatus().name());
        res.setCreatedAt(ticket.getCreatedAt());
        res.setUserName(ticket.getUser().getFullName());
        res.setApartment(ticket.getUser().getUnit().getFloor() + " " + ticket.getUser().getUnit().getApartmentNumber());
        res.setBuildingName(ticket.getUser().getUnit().getBuilding().getName());
        return res;
    }
}
