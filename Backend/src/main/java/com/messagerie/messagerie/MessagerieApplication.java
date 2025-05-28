package com.messagerie.messagerie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.messagerie.messagerie.repository") // Adjust package
@ComponentScan(basePackages = {
		"com.messagerie.messagerie.controller",
		"com.messagerie.messagerie.service",
		"com.messagerie.messagerie.repository",
		"com.messagerie.messagerie.config",
})
public class MessagerieApplication {
	public static void main(String[] args) {
		SpringApplication.run(MessagerieApplication.class, args);
	}
}