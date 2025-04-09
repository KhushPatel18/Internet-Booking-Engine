package com.kdu.ibe.dto.request;

import com.kdu.ibe.entity.BillingInfo;
import com.kdu.ibe.entity.PaymentInfo;
import com.kdu.ibe.entity.TravellerInfo;
import jakarta.validation.Valid;
import lombok.Data;

import java.util.List;

@Data
public class BookingRequestDTO {

    @Valid
    private IternaryInfoRequestDTO iternaryInfo;
    @Valid
    private TravellerInfoRequestDTO travellerInfo;
    @Valid
    private BillingInfoRequestDTO billingInfo;
    @Valid
    private PaymentInfoRequestDTO paymentInfo;
}
