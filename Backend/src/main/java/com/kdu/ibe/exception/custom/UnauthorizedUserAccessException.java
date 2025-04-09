package com.kdu.ibe.exception.custom;

public class UnauthorizedUserAccessException extends RuntimeException{
    public UnauthorizedUserAccessException(String message) {
        super(message);
    }
}
