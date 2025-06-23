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
     * Envia um e-mail de notificação.
     *
     * @param to destinatário
     * @param subject assunto do e-mail
     * @param body corpo do e-mail
     */
    public void sendNotificationEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("notify@taskfocus.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println(">>> E-mail de notificação enviado para " + to);
        } catch (Exception e) {
            System.err.println("!!! Erro ao enviar e-mail: " + e.getMessage());
        }
    }
}
