package com.kdu.ibe.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Builder
@Data
public class RoomResponseDTO {
    private String roomTypeName;
    private int maxCapacity;
    private int doubleBeds;
    private int singleBeds;
    private Integer area;
    private String date;
    private Long roomTypeId;
}
