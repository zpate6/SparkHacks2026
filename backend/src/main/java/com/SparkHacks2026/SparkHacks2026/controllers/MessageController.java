package com.SparkHacks2026.SparkHacks2026.controllers;

import com.SparkHacks2026.SparkHacks2026.models.Message;
import com.SparkHacks2026.SparkHacks2026.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    // Get conversation between two users
    @GetMapping("/{user1}/{user2}")
    public Message getConversation(@PathVariable String user1, @PathVariable String user2) {
        Message message = messageRepository.findConversation(user1, user2);
        if (message == null) {
            // Return empty message structure or 404. Returning empty structure is safer for
            // frontend
            // but let's see if we should create it on the fly.
            // For now, return null or empty object.
            return new Message();
        }
        return message;
    }

    // Send a message
    // Request body: { "senderId": "...", "receiverId": "...", "content": "..." }
    @PostMapping
    public Message sendMessage(@RequestBody SendMessageRequest request) {
        Message conversation = messageRepository.findConversation(
                request.getSenderId(), request.getReceiverId());

        if (conversation == null) {
            conversation = new Message();
            conversation.setParticipants(Arrays.asList(request.getSenderId(), request.getReceiverId()));
            conversation.setMessages(new ArrayList<>());
        }

        if (conversation.getMessages() == null) {
            conversation.setMessages(new ArrayList<>());
        }

        Message.ChatMessage chatMessage = new Message.ChatMessage();
        chatMessage.setSenderId(request.getSenderId());
        chatMessage.setText(request.getContent());

        conversation.getMessages().add(chatMessage);

        return messageRepository.save(conversation);
    }

    // Valid for internal DTO
    public static class SendMessageRequest {
        private String senderId;
        private String receiverId;
        private String content;

        public String getSenderId() {
            return senderId;
        }

        public void setSenderId(String senderId) {
            this.senderId = senderId;
        }

        public String getReceiverId() {
            return receiverId;
        }

        public void setReceiverId(String receiverId) {
            this.receiverId = receiverId;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}
