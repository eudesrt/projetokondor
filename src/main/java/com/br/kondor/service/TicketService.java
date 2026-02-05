package com.br.kondor.service;

import com.br.kondor.model.*;
import com.br.kondor.repository.TicketRepository;
import com.br.kondor.repository.TicketUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Service for managing Ticket lifecycle.
 */
@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private TicketUpdateRepository updateRepository;

    @Autowired
    private EmailService emailService;

    private final String uploadDir = "uploads/tickets/";

    public List<Ticket> getAllMainTickets() {
        return ticketRepository.findAllMainTickets();
    }

    public List<Ticket> getTicketsByAuthor(User author) {
        return ticketRepository.findByAuthor(author);
    }

    public Ticket getTicketById(Long id) {
        if (id == null)
            throw new IllegalArgumentException("ID do chamado não pode ser nulo");
        return ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Chamado não encontrado"));
    }

    public Ticket createTicket(Ticket ticket, MultipartFile[] files) throws IOException {
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        ticket.setStatus(TicketStatus.NOVO);

        if (files != null && files.length > 0) {
            handleAttachments(ticket, files);
        }

        return ticketRepository.save(ticket);
    }

    public void addUpdate(Long ticketId, String message, TicketStatus newStatus, User author, String additionalInfo,
            MultipartFile[] files) throws IOException {
        Ticket ticket = getTicketById(ticketId);

        TicketUpdate update = new TicketUpdate();
        update.setTicket(ticket);
        update.setAuthor(author);
        update.setMessage(message);
        update.setNewStatus(newStatus);
        update.setAdditionalInfo(additionalInfo);
        update.setCreatedAt(LocalDateTime.now());

        updateRepository.save(update);

        if (files != null && files.length > 0) {
            handleAttachments(ticket, files);
        }

        if (newStatus != null) {
            ticket.setStatus(newStatus);
        }
        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        // Notify author if admin is responding
        if (author != null && ticket.getAuthor() != null
                && !author.getUsername().equals(ticket.getAuthor().getUsername())) {
            emailService.sendTicketUpdateEmail(ticket.getAuthor().getEmail(), ticket.getId(),
                    ticket.getStatus().name(), message);
        }

        // If this is a main ticket, update linked tickets
        if (ticket.getLinkedTickets() != null) {
            for (Ticket linked : ticket.getLinkedTickets()) {
                TicketUpdate linkedUpdate = new TicketUpdate();
                linkedUpdate.setTicket(linked);
                linkedUpdate.setAuthor(author);
                linkedUpdate.setMessage("(Sincronizado do chamado principal) " + message);
                linkedUpdate.setNewStatus(newStatus);
                linkedUpdate.setCreatedAt(LocalDateTime.now());
                updateRepository.save(linkedUpdate);

                if (newStatus != null) {
                    linked.setStatus(newStatus);
                }
                linked.setUpdatedAt(LocalDateTime.now());
                ticketRepository.save(linked);

                emailService.sendTicketUpdateEmail(linked.getAuthor().getEmail(), linked.getId(),
                        linked.getStatus().name(), message);
            }
        }
    }

    private void handleAttachments(Ticket ticket, MultipartFile[] files) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath);

                TicketAttachment attachment = new TicketAttachment();
                attachment.setImageUrl("/tickets/" + fileName);
                attachment.setTicket(ticket);
                ticket.getAttachments().add(attachment);
            }
        }
    }

    public long getNewTicketsCount() {
        return ticketRepository.countByStatusAndParentTicketIsNull(TicketStatus.NOVO);
    }

    public long getTicketsCountByStatus(TicketStatus status) {
        return ticketRepository.countByStatusAndParentTicketIsNull(status);
    }

    public long getTotalMainTicketsCount() {
        return ticketRepository.countByParentTicketIsNull();
    }

    public void linkTickets(Long parentId, Long childId) {
        Ticket parent = getTicketById(parentId);
        Ticket child = getTicketById(childId);

        child.setParentTicket(parent);
        ticketRepository.save(child);
    }

    public List<Ticket> getVisibleRecentTickets(User user, boolean isAdmin) {
        if (isAdmin) {
            // Admins see all recent tickets
            return ticketRepository.findAllMainTickets().stream().limit(5)
                    .collect(java.util.stream.Collectors.toList());
        } else {
            // Residents see their own OR shared tickets
            return ticketRepository.findVisibleTicketsForResident(user).stream().limit(5)
                    .collect(java.util.stream.Collectors.toList());
        }
    }

    public List<Ticket> getRecentTickets(User author) {
        return ticketRepository.findTop5ByAuthorOrderByCreatedAtDesc(author);
    }

    public List<Ticket> searchTickets(User author, String keyword, TicketStatus status) {
        if (keyword != null && keyword.trim().isEmpty())
            keyword = null;
        String pattern = (keyword != null) ? "%" + keyword.toLowerCase() + "%" : null;
        return ticketRepository.searchTickets(author, pattern, status);
    }

    public Page<Ticket> getVisibleTicketsPaginated(User user, String search, Pageable pageable) {
        if (search != null && search.trim().isEmpty())
            search = null;
        String pattern = (search != null) ? "%" + search.toLowerCase() + "%" : null;
        return ticketRepository.findVisibleTicketsForResident(user, pattern, pageable);
    }

    public Page<Ticket> getAllMainTicketsPaginated(String search, TicketStatus status, Pageable pageable) {
        if (search != null && search.trim().isEmpty())
            search = null;
        String pattern = (search != null) ? "%" + search.toLowerCase() + "%" : null;
        return ticketRepository.findAllMainTicketsPaginated(pattern, status, pageable);
    }
}
