package com.br.kondor.service;

import com.br.kondor.model.News;
import com.br.kondor.model.NewsImage;
import com.br.kondor.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepository;

    private final String uploadDir = "uploads/news/";

    public List<News> getActiveNews() {
        return newsRepository.findActiveNews(LocalDateTime.now());
    }

    public List<News> getAllNews() {
        return newsRepository.findAllByOrderByPublishDateDesc();
    }

    @Transactional
    public News saveNews(News incomingNews, MultipartFile[] files) throws IOException {
        System.out.println(
                "DEBUG SERVICE SAVE: ID=" + incomingNews.getId() + ", IncomingActive=" + incomingNews.isActive());

        News news;
        if (incomingNews.getId() == null) {
            // Create new
            news = incomingNews;
        } else {
            // Update existing
            news = getNewsById(incomingNews.getId());
            news.setTitle(sanitize(incomingNews.getTitle()));
            news.setContent(sanitize(incomingNews.getContent()));
            news.setPublishDate(incomingNews.getPublishDate());
            news.setExpirationDate(incomingNews.getExpirationDate());
            news.setActive(incomingNews.isActive());
        }

        // Initialize collections if null
        if (news.getImages() == null) {
            news.setImages(new ArrayList<>());
        }
        if (news.getComments() == null) {
            news.setComments(new ArrayList<>());
        }

        // Sanitize input
        news.setTitle(sanitize(news.getTitle()));
        news.setContent(sanitize(news.getContent()));

        // Process new images (Common for both CREATE and UPDATE)
        if (files != null && files.length > 0) {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(file.getInputStream(), filePath);

                    NewsImage newsImage = new NewsImage();
                    newsImage.setImageUrl("/news/" + fileName);
                    newsImage.setNews(news);
                    news.getImages().add(newsImage);
                    System.out.println("Image saved: " + newsImage.getImageUrl());
                }
            }
        }

        // Handle highlighting logic
        if (incomingNews.isHighlighted()) {
            newsRepository.clearAllHighlights();
            news.setHighlighted(true);
        } else {
            news.setHighlighted(false);
        }

        return newsRepository.save(news);
    }

    private String sanitize(String input) {
        if (input == null)
            return null;
        return input.replace("\u2013", "-") // en-dash
                .replace("\u2014", "-") // em-dash
                .replace("\u2018", "'") // smart quote single left
                .replace("\u2019", "'") // smart quote single right
                .replace("\u201c", "\"") // smart quote double left
                .replace("\u201d", "\"") // smart quote double right
                .replace("\u00a0", " "); // non-breaking space
    }

    public void deleteNews(Long id) {
        newsRepository.deleteById(id);
    }

    public News getNewsById(Long id) {
        return newsRepository.findById(id).orElseThrow(() -> new RuntimeException("Notícia não encontrada"));
    }

    @Transactional
    public void setHighlight(Long newsId) {
        // 1. Remove highlight from all news
        newsRepository.clearAllHighlights();

        // 2. Set highlight for the specific news
        News news = getNewsById(newsId);
        news.setHighlighted(true);
        newsRepository.save(news);
    }

    public News getHighlightedNews() {
        List<News> highlights = newsRepository.findHighlightedNews();
        if (!highlights.isEmpty()) {
            return highlights.get(0);
        }
        // Fallback: Get the latest active news
        List<News> latest = newsRepository.findActiveNews(LocalDateTime.now());
        if (!latest.isEmpty()) {
            return latest.get(0);
        }
        return null; // No news available
    }

    public List<News> getLatestNews(int limit) {
        List<News> activeNews = newsRepository.findActiveNews(LocalDateTime.now());
        News highlighted = getHighlightedNews();

        List<News> result = new ArrayList<>();
        int count = 0;

        for (News n : activeNews) {
            // Skip the highlighted one
            if (highlighted != null && n.getId().equals(highlighted.getId())) {
                continue;
            }
            if (count >= limit)
                break;
            result.add(n);
            count++;
        }
        return result;
    }

    public List<News> searchNews(String keyword, Boolean highlighted, String dateFromStr, String dateToStr) {
        // Compute searchKeyword once (trim and handle empty)
        final String searchKeyword = (keyword == null || keyword.trim().isEmpty()) ? null : keyword.trim();

        // Compute dateFrom using a temporary variable to avoid multiple assignments to
        // final
        LocalDateTime tempDateFrom = null;
        if (dateFromStr != null && !dateFromStr.isEmpty()) {
            try {
                tempDateFrom = LocalDate.parse(dateFromStr).atStartOfDay();
            } catch (DateTimeParseException e) {
                // Log or ignore invalid date
            }
        }
        final LocalDateTime dateFrom = tempDateFrom;

        // Compute dateTo using a temporary variable to avoid multiple assignments to
        // final
        LocalDateTime tempDateTo = null;
        if (dateToStr != null && !dateToStr.isEmpty()) {
            try {
                tempDateTo = LocalDate.parse(dateToStr).atTime(23, 59, 59);
            } catch (DateTimeParseException e) {
                // Log or ignore invalid date
            }
        }
        final LocalDateTime dateTo = tempDateTo;

        // Fetch all active news sorted by date
        List<News> allNews = newsRepository.findByActiveTrueOrderByPublishDateDesc();

        return allNews.stream()
                .filter(n -> {
                    // Filter by keyword
                    if (searchKeyword != null) {
                        if (n.getTitle() == null || !n.getTitle().toLowerCase().contains(searchKeyword.toLowerCase())) {
                            return false;
                        }
                    }

                    // Filter by dates
                    if (dateFrom != null && n.getPublishDate().isBefore(dateFrom)) {
                        return false;
                    }
                    if (dateTo != null && n.getPublishDate().isAfter(dateTo)) {
                        return false;
                    }

                    // Filter by highlighted
                    if (highlighted != null) {
                        if (n.isHighlighted() != highlighted) {
                            return false;
                        }
                    }

                    return true;
                })
                .collect(java.util.stream.Collectors.toList());
    }
}