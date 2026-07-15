package com.unity.backend.service;

import com.unity.backend.dto.TicketRequest;
import com.unity.backend.model.*;
import com.unity.backend.model.enums.TicketStatus;
import com.unity.backend.model.enums.UserStatus;
import com.unity.backend.repository.TicketRepository;
import com.unity.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
public class TicketService {

    private final  TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Transactional
    public Ticket createTicket ( TicketRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow( ()-> new RuntimeException("User not found."));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Only ACTIVE users can create tickets.");
        }

        Ticket ticket= new  Ticket();
        ticket.setUser(user);
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setStatus(TicketStatus.OPEN);

        return ticketRepository.save(ticket);

    }


    @Transactional (readOnly = true)
    public List<Ticket> getTicketsByBuilding( Long  buildingId) {
        return ticketRepository.findByUserUnitBuildingId(buildingId);
    }

    @Transactional
    public Ticket updateTicketStatus (Long ticketId, TicketStatus newStatus) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow( ()-> new RuntimeException("Ticket not found."));

        ticket.setStatus(newStatus);
        return ticketRepository.save(ticket);
    }
}
