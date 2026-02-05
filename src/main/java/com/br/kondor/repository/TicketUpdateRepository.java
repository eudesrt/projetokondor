package com.br.kondor.repository;

import com.br.kondor.model.Ticket;
import com.br.kondor.model.TicketUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketUpdateRepository extends JpaRepository<TicketUpdate, Long> {
    List<TicketUpdate> findByTicketOrderByCreatedAtAsc(Ticket ticket);
}
