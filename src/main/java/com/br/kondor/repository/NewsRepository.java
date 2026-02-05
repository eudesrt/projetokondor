package com.br.kondor.repository;

import com.br.kondor.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long> {

    @Query("SELECT n FROM News n WHERE n.active = true " +
           "AND (n.publishDate <= :now) " +
           "AND (n.expirationDate IS NULL OR n.expirationDate >= :now) " +
           "ORDER BY n.publishDate DESC")
    List<News> findActiveNews(LocalDateTime now);

    List<News> findAllByOrderByPublishDateDesc();

    @Query("SELECT n FROM News n WHERE n.highlighted = true AND n.active = true")
    List<News> findHighlightedNews();

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE News n SET n.highlighted = false")
    void clearAllHighlights();

    @Query("SELECT n FROM News n WHERE n.active = true " +
           "AND (:keyword IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:dateFrom IS NULL OR n.publishDate >= :dateFrom) " +
           "AND (:dateTo IS NULL OR n.publishDate <= :dateTo) " +
           "ORDER BY n.publishDate DESC")
    List<News> searchNews(@org.springframework.data.repository.query.Param("keyword") String keyword,
                          @org.springframework.data.repository.query.Param("dateFrom") LocalDateTime dateFrom,
                          @org.springframework.data.repository.query.Param("dateTo") LocalDateTime dateTo);

    // Add this derived query method to match the service call
    List<News> findByActiveTrueOrderByPublishDateDesc();
}