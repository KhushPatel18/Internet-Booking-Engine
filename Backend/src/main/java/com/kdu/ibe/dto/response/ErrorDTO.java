package com.kdu.ibe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorDTO {
    private String msg;
    private HttpStatus httpStatus;

    @Override
    public String toString() {
        return "Error{" +
                "msg='" + msg + '\'' +
                ", httpStatus=" + httpStatus +
                '}';
    }
}