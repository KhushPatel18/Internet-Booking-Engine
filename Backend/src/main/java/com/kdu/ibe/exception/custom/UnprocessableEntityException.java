package com.kdu.ibe.exception.custom;

public class UnprocessableEntityException extends RuntimeException{
    public UnprocessableEntityException(String message) {
        super(message);
    }
}
