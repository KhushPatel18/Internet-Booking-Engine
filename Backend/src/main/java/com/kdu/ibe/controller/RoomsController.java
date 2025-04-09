package com.kdu.ibe.controller;

import com.kdu.ibe.dto.request.RatingUpdateRequestDTO;
import com.kdu.ibe.dto.request.RoomRequestDTO;
import com.kdu.ibe.dto.response.FeedbackStatusDTO;
import com.kdu.ibe.dto.response.RatingUpdateResponseDTO;
import com.kdu.ibe.dto.response.RoomCardsResponseDTO;
import com.kdu.ibe.service.FeedbackService;
import com.kdu.ibe.service.RoomService;
import com.kdu.ibe.util.ValidationUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

/**
 * Controller class for handling room-related endpoints.
 */
@RestController
@RequestMapping("/api/v1/rooms")
public class RoomsController {

    private final RoomService roomService;
    private final FeedbackService feedbackService;

    /**
     * Constructor for RoomsController.
     * @param roomService The RoomService instance to be injected.
     * @param feedbackService The FeedbackService instance to be injected.
     */
    public RoomsController(RoomService roomService, FeedbackService feedbackService) {
        this.roomService = roomService;
        this.feedbackService = feedbackService;
    }

    /**
     * Endpoint for searching rooms and rates.
     * @param roomRequestDTO The RoomRequestDTO containing search parameters.
     * @param bindingResult The BindingResult for validating the request.
     * @param page The page number for pagination.
     * @param pageSize The page size for pagination.
     * @return ResponseEntity with the search results.
     */
    @PostMapping("/searchRooms")
    public ResponseEntity<?> searchRoomsAndRates(@Validated @RequestBody @Valid RoomRequestDTO roomRequestDTO,
                                                 BindingResult bindingResult,
                                                 @RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "2") int pageSize) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtil.getValidationErrors(bindingResult));
        }
        RoomCardsResponseDTO roomCardsResponseDTO = roomService.searchRoomsByParams(roomRequestDTO, page, pageSize);
        if (roomCardsResponseDTO.getRoomCardDTOList() == null || roomCardsResponseDTO.getRoomCardDTOList().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(roomCardsResponseDTO, HttpStatus.OK);
    }

    /**
     * Endpoint for updating room ratings.
     * @param ratingUpdateRequestDTO The RatingUpdateRequestDTO containing rating information.
     * @param bindingResult The BindingResult for validating the request.
     * @return ResponseEntity with the result of the rating update.
     */
    @PostMapping("/updateRatings")
    public ResponseEntity<?> updateRating(@Valid @RequestBody RatingUpdateRequestDTO ratingUpdateRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtil.getValidationErrors(bindingResult));
        }

        return new ResponseEntity<>(roomService.updateRating(ratingUpdateRequestDTO), HttpStatus.OK);
    }

    /**
     * Endpoint for retrieving feedback status.
     * @param feedbackId The ID of the feedback.
     * @return ResponseEntity with the feedback status.
     */
    @GetMapping("/feedback/{feedbackId}")
    public ResponseEntity<FeedbackStatusDTO> getFeedbackStatus(@PathVariable String feedbackId) {
        return ResponseEntity.ok(new FeedbackStatusDTO(feedbackService.getStatus(feedbackId)));
    }

}
