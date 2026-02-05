package com.br.kondor.controller;

import com.br.kondor.model.User;
import com.br.kondor.model.UserStatus;
import com.br.kondor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/residents")
public class AdminResidentController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.br.kondor.repository.RoleRepository roleRepository;

    @Autowired
    private com.br.kondor.service.EmailService emailService;

    @GetMapping
    public String listResidents(@RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) String keyword,
            Model model) {

        if (keyword != null && !keyword.isEmpty()) {
            if (keyword.trim().isEmpty())
                keyword = null;
            model.addAttribute("users", userRepository.searchUsers(status, keyword));
        } else if (status != null) {
            model.addAttribute("users", userRepository.findByStatus(status));
        } else {
            model.addAttribute("users", userRepository.findAll());
        }

        model.addAttribute("currentStatus", status);
        model.addAttribute("keyword", keyword);
        return "admin/residents/list";
    }

    @PostMapping("/approve/{id}")
    public String approveResident(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.APPROVED);
        user.setActive(true);
        userRepository.save(user);

        // Send Notification
        emailService.sendApprovalEmail(user.getEmail(), user.getFullName());

        return "redirect:/admin/residents?status=PENDING";
    }

    @PostMapping("/reject/{id}")
    public String rejectResident(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.REJECTED);
        user.setActive(false);
        userRepository.save(user);
        return "redirect:/admin/residents?status=PENDING";
    }

    @PostMapping("/toggle-active/{id}")
    public String toggleActive(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
        return "redirect:/admin/residents";
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        model.addAttribute("user", user);
        return "admin/residents/edit";
    }

    @PostMapping("/update/{id}")
    public String updateUser(@PathVariable Long id, User userDetails, @RequestParam String roleName) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(userDetails.getFullName());
        user.setEmail(userDetails.getEmail());
        user.setPhone(userDetails.getPhone());
        user.setUnit(userDetails.getUnit());

        com.br.kondor.model.Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRoles(java.util.Collections.singleton(role));

        userRepository.save(user);
        return "redirect:/admin/residents";
    }
}
