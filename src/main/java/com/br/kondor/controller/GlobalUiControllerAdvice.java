package com.br.kondor.controller;

import com.br.kondor.model.User;
import com.br.kondor.repository.UserRepository;
import com.br.kondor.service.HelpContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.util.Optional;

@ControllerAdvice
public class GlobalUiControllerAdvice {

    @Autowired
    private HelpContactService helpContactService;

    @Autowired
    private UserRepository userRepository;

    @ModelAttribute
    public void addAttributes(Model model) {
        // Inject help contacts into every view
        model.addAttribute("globalHelpContacts", helpContactService.findAllActive());

        // Inject current user into every view for personalized messages (WhatsApp)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            Optional<User> user = userRepository.findByUsername(auth.getName());
            user.ifPresent(value -> model.addAttribute("currentUser", value));
        }
    }
}
