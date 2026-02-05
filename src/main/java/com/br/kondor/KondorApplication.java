package com.br.kondor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.br.kondor.repository")
@EntityScan("com.br.kondor.model")
public class KondorApplication {

	public static void main(String[] args) {
		// Trigger restart for V10 migration
		SpringApplication.run(KondorApplication.class, args);
	}

}
