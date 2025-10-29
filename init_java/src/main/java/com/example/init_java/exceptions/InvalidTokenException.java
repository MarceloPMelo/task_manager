package com.example.init_java.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.UNAUTHORIZED, reason = "Token inválido ou expirado")
public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException() {
        super();
    }

    public InvalidTokenException(String message) {
        super(message);
    }
}
