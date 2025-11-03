package com.websocket.demo;

import com.websocket.demo.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private String room;
}

