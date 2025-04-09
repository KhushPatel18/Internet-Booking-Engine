package com.kdu.ibe.dto.request;


import lombok.Data;

import java.util.Date;

@Data
public class BookRoomsRequestDTO {
    private String email;
    private Long roomsRequired;
    private Long propertyId;
    private Long roomTypeId;
    private Date startDate;
    private Date endDate;
}
