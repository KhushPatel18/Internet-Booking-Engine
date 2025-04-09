package com.kdu.ibe.exception.custom;

public class BookingConflictException extends RuntimeException{
    public BookingConflictException(String message) {
        super(message);
    }
}
