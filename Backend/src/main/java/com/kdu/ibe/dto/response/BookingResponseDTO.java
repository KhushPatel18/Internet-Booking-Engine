package com.kdu.ibe.dto.response;

import com.kdu.ibe.entity.BillingInfo;
import com.kdu.ibe.entity.IternaryInfo;
import com.kdu.ibe.entity.PaymentInfo;
import com.kdu.ibe.entity.TravellerInfo;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class BookingResponseDTO {
    private IternaryInfo iternaryInfo;
    private PaymentInfo paymentInfo;
    private BillingInfo billingInfo;
    private TravellerInfo travellerInfo;
}
