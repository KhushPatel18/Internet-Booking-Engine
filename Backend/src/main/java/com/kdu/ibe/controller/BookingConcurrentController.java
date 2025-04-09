package com.kdu.ibe.controller;

import com.kdu.ibe.dto.request.BookRoomsRequestDTO;
import com.kdu.ibe.service.BookingConcurrentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller class for handling concurrent booking requests.
 */
@RestController
@RequestMapping("/api/v1/prebooking")
public class BookingConcurrentController {
    private final BookingConcurrentService bookingService;

    /**
     * Constructor for BookingConcurrentController.
     *
     * @param bookingService The BookingConcurrentService instance to be injected.
     */
    public BookingConcurrentController(BookingConcurrentService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Endpoint for booking rooms concurrently.
     *
     * @param bookRoomsRequestDTO The request DTO containing booking information.
     * @return ResponseEntity containing a list of booking IDs.
     */
    @PostMapping
    public ResponseEntity<List<Long>> bookRoom(@RequestBody BookRoomsRequestDTO bookRoomsRequestDTO) {
        return ResponseEntity.ok(bookingService.performBooking(bookRoomsRequestDTO));
    }
}
