package com.example.init_java.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.UNAUTHORIZED, reason = "Invalid credentials")
public class InvalidPasswordException extends RuntimeException {
    public InvalidPasswordException() {
        super("Invalid credentials");
    }
}
