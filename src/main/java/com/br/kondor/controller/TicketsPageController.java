package com.br.kondor.controller;

import com.br.kondor.model.Ticket;
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

import java.util.HashMap;
import java.util.Map;

@Controller
public class TicketsPageController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/chamados")
    public String listTickets(
            @RequestParam(required = false, defaultValue = "todos") String filter,
            @RequestParam(defaultValue = "0") int page,
            Authentication authentication,
            Model model) {

        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);

        Pageable pageable = PageRequest.of(page, 10);
        Page<Ticket> allTickets = ticketService.getVisibleTicketsPaginated(user, null, pageable);

        Map<String, Integer> counts = new HashMap<>();
        counts.put("aberto", (int) allTickets.getContent().stream().filter(t -> "aberto".equals(t.getStatus())).count());
        counts.put("andamento", (int) allTickets.getContent().stream().filter(t -> "andamento".equals(t.getStatus())).count());
        counts.put("finalizado", (int) allTickets.getContent().stream().filter(t -> "finalizado".equals(t.getStatus())).count());

        model.addAttribute("counts", counts);
        model.addAttribute("filter", filter);
        model.addAttribute("tickets", allTickets.getContent());
        model.addAttribute("ticketPage", allTickets);

        return "chamados/lista";
    }

    @GetMapping("/chamados/novo")
    public String newTicketForm(Model model) {
        model.addAttribute("categories", java.util.Arrays.asList("Manutenção", "Limpeza", "Portaria", "Segurança", "Outro"));
        return "chamados/novo";
    }

    @GetMapping("/chamados/{id}")
    public String ticketDetail(@PathVariable Long id, Model model) {
        Ticket ticket = ticketService.getTicketById(id);
        model.addAttribute("item", ticket);
        return "chamados/detalhe";
    }
}
