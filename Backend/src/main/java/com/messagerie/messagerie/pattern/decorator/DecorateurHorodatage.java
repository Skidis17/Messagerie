package com.messagerie.messagerie.pattern.decorator;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DecorateurHorodatage extends Decorator {

    public DecorateurHorodatage(MessageDecore messageDecore) {
        super(messageDecore);
    }

    @Override
    public String getContenu() {

        String horodatage = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return super.getContenu() + " [Horodaté le " + horodatage + "]";
    }
}
