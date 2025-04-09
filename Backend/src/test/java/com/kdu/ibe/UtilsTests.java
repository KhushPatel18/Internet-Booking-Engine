package com.kdu.ibe;
import com.kdu.ibe.dto.request.RoomRateDTO;
import com.kdu.ibe.dto.response.RoomRateResponseDTO;
import com.kdu.ibe.util.GetMinimumNightlyRate;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class UtilsTests {
    @Test
    void testGetMinimumNightlyRateForDate() {
        // Create a list of room rate DTOs
        List<RoomRateDTO> roomRatesList = new ArrayList<>();
        roomRatesList.add(new RoomRateDTO("2024-03-13", 100));
        roomRatesList.add(new RoomRateDTO("2024-03-14", 120));
        roomRatesList.add(new RoomRateDTO("2024-03-13", 90));

        // Get the minimum nightly rates
        List<RoomRateResponseDTO> minimumNightlyRatesList = GetMinimumNightlyRate.getMinimumNightlyRateForDate(roomRatesList);

        // Check if the minimum nightly rates list is not null
        assertNotNull(minimumNightlyRatesList);

        // Check if the minimum nightly rates are calculated correctly
        assertEquals(2, minimumNightlyRatesList.size());
        assertEquals("2024-03-13", minimumNightlyRatesList.get(0).getDate());
        assertTrue(minimumNightlyRatesList.get(0).getPrice() >= 85 && minimumNightlyRatesList.get(0).getPrice() < 90); // Assert within range
        assertEquals("2024-03-14", minimumNightlyRatesList.get(1).getDate());
        assertTrue(minimumNightlyRatesList.get(1).getPrice() >= 115 && minimumNightlyRatesList.get(1).getPrice() <= 119); // Assert within range
    }

}
