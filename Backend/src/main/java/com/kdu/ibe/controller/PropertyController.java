package com.kdu.ibe.controller;

import com.kdu.ibe.dto.graphql.RoomRateResponseItrDTO;
import com.kdu.ibe.dto.request.RoomRateItrRequestDTO;
import com.kdu.ibe.dto.response.RoomRateResponseDTO;
import com.kdu.ibe.service.RoomRateService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller class for handling property-related endpoints.
 */
@RestController
@RequestMapping("/api/v1/property")
@Slf4j
public class PropertyController {

    private final RoomRateService roomRateService;

    /**
     * Constructor for PropertyController.
     * @param roomRateService The RoomRateService instance to be injected.
     */
    public PropertyController(RoomRateService roomRateService) {
        this.roomRateService = roomRateService;
    }

    /**
     * Endpoint for retrieving room rates by property ID.
     * @param propertyId The ID of the property.
     * @return ResponseEntity with the room rates.
     */
    @GetMapping("/getRates/{propertyId}")
    public ResponseEntity<List<RoomRateResponseDTO>> graphqlRateResponse(@PathVariable @Valid int propertyId){
        return new ResponseEntity<>(roomRateService.getRoomRatesByProperty(propertyId),HttpStatus.OK);
    }

    /**
     * Endpoint for retrieving room rates for ITR (Internal Test Room).
     * @param roomRateItrRequestDTO The RoomRateItrRequestDTO containing request information.
     * @return ResponseEntity with the room rates for ITR.
     */
    @PostMapping("/getRatesItr")
    public ResponseEntity<List<RoomRateResponseItrDTO.RoomRateDetails>> getRoomRateItr(@Valid @RequestBody RoomRateItrRequestDTO roomRateItrRequestDTO){
        return ResponseEntity.ok(roomRateService.getRatesForItr(roomRateItrRequestDTO));
    }
}
