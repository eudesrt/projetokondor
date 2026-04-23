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
        try {
            String username = authentication.getName();
            com.br.kondor.model.User user = userRepository.findByUsername(username).orElse(null);

            if (user != null && user.getStatus() == com.br.kondor.model.UserStatus.PENDING) {
                return "redirect:/pending-approval";
            }

            boolean isAdmin = authentication.getAuthorities().stream().anyMatch(r ->
                r.getAuthority().equals("ROLE_SINDICA") ||
                r.getAuthority().equals("ROLE_ZELADOR") ||
                r.getAuthority().equals("ROLE_ADMIN"));

            // User data
            String nome = "Morador";
            String initials = "MO";
            String unit = "Unidade não informada";
            if (user != null) {
                String fullName = user.getFullName() != null ? user.getFullName() : "Morador";
                String[] names = fullName.split(" ");
                nome = names[0];
                initials = names[0].substring(0, 1).toUpperCase() +
                           (names.length > 1 ? names[names.length - 1].substring(0, 1).toUpperCase() : "");
                unit = user.getUnit() != null ? user.getUnit() : "Unidade não informada";
            }
            java.util.Map<String, String> userData = new java.util.HashMap<>();
            userData.put("name", nome);
            userData.put("fullName", user != null ? user.getFullName() : nome);
            userData.put("unit", unit);
            userData.put("initials", initials);
            model.addAttribute("user", userData);

            // News
            try {
                model.addAttribute("newsPreview", newsService.getLatestNews(2));
            } catch (Exception e) {
                model.addAttribute("newsPreview", new java.util.ArrayList<>());
                System.out.println(">>> Error loading news: " + e.getMessage());
            }

            // Ticker
            model.addAttribute("tickerItems", new java.util.ArrayList<>());
            model.addAttribute("urgent", null);

            // Tickets
            try {
                Pageable pageable = PageRequest.of(ticketPage, 3);
                Page<Ticket> tickets = isAdmin
                    ? ticketService.getAllMainTicketsPaginated(null, null, pageable)
                    : ticketService.getVisibleTicketsPaginated(user, null, pageable);
                model.addAttribute("recentTickets", tickets.getContent());
                model.addAttribute("ticketsPage", tickets);
            } catch (Exception e) {
                model.addAttribute("recentTickets", new java.util.ArrayList<>());
                System.out.println(">>> Error loading tickets: " + e.getMessage());
            }

            // Contacts
            java.util.List<java.util.Map<String, Object>> contacts = new java.util.ArrayList<>();
            try {
                for (com.br.kondor.model.HelpContact c : helpContactService.findAllActive()) {
                    java.util.Map<String, Object> m = new java.util.HashMap<>();
                    m.put("id", c.getId());
                    m.put("name", c.getName());
                    m.put("role", c.getRole() != null ? c.getRole() : "Contato");
                    m.put("phone", c.getPhoneNumber());
                    m.put("whats", c.isWhatsapp());
                    m.put("avatar", c.getName().substring(0, 1).toUpperCase());
                    m.put("color", "#0a84c8");
                    contacts.add(m);
                }
            } catch (Exception e) {
                System.out.println(">>> Error loading contacts: " + e.getMessage());
            }
            model.addAttribute("contacts", contacts);

        } catch (Exception e) {
            System.out.println(">>> HOME ERROR: " + e.getMessage());
            e.printStackTrace();
        }
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

    @GetMapping("/admin")
    public String adminDashboard(Authentication authentication, Model model) {
        String username = authentication.getName();
        com.br.kondor.model.User user = userRepository.findByUsername(username).orElse(null);

        java.util.Map<String, Object> admin = new java.util.HashMap<>();
        if (user != null) {
            String[] names = user.getFullName().split(" ");
            String initials = names[0].substring(0, 1).toUpperCase() +
                             names[names.length - 1].substring(0, 1).toUpperCase();
            admin.put("name", names[0]);
            admin.put("initials", initials);
        } else {
            admin.put("name", "Admin");
            admin.put("initials", "AA");
        }

        java.util.Map<String, Integer> stats = new java.util.HashMap<>();
        stats.put("residents", 120);
        stats.put("units", 150);
        stats.put("openTickets", 5);
        stats.put("news", 25);
        stats.put("packages", 12);

        model.addAttribute("admin", admin);
        model.addAttribute("stats", stats);
        model.addAttribute("featuredHero", null);
        model.addAttribute("featuredSecondary", new java.util.ArrayList<>());
        model.addAttribute("featuredSmall", new java.util.ArrayList<>());
        model.addAttribute("recentTickets", new java.util.ArrayList<>());
        model.addAttribute("urgent", new java.util.ArrayList<>());
        model.addAttribute("activity", new java.util.ArrayList<>());

        return "admin/dashboard";
    }
}
