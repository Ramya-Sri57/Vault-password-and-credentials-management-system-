package com.passwordvault.backend.exception;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
   @ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<Map<String, Object>> handleResourceNotFound(
        ResourceNotFoundException ex) {

    Map<String, Object> response = new HashMap<>();

    response.put("status", 404);
    response.put("message", ex.getMessage());

    return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(response);
}

@ExceptionHandler(BadRequestException.class)
public ResponseEntity<Map<String, Object>> handleBadRequest(BadRequestException ex) {
    Map<String, Object> response = new HashMap<>();
    response.put("status", 400);
    response.put("message", ex.getMessage());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
}

@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String, Object>> handleValidationException(
        MethodArgumentNotValidException ex) {

    Map<String, Object> response = new HashMap<>();

    String message = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .findFirst()
            .map(error -> error.getDefaultMessage())
            .orElse("Invalid request data.");

    response.put("status", 400);
    response.put("message", message);

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
}
@ExceptionHandler(ConflictException.class)
public ResponseEntity<Map<String, Object>> handleConflict(ConflictException ex) {

    Map<String, Object> response = new HashMap<>();
    response.put("status", 409);
    response.put("message", ex.getMessage());

    return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
}
@ExceptionHandler(UnauthorizedException.class)
public ResponseEntity<Map<String, Object>> handleUnauthorized(
        UnauthorizedException ex) {

    Map<String, Object> response = new HashMap<>();
    response.put("status", 401);
    response.put("message", ex.getMessage());

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
}
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(
            Exception ex) {

        Map<String, Object> response = new HashMap<>();

        response.put("status", 500);
        response.put("message", "Something went wrong. Please try again later.");

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }
}