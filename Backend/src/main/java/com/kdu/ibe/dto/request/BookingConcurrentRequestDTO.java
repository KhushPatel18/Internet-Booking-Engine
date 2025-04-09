package com.kdu.ibe.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.List;


@Data
@AllArgsConstructor
@Builder
public class BookingConcurrentRequestDTO {
    private String email;
    private List<Long> roomIds;
    private Long propertyId;
    private Long roomTypeId;
    private Date startDate;
    private Date endDate;
}
