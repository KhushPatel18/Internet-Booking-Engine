package com.kdu.ibe.util;

import com.kdu.ibe.dto.request.RoomRateDTO;
import com.kdu.ibe.dto.response.RoomRateResponseDTO;

import java.util.*;

public class GetMinimumNightlyRate {

    public static List<RoomRateResponseDTO> getMinimumNightlyRateForDate(List<RoomRateDTO> roomRatesList) {
        Map<String, Double> minimumRatesMap = new HashMap<>();

        for (RoomRateDTO roomRateDTO : roomRatesList) {
            String date = roomRateDTO.getDate();
            double price = roomRateDTO.getPrice();
            // If the date is not present in the map or the price is lower than the existing minimum, update the map
            if (!minimumRatesMap.containsKey(date) || price < minimumRatesMap.get(date)) {
                minimumRatesMap.put(date, price);
            }
        }

        List<RoomRateResponseDTO> minimumNightlyRatesList = new ArrayList<>();
        for (Map.Entry<String, Double> entry : minimumRatesMap.entrySet()) {
            String date = entry.getKey();
            double minimumRate = (entry.getValue());
            Double discountedOffer = null;
            minimumNightlyRatesList.add(RoomRateResponseDTO.builder().price(minimumRate).date(date).discountedPrice(Optional.ofNullable(discountedOffer)).build());
        }
        Collections.sort(minimumNightlyRatesList, Comparator.comparing(RoomRateResponseDTO::getDate));
        return minimumNightlyRatesList;
    }

}
