package com.br.kondor.controller;

import com.br.kondor.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.br.kondor.model.Ticket;

@Controller
public class HomeController {

    @Autowired
    private NewsService newsService;

    @Autowired
    private com.br.kondor.repository.UserRepository userRepository;

    @Autowired
    private com.br.kondor.service.TicketService ticketService;

    @GetMapping("/")
    public String home(Model model, Authentication authentication,
            @RequestParam(defaultValue = "0") int ticketPage) {
        String username = authentication.getName();
        com.br.kondor.model.User user = userRepository.findByUsername(username).orElse(null);

        if (user != null && user.getStatus() == com.br.kondor.model.UserStatus.PENDING) {
            return "redirect:/pending-approval";
        }

        // Dashboard Pending Alert
        boolean isAdmin = authentication.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("ROLE_SINDICA")
                || r.getAuthority().equals("ROLE_ZELADOR") || r.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            long pendingApprovals = userRepository.findByStatus(com.br.kondor.model.UserStatus.PENDING).size();
            long newTickets = ticketService.getNewTicketsCount();

            model.addAttribute("pendingCount", pendingApprovals);
            model.addAttribute("newTicketsCount", newTickets);

            // Debugging (will appear in sysout)
            System.out.println(">>> Dashboard Admin: PendingUsers=" + pendingApprovals + ", NewTickets=" + newTickets);
        }

        model.addAttribute("heroNews", newsService.getHighlightedNews());
        model.addAttribute("latestNews", newsService.getLatestNews(4));

        Pageable pageable = PageRequest.of(ticketPage, 5);
        Page<Ticket> tickets;
        if (isAdmin) {
            tickets = ticketService.getAllMainTicketsPaginated(null, null, pageable);
        } else {
            tickets = ticketService.getVisibleTicketsPaginated(user, null, pageable);
        }
        model.addAttribute("recentTickets", tickets.getContent());
        model.addAttribute("ticketsPage", tickets);

        model.addAttribute("username", username);
        model.addAttribute("roles", authentication.getAuthorities());
        return "index";
    }

    @GetMapping("/pending-approval")
    public String pendingApproval(Model model, Authentication authentication) {
        String username = authentication.getName();
        com.br.kondor.model.User user = userRepository.findByUsername(username).orElse(null);
        model.addAttribute("user", user);
        return "pending-approval";
    }

    @Autowired
    private com.br.kondor.repository.CommentRepository commentRepository;

    @Autowired
    private com.br.kondor.service.HelpContactService helpContactService;

    @GetMapping("/news/{id}")
    public String newsDetail(@PathVariable Long id, Model model) {
        model.addAttribute("news", newsService.getNewsById(id));
        model.addAttribute("helpContacts", helpContactService.findAllActive());

        // Add recent news for sidebar (exclude current, limit 6)
        model.addAttribute("recentNews", newsService.getActiveNews().stream()
                .filter(n -> !n.getId().equals(id))
                .limit(6)
                .collect(java.util.stream.Collectors.toList()));

        return "news-detail";
    }

    @org.springframework.web.bind.annotation.PostMapping("/news/{id}/comment")
    public String addComment(@PathVariable Long id, @org.springframework.web.bind.annotation.RequestParam String text,
            Authentication authentication) {
        String username = authentication.getName();
        com.br.kondor.model.User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        com.br.kondor.model.News news = newsService.getNewsById(id);

        com.br.kondor.model.Comment comment = new com.br.kondor.model.Comment();
        comment.setText(text);
        comment.setAuthor(user);
        comment.setNews(news);

        commentRepository.save(comment);

        return "redirect:/news/" + id + "#comments";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
}
