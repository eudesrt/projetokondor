package com.br.kondor.controller;

import com.br.kondor.model.User;
import com.br.kondor.model.UserStatus;
import com.br.kondor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class RegistrationController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.br.kondor.repository.RoleRepository roleRepository;

    @GetMapping("/register")
    public String registerForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String processRegistration(User user,
            @org.springframework.web.bind.annotation.RequestParam String roleName,
            Model model) {

        user.setUsername(user.getEmail()); // Use Email as Username

        // Check if user already exists
        java.util.Optional<User> existingUserOpt = userRepository.findByUsername(user.getUsername());
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            String statusMsg = "Situação Indefinida";

            if (existingUser.getStatus() == UserStatus.APPROVED) {
                statusMsg = "Ativo";
            } else if (existingUser.getStatus() == UserStatus.PENDING) {
                statusMsg = "Pendente de Aprovação";
            } else if (existingUser.getStatus() == UserStatus.REJECTED) {
                statusMsg = "Recusado";
            }

            model.addAttribute("duplicateEmail", true);
            model.addAttribute("duplicateEmailAddress", user.getEmail());
            model.addAttribute("duplicateEmailStatus", statusMsg);

            // Restore password field empty for security or keep logic as preferred
            // We need to ensure 'user' object is sent back to keep other fields filled
            return "register";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(UserStatus.PENDING);
        user.setActive(false); // Inactive until approved

        // Assign Role
        com.br.kondor.model.Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRoles(java.util.Collections.singleton(role));

        userRepository.save(user);
        return "redirect:/login?registered=true";
    }
}
