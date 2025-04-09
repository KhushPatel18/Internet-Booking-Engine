package com.kdu.ibe.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;



@Data
@AllArgsConstructor
public class RoomRateDTO {
    private String date;
    private double price;
}
