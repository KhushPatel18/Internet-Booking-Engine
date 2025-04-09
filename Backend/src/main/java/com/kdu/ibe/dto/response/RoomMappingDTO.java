package com.kdu.ibe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomMappingDTO {
    private int roomTypeId;
    private double averageRoomRate;
}
