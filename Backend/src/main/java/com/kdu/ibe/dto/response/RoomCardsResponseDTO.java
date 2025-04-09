package com.kdu.ibe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RoomCardsResponseDTO {
    private int length;
    private List<RoomCardDTO> roomCardDTOList;
}