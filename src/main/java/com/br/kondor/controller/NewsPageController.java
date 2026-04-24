package com.br.kondor.controller;

import com.br.kondor.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class NewsPageController {

    @Autowired
    private NewsService newsService;

    @GetMapping("/noticias")
    public String listNews(@RequestParam(required = false) String cat, Model model) {
        java.util.List<com.br.kondor.model.News> allNews = newsService.getActiveNews();

        model.addAttribute("categories", java.util.Arrays.asList("Todos", "Manutenção", "Eventos", "Segurança"));
        model.addAttribute("activeCat", cat != null ? cat : "todos");
        model.addAttribute("hero", allNews.isEmpty() ? null : allNews.get(0));
        model.addAttribute("others", allNews.size() > 1 ? allNews.subList(1, allNews.size()) : new java.util.ArrayList<>());

        return "noticias/lista";
    }

    @GetMapping("/noticias/{id}")
    public String newsDetail(@PathVariable Long id, Model model) {
        com.br.kondor.model.News news = newsService.getNewsById(id);
        model.addAttribute("item", news);
        model.addAttribute("recentNews", newsService.getLatestNews(6));

        return "noticias/detalhe";
    }
}
