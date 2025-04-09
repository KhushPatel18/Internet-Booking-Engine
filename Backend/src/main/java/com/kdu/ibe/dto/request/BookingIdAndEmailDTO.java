package com.kdu.ibe.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingIdAndEmailDTO {
    private Long bookingId;
    private String bookingEmail;
}
