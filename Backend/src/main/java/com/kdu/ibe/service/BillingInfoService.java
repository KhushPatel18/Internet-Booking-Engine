package com.kdu.ibe.service;

import com.kdu.ibe.entity.BillingInfo;
import com.kdu.ibe.exception.custom.UnprocessableEntityException;
import com.kdu.ibe.repository.BillingInfoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for handling billing information.
 */
@Service
public class BillingInfoService {
    private final BillingInfoRepository billingInfoRepository;

    /**
     * Constructor for BillingInfoService.
     * @param billingInfoRepository The BillingInfoRepository instance to be injected.
     */
    public BillingInfoService(BillingInfoRepository billingInfoRepository) {
        this.billingInfoRepository = billingInfoRepository;
    }

    /**
     * Method to save billing information.
     * @param billingInfo The BillingInfo object to be saved.
     * @return The saved BillingInfo object.
     */
    public BillingInfo saveBillingInfo(BillingInfo billingInfo) {
        return billingInfoRepository.save(billingInfo);
    }

    /**
     * Method to get billing information by booking ID.
     * @param bookingId The ID of the booking.
     * @return The BillingInfo object associated with the booking ID.
     * @throws UnprocessableEntityException if no billing information is found for the given booking ID.
     */
    public BillingInfo getByBookingId(Long bookingId) {
        List<BillingInfo> billingInfos = billingInfoRepository.getByBookingId(bookingId);
        if (billingInfos.isEmpty()) {
            throw new UnprocessableEntityException("Not able to find any BillingInfo of bookingId " + bookingId);
        }
        return billingInfos.get(0);
    }
}
