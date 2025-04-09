package com.kdu.ibe.util;
import com.kdu.ibe.dto.response.RoomCardDTO;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;

public class SortUtils {

    public static Comparator<RoomCardDTO> getComparator(String sortType, boolean ascending) {
        Comparator<RoomCardDTO> comparator;

        switch (sortType) {
            case "rate":
                comparator = Comparator.comparing(RoomCardDTO::getAverageRoomRate);
                break;
            case "rating":
                comparator = Comparator.comparing(RoomCardDTO::getRating);
                break;
            case "review":
                comparator = Comparator.comparing(RoomCardDTO::getReview);
                break;
            case "name":
                comparator = Comparator.comparing(RoomCardDTO::getRoomTypeName);
                break;
            default:
                throw new IllegalArgumentException("Invalid sort type: " + sortType);
        }

        if (!ascending) {
            comparator = comparator.reversed();
        }

        return comparator;
    }

    public static void sortRoomCardDTOList(List<RoomCardDTO> roomCardDTOList, String sortType, String sortOrder) {
        boolean ascending = "ASC".equalsIgnoreCase(sortOrder);

        Comparator<RoomCardDTO> comparator = getComparator(sortType, ascending);

        roomCardDTOList.sort(comparator);
    }
}
