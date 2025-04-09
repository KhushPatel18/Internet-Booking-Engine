package com.kdu.ibe.service;

import com.kdu.ibe.dto.request.IternaryInfoRequestDTO;
import com.kdu.ibe.dto.request.PaymentInfoRequestDTO;
import com.kdu.ibe.dto.response.BookingResponseDTO;
import com.kdu.ibe.dto.response.GetAllBookingsResponseDTO;
import com.kdu.ibe.entity.*;
import com.kdu.ibe.exception.custom.UnprocessableEntityException;
import com.kdu.ibe.service.BillingInfoService;
import com.kdu.ibe.service.PaymentInfoService;
import com.kdu.ibe.service.TravellerInfoService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.kdu.ibe.dto.request.BookingRequestDTO;
import com.kdu.ibe.repository.BookingRepository;

import java.awt.print.Book;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import static com.kdu.ibe.util.ValidationUtil.isValidEmail;
import static com.kdu.ibe.util.ValidationUtil.validateCardDetails;


@Service
@Slf4j
/*
 * Service layer for handling booking-related operations.
 * This service is responsible for creating, retrieving, and managing booking information.
 * It interacts with various repositories and services to perform these operations.
 *
 */ public class BookingService {


    private final BookingRepository bookingRepository;


    private final TravellerInfoService travellerInfoService;


    private final BillingInfoService billingInfoService;


    private final PaymentInfoService paymentInfoService;

    private final IternaryInfoService iternaryInfoService;

    public BookingService(BookingRepository bookingRepository, TravellerInfoService travellerInfoService, BillingInfoService billingInfoService, PaymentInfoService paymentInfoService, IternaryInfoService iternaryInfoService) {
        this.bookingRepository = bookingRepository;
        this.travellerInfoService = travellerInfoService;
        this.billingInfoService = billingInfoService;
        this.paymentInfoService = paymentInfoService;
        this.iternaryInfoService = iternaryInfoService;
    }


    /**
     * Saves a new booking with the provided details.
     * This method creates a new booking, updates related entities, and validates payment information.
     *
     * @param request   the booking request DTO containing all necessary information
     * @param bookingId the ID of the booking to be saved
     * @return the saved booking entity
     */
    @Transactional
    public Booking saveBooking(BookingRequestDTO request, Long bookingId) {
        Booking booking = Booking.builder().bookingId(bookingId).bookingEmail(request.getBillingInfo().getBillingEmail()).availabilities(request.getIternaryInfo().getAvailabilities().toArray(Long[]::new)).isCanceled(false).build();

        Booking savedBooking = bookingRepository.save(booking);
        log.info("booking saved \n" + savedBooking);


        // Updating native tables

        IternaryInfoRequestDTO iternaryInfoRequestDTO = request.getIternaryInfo();

        IternaryInfo iternaryInfo = IternaryInfo.builder().roomImage(iternaryInfoRequestDTO.getRoomImage()).checkInDate(iternaryInfoRequestDTO.getCheckInDate()).checkOutDate(iternaryInfoRequestDTO.getCheckOutDate()).packageName(iternaryInfoRequestDTO.getPromoName()).packageDescription(iternaryInfoRequestDTO.getPromoDescription()).roomName(iternaryInfoRequestDTO.getRoomName()).guestString(iternaryInfoRequestDTO.getGuestString()).nightlyRate(iternaryInfoRequestDTO.getNightlyRate()).subtotal(iternaryInfoRequestDTO.getSubtotal()).taxes(iternaryInfoRequestDTO.getTaxes()).vat(iternaryInfoRequestDTO.getVat()).total(iternaryInfoRequestDTO.getTotalCost()).booking(savedBooking).build();

        iternaryInfoService.save(iternaryInfo);

        TravellerInfo travellerInfo = TravellerInfo.builder().firstName(request.getTravellerInfo().getFirstName()).lastName(request.getTravellerInfo().getLastName()).phone(request.getTravellerInfo().getPhone()).email(request.getTravellerInfo().getEmail()).booking(savedBooking).build();
        travellerInfoService.saveTravellerInfo(travellerInfo);

        BillingInfo billingInfo = BillingInfo.builder().billingFirstName(request.getBillingInfo().getBillingFirstName()).billingLastName(request.getBillingInfo().getBillingLastName()).billingAddress1(request.getBillingInfo().getBillingAddress1()).billingAddress2(request.getBillingInfo().getBillingAddress2()).billingCountry(request.getBillingInfo().getBillingCountry()).billingCity(request.getBillingInfo().getBillingCity()).billingState(request.getBillingInfo().getBillingState()).billingZip(request.getBillingInfo().getBillingZip()).billingPhone(request.getBillingInfo().getBillingPhone()).billingEmail(request.getBillingInfo().getBillingEmail()).booking(savedBooking).build();
        billingInfoService.saveBillingInfo(billingInfo);


        PaymentInfoRequestDTO paymentInfoRequestDTO = request.getPaymentInfo();

        // validates card details and throws exceptions if something is wrong
        validateCardDetails(paymentInfoRequestDTO.getExpiryMonth(), paymentInfoRequestDTO.getExpiryYear());

        PaymentInfo paymentInfo = PaymentInfo.builder().cardNumber(paymentInfoRequestDTO.getCardNumber()).expiryMonth(paymentInfoRequestDTO.getExpiryMonth()).expiryYear(paymentInfoRequestDTO.getExpiryYear()).booking(savedBooking).build();
        paymentInfoService.savePaymentInfo(paymentInfo);

        return savedBooking;
    }

    /**
     * Retrieves booking details for a given email and booking ID.
     * This method validates the email and booking ID, and returns the booking details if valid.
     *
     * @param email     the email associated with the booking
     * @param bookingId the ID of the booking to retrieve
     * @return the booking response DTO containing all booking details
     * @throws UnprocessableEntityException if the email is invalid or the booking ID does not match the email
     */
    public BookingResponseDTO getBooking(String email, Long bookingId) {
        if (!isValidEmail(email)) {
            throw new UnprocessableEntityException("Provide a Valid email to receive bookings");
        }
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new UnprocessableEntityException("No bookings found with this booking id"));
        if (!booking.getBookingEmail().equals(email)) {
            throw new UnprocessableEntityException("email and booking id don't match ! please provide valid booking details");
        }

        PaymentInfo paymentInfo = paymentInfoService.getByBookingId(bookingId);
        BillingInfo billingInfo = billingInfoService.getByBookingId(bookingId);
        IternaryInfo iternaryInfo = iternaryInfoService.getByBookingId(bookingId);
        TravellerInfo travellerInfo = travellerInfoService.getByBookingId(bookingId);

        return BookingResponseDTO.builder().billingInfo(billingInfo).iternaryInfo(iternaryInfo).paymentInfo(paymentInfo).travellerInfo(travellerInfo).build();

    }

    public List<GetAllBookingsResponseDTO> getAllBookings(String email) {
        List<Booking> bookingList = bookingRepository.findAllByBookingEmail(email);
        List<GetAllBookingsResponseDTO> getAllBookingsResponseDTOS = new ArrayList<>();
        for (Booking booking : bookingList) {
            int availabilities = booking.getAvailabilities().length;
            IternaryInfo iternaryInfo = iternaryInfoService.getByBookingId(booking.getBookingId());
            LocalDate startDate = LocalDate.parse(iternaryInfo.getCheckInDate().substring(0, 10));
            LocalDate endDate = LocalDate.parse(iternaryInfo.getCheckOutDate().substring(0, 10));
            int numberOfDays = (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;
            long rooms = availabilities / numberOfDays;
            getAllBookingsResponseDTOS
                    .add(GetAllBookingsResponseDTO.builder()
                            .bookingId(booking.getBookingId())
                            .checkIn(iternaryInfo.getCheckInDate())
                            .checkOut(iternaryInfo.getCheckOutDate())
                            .status(!booking.isCanceled())
                            .rooms(rooms)
                            .roomName(iternaryInfo.getRoomName())
                            .email(email)
                            .build());
        }
        return getAllBookingsResponseDTOS;
    }
}
