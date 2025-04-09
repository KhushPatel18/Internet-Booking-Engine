package com.kdu.ibe.dto.response;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetAllBookingsResponseDTO {
    private Long bookingId;
    private boolean status;
    private String checkIn;
    private String checkOut;
    private Long rooms;
    private String roomName;
    private String email;
}
