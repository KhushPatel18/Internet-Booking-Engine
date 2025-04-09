package com.kdu.ibe.exception.custom;


import lombok.Data;

@Data
public class CustomJsonParsingException extends RuntimeException {

    private final String fileName;
    private final int lineNumber;

    public CustomJsonParsingException(String message, String fileName, int lineNumber) {
        super(message);
        this.fileName = fileName;
        this.lineNumber = lineNumber;
    }

    @Override
    public String getMessage() {
        return super.getMessage() + " (File: " + fileName + ", Line: " + lineNumber + ")";
    }

}
