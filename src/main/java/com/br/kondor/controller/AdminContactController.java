package com.br.kondor.controller;

import com.br.kondor.model.HelpContact;
import com.br.kondor.service.HelpContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin/contacts")
public class AdminContactController {

    @Autowired
    private HelpContactService service;

    @GetMapping
    public String list(Model model) {
        model.addAttribute("contacts", service.findAll());
        return "admin/contacts/list";
    }

    @GetMapping("/new")
    public String form(Model model) {
        model.addAttribute("contact", new HelpContact());
        return "admin/contacts/form";
    }

    @GetMapping("/{id}/edit")
    public String edit(@PathVariable Long id, Model model) {
        model.addAttribute("contact", service.findById(id));
        return "admin/contacts/form";
    }

    @PostMapping
    public String save(@ModelAttribute HelpContact contact, RedirectAttributes ra) {
        service.save(contact);
        ra.addFlashAttribute("success", "Contato salvo com sucesso!");
        return "redirect:/admin/contacts";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes ra) {
        service.delete(id);
        ra.addFlashAttribute("success", "Contato removido com sucesso!");
        return "redirect:/admin/contacts";
    }

    @PostMapping("/{id}/toggle")
    public String toggle(@PathVariable Long id) {
        service.toggleActive(id);
        return "redirect:/admin/contacts";
    }
}
