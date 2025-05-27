package com.messagerie.messagerie.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Commandant {
    @RequestMapping("/commandant")
    public String commandant() {
        return "Commandant";
    }
}
