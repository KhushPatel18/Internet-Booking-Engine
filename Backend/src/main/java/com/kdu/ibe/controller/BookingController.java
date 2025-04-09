package com.kdu.ibe.controller;

import com.azure.core.util.polling.LongRunningOperationStatus;
import com.kdu.ibe.dto.request.CancelRequestDTO;
import com.kdu.ibe.dto.response.BookingResponseDTO;
import com.kdu.ibe.dto.response.ErrorDTO;
import com.kdu.ibe.dto.response.GetAllBookingsResponseDTO;
import com.kdu.ibe.entity.IternaryInfo;
import com.kdu.ibe.exception.custom.UnauthorizedUserAccessException;
import com.kdu.ibe.exception.custom.UnprocessableEntityException;
import com.kdu.ibe.repository.BookingRepository;
import com.kdu.ibe.repository.IternaryInfoRepository;
import com.kdu.ibe.service.*;
import com.kdu.ibe.util.DateUtils;
import com.kdu.ibe.util.ValidationUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import com.kdu.ibe.dto.request.BookingRequestDTO;
import com.kdu.ibe.entity.Booking;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.Future;

/**
 * Controller class for handling booking-related endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/booking")
public class BookingController {

    private final BookingService bookingService;
    private final BookingConcurrentService bookingConcurrentService;
    private final VerificationService verificationService;
    private final OTPService otpService;

    private final EmailService emailService;
    private final AsyncTaskExecutor taskExecutor;


    public BookingController(BookingService bookingService, BookingConcurrentService bookingConcurrentService, VerificationService verificationService, OTPService otpService, EmailService emailService, AsyncTaskExecutor taskExecutor) {
        this.bookingService = bookingService;
        this.bookingConcurrentService = bookingConcurrentService;
        this.verificationService = verificationService;
        this.otpService = otpService;
        this.emailService = emailService;
        this.taskExecutor = taskExecutor;

    }

    /**
     * Constructor for BookingController.
     *
     * @param bookingService           The BookingService instance to be injected.
     * @param bookingConcurrentService The BookingConcurrentService instance to be injected.
     * @param verificationService      The VerificationService instance to be injected.
     * @param otpService               The OTPService instance to be injected.
     */

    /**
     * Endpoint for saving a booking.
     *
     * @param request       The BookingRequestDTO containing booking information.
     * @param bindingResult The BindingResult for validating the request.
     * @return ResponseEntity with the saved booking or validation errors.
     */

    @PostMapping
    public ResponseEntity<?> saveBooking(@Valid @RequestBody BookingRequestDTO request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtil.getValidationErrors(bindingResult));
        }
        try {
            // GQL mutation
            Long bookingId = bookingConcurrentService.performBookingOnGraphql(request.getIternaryInfo());
            // db update
            Booking savedBooking = bookingService.saveBooking(request, bookingId);
            // send confirmation mail asynchronously
            taskExecutor.submit(() -> emailService.sendConfirmationMail(savedBooking.getBookingEmail(), "Booking Confirmation", request.getTravellerInfo().getFirstName(), "Kickdrum", bookingId));
            return ResponseEntity.ok(savedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save booking: " + e.getMessage());
        }
    }

    /**
     * Endpoint for cancelling a booking.
     *
     * @param cancelRequestDTO The CancelRequestDTO containing cancellation information.
     * @return ResponseEntity with an error message or cancellation status.
     */
    @PostMapping("/cancel")
    public ResponseEntity<ErrorDTO> cancelBooking(@Valid @RequestBody CancelRequestDTO cancelRequestDTO) {
        // jwt verification
        if (!DateUtils.verifyDates(cancelRequestDTO.getCheckInDate(), cancelRequestDTO.getCheckOutDate())) {
            throw new UnprocessableEntityException("Date format is in valid please provide valid date format");
        }
        if (Objects.isNull(cancelRequestDTO.getOtp())) {
            if (verificationService.verifyJWT(cancelRequestDTO.getEmail(), cancelRequestDTO.getBookingId())) {
                // allow cancel
                return bookingConcurrentService.cancelBooking(cancelRequestDTO.getBookingId(), cancelRequestDTO.getAvailabilities(), cancelRequestDTO.getCheckInDate(), cancelRequestDTO.getCheckOutDate());
            } else {
                throw new UnauthorizedUserAccessException("User Is Unauthorized to cancel the booking");
            }
        }
        // otp verification
        verificationService.verifyOTP(cancelRequestDTO);

        // otp is used so delete it
        otpService.removeOtps(cancelRequestDTO.getBookingId());

        return bookingConcurrentService.cancelBooking(cancelRequestDTO.getBookingId(), cancelRequestDTO.getAvailabilities(), cancelRequestDTO.getCheckInDate(), cancelRequestDTO.getCheckOutDate());
    }

    /**
     * Endpoint for retrieving booking details.
     *
     * @param bookingId The ID of the booking.
     * @param email     The email associated with the booking.
     * @return ResponseEntity with the booking details.
     */
    @GetMapping
    public ResponseEntity<BookingResponseDTO> getBookingDetails(@RequestParam Long bookingId, @RequestParam String email) {
        return ResponseEntity.ok(bookingService.getBooking(email, bookingId));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<GetAllBookingsResponseDTO>> getAllBookingDetails(@RequestParam String email) {
        return ResponseEntity.ok(bookingService.getAllBookings(email));
    }
}
