package com.kdu.ibe.service;

import com.kdu.ibe.dto.response.RoomModalDetailsDTO;
import com.kdu.ibe.entity.RoomDetails;
import com.kdu.ibe.exception.custom.EntityNotFoundException;
import com.kdu.ibe.repository.RoomDetailsRepository;
import org.springframework.stereotype.Service;

/**
 * Service class for managing room modal details.
 * This class provides methods to fetch and return room modal details based on room type ID.
 */
@Service
public class RoomModalService {

    private final RoomDetailsRepository roomDetailsRepository;

    public RoomModalService(RoomDetailsRepository roomDetailsRepository) {
        this.roomDetailsRepository = roomDetailsRepository;
    }

    /**
     * Retrieves and returns the modal details of a room based on the room type ID.
     *
     * @param roomTypeId the ID of the room type for which modal details are to be fetched
     * @return a RoomModalDetailsDTO object containing the modal details of the room
     * @throws EntityNotFoundException if the room type with the given ID is not found
     */

    public RoomModalDetailsDTO getModalDetails(Long roomTypeId) {
        RoomDetails roomDetails = roomDetailsRepository.findById(roomTypeId).orElseThrow(() -> new EntityNotFoundException("Room Type not found with ID: " + roomTypeId));
        return RoomModalDetailsDTO.builder().amenities(roomDetails.getAmenities()).description(roomDetails.getDescription()).standardRateDescription(roomDetails.getStandardRateDescription()).build();
    }
}
