package com.kdu.ibe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomPageResponseDTO {
    private int roomTypeId;
    private double basicNightlyRate;
    private String date;
}