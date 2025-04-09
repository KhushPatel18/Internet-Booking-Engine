package com.kdu.ibe.service;


import com.kdu.ibe.entity.OneTimePassword;
import com.kdu.ibe.repository.OneTimePasswordRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class OTPService {


    private final OneTimePasswordRepository oneTimePasswordRepository;

    public OTPService(OneTimePasswordRepository oneTimePasswordRepository) {
        this.oneTimePasswordRepository = oneTimePasswordRepository;
    }

    @Transactional
    public void saveOtp(String otp, Long bookingId) {
        OneTimePassword oneTimePassword = new OneTimePassword();
        oneTimePassword.setOtpValue(Long.parseLong(otp));
        oneTimePassword.setBookingId(bookingId);
        oneTimePasswordRepository.save(oneTimePassword);
        log.info("OTP saved successfully");
    }

    @Transactional
    public void removeOtps(Long bookingId) {
        int rows = oneTimePasswordRepository.deleteByBookingId(bookingId);
        log.info("total of " + rows + " otps removed for bookingId " + bookingId);
    }
}
