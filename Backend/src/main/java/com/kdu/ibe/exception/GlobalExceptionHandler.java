package com.kdu.ibe.exception;

import com.kdu.ibe.dto.response.ErrorDTO;
import com.kdu.ibe.exception.custom.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Global exception handler for handling exceptions thrown by controllers.
 */
@ControllerAdvice
public class GlobalExceptionHandler {


    /**
     * Handles CustomJsonParsingException and returns a ResponseEntity with an ErrorDTO.
     *
     * @param ex The CustomJsonParsingException thrown.
     * @return ResponseEntity containing the ErrorDTO.
     */
    @ExceptionHandler(value = {CustomJsonParsingException.class})
    public ResponseEntity<ErrorDTO> handleJsonParseException(CustomJsonParsingException ex) {
        ErrorDTO error = new ErrorDTO(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handles EntityNotFoundException and returns a ResponseEntity with an ErrorDTO.
     *
     * @param ex The EntityNotFoundException thrown.
     * @return ResponseEntity containing the ErrorDTO.
     */
    @ExceptionHandler(value = {EntityNotFoundException.class})
    public ResponseEntity<ErrorDTO> handleDataNotFoundException(EntityNotFoundException ex) {
        ErrorDTO error = new ErrorDTO(ex.getMessage(), HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles UnprocessableEntityException and returns a ResponseEntity with an ErrorDTO.
     *
     * @param ex The UnprocessableEntityException thrown.
     * @return ResponseEntity containing the ErrorDTO.
     */
    @ExceptionHandler(value = {UnprocessableEntityException.class})
    public ResponseEntity<ErrorDTO> handleUnProcessableEntityException(UnprocessableEntityException ex) {
        ErrorDTO error = new ErrorDTO(ex.getMessage(), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles UnauthorizedUserAccessException and returns a ResponseEntity with an ErrorDTO.
     *
     * @param ex The UnauthorizedUserAccessException thrown.
     * @return ResponseEntity containing the ErrorDTO.
     */
    @ExceptionHandler(value = {UnauthorizedUserAccessException.class})
    public ResponseEntity<ErrorDTO> handleUnauthorizedAccessException(UnauthorizedUserAccessException ex) {
        ErrorDTO error = new ErrorDTO(ex.getMessage(), HttpStatus.UNAUTHORIZED);
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handles BookingConflictException and returns a ResponseEntity with an ErrorDTO.
     *
     * @param ex The BookingConflictException thrown.
     * @return ResponseEntity containing the ErrorDTO.
     */
    @ExceptionHandler(value = {BookingConflictException.class})
    public ResponseEntity<ErrorDTO> handleFetchFailedException(BookingConflictException ex) {
        ErrorDTO error = new ErrorDTO(ex.getMessage(), HttpStatus.valueOf(409));
        return new ResponseEntity<>(error, HttpStatus.valueOf(409));
    }

    /**
     * Handles generic exceptions and returns a ResponseEntity with an ErrorDTO.
     *
     * @param ex The Exception thrown.
     * @return ResponseEntity containing the ErrorDTO.
     */
    @ExceptionHandler(value = {Exception.class})
    public ResponseEntity<ErrorDTO> handleException(Exception ex) {
        ErrorDTO error = new ErrorDTO(ex.getMessage(), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}