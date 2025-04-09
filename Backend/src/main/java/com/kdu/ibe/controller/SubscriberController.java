package com.kdu.ibe.controller;

import com.kdu.ibe.dto.request.SubscriberRequestDTO;
import com.kdu.ibe.service.SubscriberService;
import com.kdu.ibe.util.ValidationUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller class for handling subscriber-related endpoints.
 */
@RestController
@RequestMapping("/api/v1/subscribers")
public class SubscriberController {

    private final SubscriberService subscriberService;

    /**
     * Constructor for SubscriberController.
     * @param subscriberService The SubscriberService instance to be injected.
     */
    @Autowired
    public SubscriberController(SubscriberService subscriberService) {
        this.subscriberService = subscriberService;
    }

    /**
     * Endpoint for adding a subscriber.
     * @param subscriberRequestDTO The SubscriberRequestDTO containing subscriber information.
     * @param bindingResult The BindingResult for validating the request.
     * @return ResponseEntity with the result of adding the subscriber.
     */
    @PostMapping("/add")
    public ResponseEntity<?> addSubscriber(@Valid @RequestBody SubscriberRequestDTO subscriberRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtil.getValidationErrors(bindingResult));
        }
        subscriberService.addSubscriber(subscriberRequestDTO);
        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint for retrieving all subscriber emails.
     * @return List of subscriber emails.
     */
    @GetMapping
    public List<String> getAllSubscriberEmails() {
        return subscriberService.getAllSubscriberEmails();
    }
}
