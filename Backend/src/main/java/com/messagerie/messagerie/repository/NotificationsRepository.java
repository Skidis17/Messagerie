package com.messagerie.messagerie.repository;

import com.messagerie.messagerie.model.Notifications;
import com.messagerie.messagerie.model.Utilisateurs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.management.Notification;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationsRepository extends JpaRepository<Notifications, Integer> {

}
