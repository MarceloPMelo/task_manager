package com.example.init_java.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ------------------- Unauthorized -------------------
    @ExceptionHandler({UserNotFoundException.class, InvalidPasswordException.class,  InvalidTokenException.class})
    public ResponseEntity<Map<String,Object>> handleUnauthorized(RuntimeException ex) {
        return buildResponse("UNAUTHORIZED", ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    // ------------------- Bad Request -------------------
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String,Object>> handleBadRequest(BadRequestException ex) {
        return buildResponse("BAD_REQUEST", ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // Validation errors (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult()
                          .getFieldErrors()
                          .stream()
                          .map(err -> err.getField() + ": " + err.getDefaultMessage())
                          .collect(Collectors.joining(", "));
        return buildResponse("VALIDATION_FAILED", errors, HttpStatus.BAD_REQUEST);
    }
     // ------------------- JSON inválido -------------------
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String,Object>> handleInvalidJson(HttpMessageNotReadableException ex) {
        return buildResponse(
            "BAD_REQUEST",
            "JSON inválido: " + ex.getMostSpecificCause().getMessage(),
            HttpStatus.BAD_REQUEST
        );
    }

    // ------------------- Not Found -------------------
    @ExceptionHandler({ResourceNotFoundException.class, NoHandlerFoundException.class})
    public ResponseEntity<Map<String,Object>> handleNotFound(Exception ex) {
        return buildResponse("NOT_FOUND", ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // ------------------- Internal Server Error -------------------
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> handleGeneric(Exception ex) {
        ex.printStackTrace(); // ou logger
        return buildResponse("INTERNAL_SERVER_ERROR", "Ocorreu um erro interno", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ------------------- Utility -------------------
    private ResponseEntity<Map<String,Object>> buildResponse(String code, String message, HttpStatus status) {
        Map<String,Object> body = new HashMap<>();
        body.put("error", code);
        body.put("message", message);
        body.put("status", status.value());
        return ResponseEntity.status(status).body(body);
    }
}
