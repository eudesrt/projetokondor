package com.br.kondor.controller;

import com.br.kondor.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @GetMapping
    public String search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean highlighted,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            Model model) {

        model.addAttribute("newsList", newsService.searchNews(keyword, highlighted, dateFrom, dateTo));
        model.addAttribute("keyword", keyword);
        model.addAttribute("highlighted", highlighted);
        model.addAttribute("dateFrom", dateFrom);
        model.addAttribute("dateTo", dateTo);

        // Also inject help contacts for the sidebar if we reuse components
        // model.addAttribute("helpContacts", helpContactService.findAllActive());

        return "noticias/lista";
    }
}
