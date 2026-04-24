package com.br.kondor.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SignupPageController {

    @GetMapping("/cadastro")
    public String signup(Model model) {
        model.addAttribute("towers", java.util.Arrays.asList("Torre A", "Torre B", "Torre C"));
        return "cadastro";
    }
}
