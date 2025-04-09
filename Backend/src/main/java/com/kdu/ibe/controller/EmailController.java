package com.kdu.ibe.controller;

import com.azure.communication.email.EmailClient;
import com.azure.communication.email.EmailClientBuilder;
import com.azure.communication.email.models.EmailAddress;
import com.azure.communication.email.models.EmailMessage;
import com.azure.communication.email.models.EmailSendResult;
import com.azure.core.util.polling.LongRunningOperationStatus;
import com.azure.core.util.polling.PollResponse;
import com.azure.core.util.polling.SyncPoller;
import com.kdu.ibe.dto.request.AddPromotionRequestDTO;
import com.kdu.ibe.dto.request.EmailRequestDTO;
import com.kdu.ibe.dto.request.OTPEmailRequestDTO;
import com.kdu.ibe.dto.response.PromoEmailResponseDTO;
import com.kdu.ibe.service.EmailService;
import com.kdu.ibe.service.OTPService;
import com.kdu.ibe.util.OtpGenerator;
import com.kdu.ibe.util.ValidationUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller class for handling email-related endpoints.
 */
@RestController
@RequestMapping("/api/v1/emails")
public class EmailController {

    private final EmailService emailService;
    private final OTPService otpService;

    /**
     * Constructor for EmailController.
     *
     * @param emailService The EmailService instance to be injected.
     * @param otpService   The OTPService instance to be injected.
     */
    public EmailController(EmailService emailService, OTPService otpService) {
        this.emailService = emailService;
        this.otpService = otpService;
    }
    /**
     * Endpoint for sending an OTP email.
     *
     * @param emailRequestDTO The OTPEmailRequestDTO containing email and booking information.
     * @param bindingResult   The BindingResult for validating the request.
     * @return ResponseEntity with the result of sending the email.
     */
    @PostMapping("/otp")
    public ResponseEntity<?> sendOtpEmail(@Validated @RequestBody @Valid OTPEmailRequestDTO emailRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtil.getValidationErrors(bindingResult));
        }
        String otp = OtpGenerator.generateOTP();
        otpService.saveOtp(otp, emailRequestDTO.getBookingId());
        return new ResponseEntity<>(emailService.sendEmail(emailRequestDTO.getEmail(), emailRequestDTO.getType(), emailRequestDTO.getCustomerName(), emailRequestDTO.getCompanyName(), emailRequestDTO.getBookingId(), otp), HttpStatus.OK);
    }

    /**
     * Endpoint for sending a booking confirmation email.
     *
     * @param emailRequestDTO The OTPEmailRequestDTO containing email and booking information.
     * @param bindingResult   The BindingResult for validating the request.
     * @return ResponseEntity with the result of sending the email.
     */
    @PostMapping("/booking-confirmation")
    public ResponseEntity<?> sendBookingConfirmation(@Validated @RequestBody @Valid OTPEmailRequestDTO emailRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtil.getValidationErrors(bindingResult));
        }
        return new ResponseEntity<>(emailService.sendEmail(emailRequestDTO.getEmail(), emailRequestDTO.getType(), emailRequestDTO.getCustomerName(), emailRequestDTO.getCompanyName(), emailRequestDTO.getBookingId()), HttpStatus.OK);
    }


    @PostMapping("/add-promotion")
    public ResponseEntity<PromoEmailResponseDTO> addPromotionTemplate(@RequestBody AddPromotionRequestDTO addPromotionRequestDTO) {
        return ResponseEntity.ok(emailService.sendPromotionalMails(addPromotionRequestDTO.getHtmlTemplate()));
    }

}
