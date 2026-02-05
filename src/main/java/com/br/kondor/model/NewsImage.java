package com.br.kondor.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "news_images")
public class NewsImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "news_id")
    private News news;
}
