package com.br.kondor.controller;

import com.br.kondor.model.Ticket;
import com.br.kondor.model.TicketStatus;
import com.br.kondor.model.User;
import com.br.kondor.repository.UserRepository;
import com.br.kondor.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for Administrative Ticket management.
 */
@Controller
@RequestMapping("/admin/tickets")
public class AdminTicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public String listTickets(@RequestParam(required = false) String search,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(defaultValue = "0") int page,
            Model model) {
        Pageable pageable = PageRequest.of(page, 10);
        Page<Ticket> ticketPage = ticketService.getAllMainTicketsPaginated(search, status, pageable);

        model.addAttribute("tickets", ticketPage.getContent());
        model.addAttribute("totalCount", ticketPage.getTotalElements());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", ticketPage.getTotalPages());
        model.addAttribute("search", search);
        model.addAttribute("selectedStatus", status);
        model.addAttribute("statuses", TicketStatus.values());
        model.addAttribute("newTicketsCount", ticketService.getNewTicketsCount());

        // Add global stats
        model.addAttribute("statsNew", ticketService.getTicketsCountByStatus(TicketStatus.NOVO));
        model.addAttribute("statsOngoing", ticketService.getTicketsCountByStatus(TicketStatus.EM_ANDAMENTO));
        model.addAttribute("statsDone", ticketService.getTicketsCountByStatus(TicketStatus.CONCLUIDO));
        model.addAttribute("statsTotal", ticketService.getTotalMainTicketsCount());

        return "admin/tickets/list";
    }

    @GetMapping("/view/{id}")
    public String viewTicket(@PathVariable Long id, Model model) {
        Ticket ticket = ticketService.getTicketById(id);
        model.addAttribute("ticket", ticket);
        model.addAttribute("statuses", TicketStatus.values());
        model.addAttribute("allTickets", ticketService.getAllMainTickets());
        return "admin/tickets/view";
    }

    @PostMapping("/respond/{id}")
    public String respondToTicket(@PathVariable Long id,
            @RequestParam String message,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) String additionalInfo,
            @RequestParam(value = "imageFiles", required = false) org.springframework.web.multipart.MultipartFile[] files,
            Authentication authentication) throws java.io.IOException {
        User admin = userRepository.findByUsername(authentication.getName()).orElse(null);
        ticketService.addUpdate(id, message, status, admin, additionalInfo, files);
        return "redirect:/admin/tickets/view/" + id;
    }

    @PostMapping("/link")
    public String linkTickets(@RequestParam Long parentId, @RequestParam Long childId) {
        ticketService.linkTickets(parentId, childId);
        return "redirect:/admin/tickets/view/" + parentId;
    }
}
