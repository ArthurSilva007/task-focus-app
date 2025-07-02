package Gestaodetarefa.demo.email.EMAILSEVICE;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Envia um e-mail de notificação para um destinatário específico.
     * @param to o endereço de e-mail do destinatário.
     * @param subject o assunto do e-mail.
     * @param text o corpo do e-mail.
     */
    public void sendNotificationEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            // O e-mail "de" é configurado no application.properties
            message.setTo(to); // Usa o e-mail do dono da tarefa
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            System.out.println("Email de notificação enviado para: " + to);
        } catch (Exception e) {
            System.err.println("Erro ao enviar e-mail para " + to + ": " + e.getMessage());
        }
    }
}