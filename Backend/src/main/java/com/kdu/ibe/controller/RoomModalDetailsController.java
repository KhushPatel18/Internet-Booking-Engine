package com.kdu.ibe.controller;

import com.kdu.ibe.dto.graphql.PromotionsResponseDTO;
import com.kdu.ibe.dto.request.PromoCodeRequestDTO;
import com.kdu.ibe.dto.request.RoomModalRequestDTO;
import com.kdu.ibe.dto.response.RoomModalDetailsDTO;
import com.kdu.ibe.dto.response.RoomModalResponseDTO;
import com.kdu.ibe.entity.Feedback;
import com.kdu.ibe.service.FeedbackService;
import com.kdu.ibe.service.PromotionService;
import com.kdu.ibe.service.RoomModalService;
import com.kdu.ibe.util.ValidationUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller class for handling room modal details and promotions.
 */
@RestController
@RequestMapping("/api/v1/roomModal")
public class RoomModalDetailsController {
    private final PromotionService promotionService;
    private final RoomModalService roomModalService;

    private final FeedbackService feedbackService;

    /**
     * Constructor for RoomModalDetailsController.
     * @param promotionService The PromotionService instance to be injected.
     * @param roomModalService The RoomModalService instance to be injected.
     */
    public RoomModalDetailsController(PromotionService promotionService, RoomModalService roomModalService, FeedbackService feedbackService) {
        this.promotionService = promotionService;
        this.roomModalService = roomModalService;
        this.feedbackService = feedbackService;
    }

    /**
     * Endpoint for retrieving all promotions.
     * @param roomModalRequestDTO The RoomModalRequestDTO containing request information.
     * @param bindingResult The BindingResult for validating the request.
     * @return ResponseEntity with the room modal details and promotions.
     */
    @PostMapping
    public ResponseEntity<?> getAllPromotions(@Validated @Valid @RequestBody RoomModalRequestDTO roomModalRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtil.getValidationErrors(bindingResult));
        }
        List<PromotionsResponseDTO.Promotion> promotions = promotionService.retrieveValidPromotions(roomModalRequestDTO.getStartDate(), roomModalRequestDTO.getEndDate());
        RoomModalDetailsDTO roomModalDetailsDTO = roomModalService.getModalDetails(roomModalRequestDTO.getRoomTypeId());
        RoomModalResponseDTO roomModalResponseDTO = RoomModalResponseDTO.builder().promotions(promotions).amenities(roomModalDetailsDTO.getAmenities()).standardRateDescription(roomModalDetailsDTO.getStandardRateDescription()).description(roomModalDetailsDTO.getDescription()).build();
        return new ResponseEntity<>(roomModalResponseDTO, HttpStatus.OK);
    }

    /**
     * Endpoint for retrieving a custom promotion.
     * @param promoCodeRequestDTO The PromoCodeRequestDTO containing the promo code.
     * @param bindingResult The BindingResult for validating the request.
     * @return ResponseEntity with the custom promotion.
     */
    @PostMapping("/promocode")
    public ResponseEntity<?> getCustomPromotion(@Valid @RequestBody PromoCodeRequestDTO promoCodeRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtil.getValidationErrors(bindingResult));
        }
        PromotionsResponseDTO.Promotion promotionResponseDTO = promotionService.getCustomPromotion(promoCodeRequestDTO);
        return ResponseEntity.ok(promotionResponseDTO);
    }

    @GetMapping("/feedbacks/{roomTypeId}")
    public ResponseEntity<List<Feedback>> getFeedbacks(@PathVariable Long roomTypeId){
        return ResponseEntity.ok(feedbackService.getFeedbackByRoomTypeId(roomTypeId));
    }
}
