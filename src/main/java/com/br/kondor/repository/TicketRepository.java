package com.br.kondor.repository;

import com.br.kondor.model.Ticket;
import com.br.kondor.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
        List<Ticket> findByAuthor(User author);

        @Query("SELECT t FROM Ticket t WHERE t.parentTicket IS NULL ORDER BY t.createdAt DESC")
        List<Ticket> findAllMainTickets();

        @Query("SELECT t FROM Ticket t WHERE t.parentTicket IS NULL " +
                        "AND (:keyword IS NULL OR LOWER(t.title) LIKE :keyword OR LOWER(t.description) LIKE :keyword) "
                        +
                        "AND (:status IS NULL OR t.status = :status) " +
                        "ORDER BY t.createdAt DESC")
        Page<Ticket> findAllMainTicketsPaginated(String keyword, com.br.kondor.model.TicketStatus status,
                        Pageable pageable);

        long countByStatusAndParentTicketIsNull(com.br.kondor.model.TicketStatus status);

        long countByParentTicketIsNull();

        List<Ticket> findTop5ByAuthorOrderByCreatedAtDesc(User author);

        @Query("SELECT t FROM Ticket t WHERE t.author = :author " +
                        "AND (:keyword IS NULL OR LOWER(t.title) LIKE :keyword OR LOWER(t.description) LIKE :keyword) "
                        +
                        "AND (:status IS NULL OR t.status = :status) " +
                        "ORDER BY t.createdAt DESC")
        List<Ticket> searchTickets(User author, String keyword, com.br.kondor.model.TicketStatus status);

        @Query("SELECT t FROM Ticket t WHERE t.parentTicket IS NULL " +
                        "AND (t.shared = true OR t.author = :user) " +
                        "AND (:keyword IS NULL OR LOWER(t.title) LIKE :keyword OR LOWER(t.description) LIKE :keyword) "
                        +
                        "ORDER BY t.createdAt DESC")
        Page<Ticket> findVisibleTicketsForResident(User user, String keyword, Pageable pageable);

        @Query("SELECT t FROM Ticket t WHERE t.parentTicket IS NULL " +
                        "AND (t.shared = true OR t.author = :user) " +
                        "ORDER BY t.createdAt DESC")
        List<Ticket> findVisibleTicketsForResident(User user);
}
