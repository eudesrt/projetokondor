package com.br.kondor.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendApprovalEmail(String toEmail, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("eudesrti@gmail.com");
            message.setTo(toEmail);
            message.setSubject("Kondor System - Acesso Aprovado");
            message.setText("Olá " + name
                    + ",\n\nSeu cadastro foi aprovado! Você já pode acessar o sistema.\n\nAtenciosamente,\nEquipe Kondor");

            mailSender.send(message);
            System.out.println(">>> EMAIL enviado com sucesso para: " + toEmail);
        } catch (org.springframework.mail.MailAuthenticationException e) {
            System.err.println(">>> ERRO DE AUTENTICAÇÃO DE EMAIL: Senha ou Usuário rejeitados pelo Google.");
            System.err.println(
                    ">>> DICA: Você está usando sua 'Senha de App'? A senha normal do Google NÃO funciona aqui.");
            System.err.println(">>> Verifique também se o email está correto no application.properties.");
        } catch (Exception e) {
            System.err.println(">>> ERRO ao enviar email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void sendTicketUpdateEmail(String toEmail, Long ticketId, String status, String comment) {
        if (toEmail == null || toEmail.isEmpty()) {
            System.err.println(">>> ERRO: falha ao enviar email - destinatário nulo.");
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("eudesrti@gmail.com");
            message.setTo(toEmail);
            message.setSubject("Kondor System - Atualização de Chamado #" + ticketId);
            message.setText("Olá,\n\nO chamado #" + ticketId + " foi atualizado.\n\n" +
                    "Novo Status: " + status + "\n" +
                    "Comentário: " + comment + "\n\n" +
                    "Acesse o sistema para mais detalhes.\n\n" +
                    "Atenciosamente,\nEquipe Kondor");

            mailSender.send(message);
            System.out.println(">>> EMAIL de atualização enviado para: " + toEmail);
        } catch (Exception e) {
            System.err.println(">>> ERRO ao enviar email de chamado: " + e.getMessage());
        }
    }
}
