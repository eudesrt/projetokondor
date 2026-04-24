package com.br.kondor.controller;

import com.br.kondor.model.Ticket;
import com.br.kondor.model.TicketType;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Controller for Resident Ticket management.
 */
@Controller
@RequestMapping("/resident/tickets")
public class ResidentTicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public String listTickets(@RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            Model model, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);

        Pageable pageable = PageRequest.of(page, 6);
        Page<Ticket> ticketPage = ticketService.getVisibleTicketsPaginated(user, search, pageable);

        // Actually, let's just use the page object for the current query total
        model.addAttribute("tickets", ticketPage.getContent());
        model.addAttribute("totalCount", ticketPage.getTotalElements());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", ticketPage.getTotalPages());
        model.addAttribute("search", search);

        // For stats, we need unfiltered counts. We can get them from the repo or
        // service.
        List<Ticket> totalVisible = ticketService.getTicketsByAuthor(user); // Standard resident view
        model.addAttribute("statsTotal", totalVisible.size());
        model.addAttribute("statsOpen",
                totalVisible.stream()
                        .filter(t -> t.getStatus().name().equals("NOVO") || t.getStatus().name().equals("EM_ANDAMENTO"))
                        .count());
        model.addAttribute("statsDone",
                totalVisible.stream().filter(t -> t.getStatus().name().equals("CONCLUIDO")).count());

        return "chamados/lista";
    }

    @Autowired
    private com.br.kondor.service.HelpContactService helpContactService;

    @GetMapping("/new")
    public String newTicketForm(Model model) {
        model.addAttribute("ticket", new Ticket());
        model.addAttribute("types", TicketType.values());
        model.addAttribute("helpContacts", helpContactService.findAllActive());
        return "chamados/novo";
    }

    @PostMapping("/save")
    public String saveTicket(@ModelAttribute Ticket ticket,
            @RequestParam("imageFiles") MultipartFile[] files,
            Authentication authentication) throws IOException {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        ticket.setAuthor(user);
        ticketService.createTicket(ticket, files);
        return "redirect:/resident/tickets";
    }

    @GetMapping("/view/{id}")
    public String viewTicket(@PathVariable Long id, Model model) {
        model.addAttribute("ticket", ticketService.getTicketById(id));
        return "chamados/detalhe";
    }

    @PostMapping("/respond/{id}")
    public String respondToTicket(@PathVariable Long id,
            @RequestParam String message,
            @RequestParam(value = "imageFiles", required = false) MultipartFile[] files,
            Authentication authentication) throws IOException {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        ticketService.addUpdate(id, message, null, user, null, files);
        return "redirect:/resident/tickets/view/" + id;
    }
}
