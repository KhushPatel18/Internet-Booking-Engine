package com.kdu.ibe.service;

import com.kdu.ibe.dto.request.CancelRequestDTO;
import com.kdu.ibe.entity.Booking;
import com.kdu.ibe.entity.OneTimePassword;
import com.kdu.ibe.exception.custom.EntityNotFoundException;
import com.kdu.ibe.exception.custom.UnprocessableEntityException;
import com.kdu.ibe.repository.BookingRepository;
import com.kdu.ibe.repository.OneTimePasswordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class VerificationService {

    private final BookingRepository bookingRepository;

    public boolean verifyJWT(String email, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        return booking != null && booking.getBookingEmail().equals(email);
    }

    private final OneTimePasswordRepository otpRepository;

    public VerificationService(BookingRepository bookingRepository, OneTimePasswordRepository otpRepository) {
        this.bookingRepository = bookingRepository;
        this.otpRepository = otpRepository;
    }

    public void verifyOTP(CancelRequestDTO cancelRequestDTO) {
        Long bookingId = cancelRequestDTO.getBookingId();
        Long otpValue = cancelRequestDTO.getOtp();

        OneTimePassword otp = otpRepository.findByOtpValueAndBookingId(otpValue, bookingId);
        if (otp == null) {
            throw new EntityNotFoundException("INVALID OTP");
        }
        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new UnprocessableEntityException("OTP has Expired! TRY AGAIN");
        }

        // success.... otp is ok!

    }
}
