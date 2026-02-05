package com.br.kondor.controller;

import com.br.kondor.model.News;
import com.br.kondor.model.User;
import com.br.kondor.repository.UserRepository;
import com.br.kondor.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.beans.PropertyEditorSupport;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

/**
 * Controller responsável pela administração de notícias do condomínio.
 * Gerencia operações CRUD (Create, Read, Update, Delete) para notícias.
 */
@Controller
@RequestMapping("/admin/news")
public class AdminNewsController {

    @Autowired
    private NewsService newsService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Configura o binding de dados para converter strings de datetime-local do HTML5
     * para objetos LocalDateTime do Java.
     * 
     * O HTML5 datetime-local envia no formato: "2024-02-04T15:30"
     * Precisamos adicionar ":00" para os segundos se não vier completo.
     */
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(LocalDateTime.class, new PropertyEditorSupport() {
            @Override
            public void setAsText(String text) throws IllegalArgumentException {
                if (text == null || text.trim().isEmpty()) {
                    setValue(null);
                    return;
                }
                
                try {
                    // Remove espaços extras
                    text = text.trim();
                    
                    // Se não tiver segundos (formato: 2024-02-04T15:30), adiciona :00
                    if (text.length() == 16 && text.charAt(13) == ':') {
                        text = text + ":00";
                    }
                    
                    // Parse usando o formato ISO padrão
                    LocalDateTime dateTime = LocalDateTime.parse(text, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                    setValue(dateTime);
                    
                } catch (DateTimeParseException e) {
                    System.err.println("Erro ao converter data: " + text);
                    System.err.println("Erro: " + e.getMessage());
                    throw new IllegalArgumentException("Formato de data inválido: " + text, e);
                }
            }
            
            @Override
            public String getAsText() {
                LocalDateTime value = (LocalDateTime) getValue();
                if (value == null) {
                    return "";
                }
                // Retorna no formato aceito pelo datetime-local: 2024-02-04T15:30
                return value.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            }
        });
    }

    /**
     * Lista todas as notícias cadastradas (ativas e inativas).
     * Rota: GET /admin/news
     */
    @GetMapping
    public String listNews(Model model) {
        try {
            model.addAttribute("newsList", newsService.getAllNews());
            return "admin/news/list";
        } catch (Exception e) {
            System.err.println("Erro ao listar notícias: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("errorMessage", "Erro ao carregar lista de notícias.");
            model.addAttribute("newsList", java.util.Collections.emptyList());
            return "admin/news/list";
        }
    }

    /**
     * Exibe o formulário para criar uma nova notícia.
     * Rota: GET /admin/news/new
     */
    @GetMapping("/new")
    public String newNewsForm(Model model) {
        News news = new News();
        
        // Valores padrão para nova notícia
        news.setActive(true);  // Por padrão, notícia começa ativa
        news.setHighlighted(false);  // Por padrão, não é destaque
        news.setPublishDate(LocalDateTime.now());  // Data/hora atual
        
        // Debug log
        System.out.println("=== CRIANDO NOVA NOTÍCIA ===");
        System.out.println("Active: " + news.isActive());
        System.out.println("Highlighted: " + news.isHighlighted());
        System.out.println("PublishDate: " + news.getPublishDate());
        System.out.println("===========================");
        
        model.addAttribute("news", news);
        return "admin/news/form";
    }

    /**
     * Processa o salvamento de uma notícia (nova ou editada).
     * Rota: POST /admin/news/save
     * 
     * @param news Objeto News preenchido pelo formulário
     * @param files Array de arquivos de imagem enviados
     * @param authentication Dados do usuário autenticado (autor)
     * @param redirectAttributes Atributos para exibir mensagens após redirect
     */
    @PostMapping("/save")
    public String saveNews(
            @ModelAttribute("news") News news,
            @RequestParam(value = "imageFiles", required = false) MultipartFile[] files,
            Authentication authentication,
            RedirectAttributes redirectAttributes) {
        
        try {
            // Debug detalhado
            System.out.println("========================================");
            System.out.println("=== SALVANDO NOTÍCIA ===");
            System.out.println("ID: " + news.getId());
            System.out.println("Título: " + news.getTitle());
            System.out.println("Conteúdo (primeiros 50 chars): " + 
                (news.getContent() != null ? news.getContent().substring(0, Math.min(50, news.getContent().length())) : "null"));
            System.out.println("Active: " + news.isActive());
            System.out.println("Highlighted: " + news.isHighlighted());
            System.out.println("PublishDate: " + news.getPublishDate());
            System.out.println("ExpirationDate: " + news.getExpirationDate());
            System.out.println("Número de imagens: " + (files != null ? files.length : 0));
            
            // Buscar o autor (usuário autenticado)
            User author = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + authentication.getName()));
            
            news.setAuthor(author);
            System.out.println("Autor: " + author.getUsername() + " (" + author.getFullName() + ")");
            
            // Validações básicas
            if (news.getTitle() == null || news.getTitle().trim().isEmpty()) {
                redirectAttributes.addFlashAttribute("errorMessage", "O título é obrigatório.");
                return "redirect:/admin/news/new";
            }
            
            if (news.getContent() == null || news.getContent().trim().isEmpty()) {
                redirectAttributes.addFlashAttribute("errorMessage", "O conteúdo é obrigatório.");
                return "redirect:/admin/news/new";
            }
            
            // Se publishDate for null, usar data atual
            if (news.getPublishDate() == null) {
                news.setPublishDate(LocalDateTime.now());
                System.out.println("PublishDate estava null, setado para agora: " + news.getPublishDate());
            }
            
            // Salvar no banco de dados
            News savedNews = newsService.saveNews(news, files);
            
            System.out.println("Notícia salva com sucesso! ID: " + savedNews.getId());
            System.out.println("========================================");
            
            // Mensagem de sucesso
            String successMessage = news.getId() == null ? 
                "Notícia publicada com sucesso!" : 
                "Notícia atualizada com sucesso!";
            redirectAttributes.addFlashAttribute("successMessage", successMessage);
            
            return "redirect:/admin/news";
            
        } catch (IOException e) {
            System.err.println("Erro de I/O ao salvar notícia: " + e.getMessage());
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", 
                "Erro ao fazer upload das imagens. Por favor, tente novamente.");
            return "redirect:/admin/news/new";
            
        } catch (Exception e) {
            System.err.println("Erro inesperado ao salvar notícia: " + e.getMessage());
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", 
                "Erro ao salvar notícia: " + e.getMessage());
            return "redirect:/admin/news/new";
        }
    }

    /**
     * Exibe o formulário para editar uma notícia existente.
     * Rota: GET /admin/news/edit/{id}
     * 
     * @param id ID da notícia a ser editada
     */
    @GetMapping("/edit/{id}")
    public String editNewsForm(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        try {
            News news = newsService.getNewsById(id);
            
            if (news == null) {
                redirectAttributes.addFlashAttribute("errorMessage", 
                    "Notícia não encontrada com ID: " + id);
                return "redirect:/admin/news";
            }
            
            // Debug log
            System.out.println("=== EDITANDO NOTÍCIA ===");
            System.out.println("ID: " + news.getId());
            System.out.println("Título: " + news.getTitle());
            System.out.println("Active: " + news.isActive());
            System.out.println("Highlighted: " + news.isHighlighted());
            System.out.println("Imagens: " + (news.getImages() != null ? news.getImages().size() : 0));
            System.out.println("=======================");
            
            model.addAttribute("news", news);
            return "admin/news/form";
            
        } catch (Exception e) {
            System.err.println("Erro ao carregar notícia para edição: " + e.getMessage());
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", 
                "Erro ao carregar notícia: " + e.getMessage());
            return "redirect:/admin/news";
        }
    }

    /**
     * Deleta uma notícia (soft delete - apenas marca como inativa).
     * Rota: GET /admin/news/delete/{id}
     * 
     * @param id ID da notícia a ser deletada
     */
    @GetMapping("/delete/{id}")
    public String deleteNews(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            newsService.deleteNews(id);
            
            System.out.println("Notícia deletada com sucesso. ID: " + id);
            
            redirectAttributes.addFlashAttribute("successMessage", 
                "Notícia removida com sucesso!");
            
        } catch (Exception e) {
            System.err.println("Erro ao deletar notícia: " + e.getMessage());
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", 
                "Erro ao remover notícia: " + e.getMessage());
        }
        
        return "redirect:/admin/news";
    }

    /**
     * Toggle rápido do status ativo/inativo de uma notícia via AJAX.
     * Rota: POST /admin/news/toggle-active/{id}
     * 
     * @param id ID da notícia
     * @return ResponseEntity com sucesso ou erro
     */
    @PostMapping("/toggle-active/{id}")
    @ResponseBody
    public String toggleActive(@PathVariable Long id) {
        try {
            News news = newsService.getNewsById(id);
            
            if (news == null) {
                return "{\"success\": false, \"message\": \"Notícia não encontrada\"}";
            }
            
            // Inverte o status
            news.setActive(!news.isActive());
            newsService.saveNews(news, null);
            
            System.out.println("Toggle active para notícia ID " + id + ": " + news.isActive());
            
            return "{\"success\": true, \"active\": " + news.isActive() + "}";
            
        } catch (Exception e) {
            System.err.println("Erro ao alternar status: " + e.getMessage());
            return "{\"success\": false, \"message\": \"" + e.getMessage() + "\"}";
        }
    }

    /**
     * Toggle rápido do status de destaque de uma notícia via AJAX.
     * Rota: POST /admin/news/toggle-highlight/{id}
     */
    @PostMapping("/toggle-highlight/{id}")
    @ResponseBody
    public String toggleHighlight(@PathVariable Long id) {
        try {
            News news = newsService.getNewsById(id);
            
            if (news == null) {
                return "{\"success\": false, \"message\": \"Notícia não encontrada\"}";
            }
            
            // Inverte o status
            news.setHighlighted(!news.isHighlighted());
            newsService.saveNews(news, null);
            
            System.out.println("Toggle highlight para notícia ID " + id + ": " + news.isHighlighted());
            
            return "{\"success\": true, \"highlighted\": " + news.isHighlighted() + "}";
            
        } catch (Exception e) {
            System.err.println("Erro ao alternar destaque: " + e.getMessage());
            return "{\"success\": false, \"message\": \"" + e.getMessage() + "\"}";
        }
    }
}