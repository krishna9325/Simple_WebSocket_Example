package com.websocket.demo;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


@Configuration
@EnableWebSocketMessageBroker //Enable WebSocket message handling backed by a message broker.
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // <-- this must match the frontend URL
                .setAllowedOriginPatterns("*") // allow all origins for testing
                .withSockJS(); // optional if you want SockJS fallback
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic"); // built-in broker for broadcasting
        registry.setApplicationDestinationPrefixes("/app"); // prefix for @MessageMapping
    }
}
