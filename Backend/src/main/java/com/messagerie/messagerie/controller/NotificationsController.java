package com.messagerie.messagerie.controller;

import com.messagerie.messagerie.model.Notifications;
import com.messagerie.messagerie.repository.NotificationsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notifications")
public class NotificationsController {

    @Autowired
    private NotificationsRepository notificationRepository;


}
