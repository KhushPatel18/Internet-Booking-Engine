package com.kdu.ibe.service;

import com.azure.communication.email.EmailClient;
import com.azure.communication.email.EmailClientBuilder;
import com.azure.communication.email.models.EmailAddress;
import com.azure.communication.email.models.EmailMessage;
import com.azure.communication.email.models.EmailSendResult;
import com.azure.core.util.polling.LongRunningOperationStatus;
import com.azure.core.util.polling.PollResponse;
import com.azure.core.util.polling.SyncPoller;
import com.kdu.ibe.dto.request.BookingIdAndEmailDTO;
import com.kdu.ibe.dto.response.PromoEmailResponseDTO;
import com.kdu.ibe.entity.Feedback;
import com.kdu.ibe.entity.PromotionTemplate;
import com.kdu.ibe.entity.Subscriber;
import com.kdu.ibe.repository.IternaryInfoRepository;
import com.kdu.ibe.repository.PromotionTemplateRepository;
import com.kdu.ibe.util.EmailTemplats;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;


/**
 * Service class for sending emails using Azure Communication Services.
 * This class provides methods to send different types of emails such as feedback submission, OTP for booking cancellation, and booking confirmation.
 */
@Service
@Slf4j
public class EmailService {


    private final FeedbackService feedbackService;
    private final IternaryInfoRepository iternaryInfoRepository;

    private final IternaryInfoService iternaryInfoService;
    private final SubscriberService subscriberService;
    private final PromotionTemplateRepository promotionTemplateRepository;
    private static final int THREAD_POOL_SIZE = 10;
    private ExecutorService executorService;
    @Value("${emailServiceConnectionString}")
    private String emailServiceConnectionString;

    public EmailService(FeedbackService feedbackService, IternaryInfoRepository iternaryInfoRepository, IternaryInfoService iternaryInfoService, SubscriberService subscriberService, PromotionTemplateRepository promotionTemplateRepository) {
        this.feedbackService = feedbackService;
        this.iternaryInfoRepository = iternaryInfoRepository;
        this.iternaryInfoService = iternaryInfoService;
        this.subscriberService = subscriberService;
        this.promotionTemplateRepository = promotionTemplateRepository;
    }

    /**
     * Sends an email for feedback submission.
     *
     * @param emailAddress the recipient's email address
     * @param type         the type of email (e.g., feedback submission)
     * @param customerName the name of the customer
     * @param companyName  the name of the company
     * @return the status of the long-running operation for sending the email
     */
    public LongRunningOperationStatus sendStayCompletionEmail(String emailAddress, String type, String customerName, String companyName, String roomName) {
        String connectionString = emailServiceConnectionString;
        EmailClient emailClient = new EmailClientBuilder().connectionString(connectionString).buildClient();

        EmailAddress toAddress = new EmailAddress(emailAddress);
        Feedback feedbackGenerated = new Feedback();
        feedbackGenerated.setName(customerName);
        feedbackGenerated.setSubmitted(false);
        Feedback feedback = feedbackService.submitFeedback(feedbackGenerated);
        String htmlBody = EmailTemplats.stayCompletion(customerName, customerName, feedback.getFeedbackId(), roomName);
        EmailMessage emailMessage = new EmailMessage().setSenderAddress("DoNotReply@fafe3380-9b21-419d-aa0e-cc13bc8a077b.azurecomm.net").setToRecipients(toAddress).setSubject(companyName + ": " + type)
                .setBodyPlainText("Stay Completion Mail")
                .setBodyHtml(htmlBody);

        SyncPoller<EmailSendResult, EmailSendResult> poller2 = emailClient.beginSend(emailMessage, null);
        PollResponse<EmailSendResult> result = poller2.waitForCompletion();
        return result.getStatus();
    }

    /**
     * Sends an email with an OTP for booking cancellation.
     *
     * @param emailAddress the recipient's email address
     * @param type         the type of email (e.g., OTP for booking cancellation)
     * @param customerName the name of the customer
     * @param companyName  the name of the company
     * @param bookingId    the ID of the booking
     * @param otp          the OTP for the booking cancellation
     * @return the status of the long-running operation for sending the email
     */
    public LongRunningOperationStatus sendEmail(String emailAddress, String type, String customerName, String companyName, Long bookingId, String otp) {
        String connectionString = emailServiceConnectionString;
        EmailClient emailClient = new EmailClientBuilder().connectionString(connectionString).buildClient();
        EmailAddress toAddress = new EmailAddress(emailAddress);
        String htmlBody = EmailTemplats.otpMail(customerName, companyName, otp, bookingId);
        EmailMessage emailMessage = new EmailMessage().setSenderAddress("DoNotReply@fafe3380-9b21-419d-aa0e-cc13bc8a077b.azurecomm.net").setToRecipients(toAddress).setSubject(companyName + ": " + type)
                .setBodyPlainText("OTP For Cancel Booking request")
                .setBodyHtml(htmlBody);
        SyncPoller<EmailSendResult, EmailSendResult> poller2 = emailClient.beginSend(emailMessage, null);
        PollResponse<EmailSendResult> result = poller2.waitForCompletion();

        return result.getStatus();
    }

    /**
     * Sends an email for booking confirmation.
     *
     * @param emailAddress the recipient's email address
     * @param type         the type of email (e.g., booking confirmation)
     * @param customerName the name of the customer
     * @param companyName  the name of the company
     * @param bookingId    the ID of the booking
     * @return the status of the long-running operation for sending the email
     */
    public LongRunningOperationStatus sendEmail(String emailAddress, String type, String customerName, String companyName, Long bookingId) {
        String connectionString = emailServiceConnectionString;
        EmailClient emailClient = new EmailClientBuilder().connectionString(connectionString).buildClient();
        EmailAddress toAddress = new EmailAddress(emailAddress);
        String htmlBody = EmailTemplats.bookingConformation(customerName, companyName, bookingId, emailAddress);
        EmailMessage emailMessage = new EmailMessage().setSenderAddress("DoNotReply@fafe3380-9b21-419d-aa0e-cc13bc8a077b.azurecomm.net").setToRecipients(toAddress).setSubject(companyName + ": " + type)
                .setBodyPlainText("Booking Confirmation")
                .setBodyHtml(htmlBody);
        SyncPoller<EmailSendResult, EmailSendResult> poller2 = emailClient.beginSend(emailMessage, null);
        PollResponse<EmailSendResult> result = poller2.waitForCompletion();

        return result.getStatus();
    }

    public LongRunningOperationStatus sendEmail(String emailAddress, String type, String html) {
        String connectionString = emailServiceConnectionString;
        EmailClient emailClient = new EmailClientBuilder().connectionString(connectionString).buildClient();
        EmailAddress toAddress = new EmailAddress(emailAddress);
        EmailMessage emailMessage = new EmailMessage().setSenderAddress("DoNotReply@fafe3380-9b21-419d-aa0e-cc13bc8a077b.azurecomm.net").setToRecipients(toAddress).setSubject("Team 18 Hotels" + ": " + type)
                .setBodyPlainText("Booking Confirmation")
                .setBodyHtml(html);
        SyncPoller<EmailSendResult, EmailSendResult> poller2 = emailClient.beginSend(emailMessage, null);
        PollResponse<EmailSendResult> result = poller2.waitForCompletion();
        return result.getStatus();
    }


    public void sendConfirmationMail(String recipientEmail, String subject, String firstName, String sender, Long bookingId) {
        try {
            sendEmail(recipientEmail, subject, firstName, sender, bookingId);
        } catch (Exception e) {
            // Handle any exceptions or log them
            log.info("failed to send mail " + e);
        }
    }

    @Scheduled(cron = "0 10 2 * * *") // Runs daily at 2:00 AM
    public void sendDailyEmail() {
        // Get user emails from the database
        List<BookingIdAndEmailDTO> bookingIdAndEmailDTOS = iternaryInfoRepository.getBookingIdAndEmailsForCheckOutToday();

        // Send emails to each user
        for (BookingIdAndEmailDTO bookingIdAndEmailDTO : bookingIdAndEmailDTOS) {
            String roomName = iternaryInfoService.getByBookingId(bookingIdAndEmailDTO.getBookingId()).getRoomName();
            log.info("sending mail to ..." + bookingIdAndEmailDTO.getBookingEmail());
            log.info(sendStayCompletionEmail(bookingIdAndEmailDTO.getBookingEmail(), "Stay Completion", "Khush Patel", "Kickdrum", roomName) + " " + bookingIdAndEmailDTO.getBookingEmail());
        }
    }

    public PromoEmailResponseDTO sendPromotionalMails(String htmlTemplate) {
        List<String> subscribers = subscriberService.getAllSubscriberEmails();
        promotionTemplateRepository.save(PromotionTemplate.builder().htmlTemplate(htmlTemplate).build());

        executorService = Executors.newFixedThreadPool(THREAD_POOL_SIZE);
        List<Future<LongRunningOperationStatus>> futures = new ArrayList<>();
        for (String subscriber : subscribers) {
            Future<LongRunningOperationStatus> future = executorService.submit(() -> sendEmail(subscriber, "Promotional Email", htmlTemplate));
            futures.add(future);
        }
        Long successfulEmails = 0L;
        Long failedEmails = 0L;
        List<String> notFailedEmailAddresses = new ArrayList<>();

        for (Future<LongRunningOperationStatus> future : futures) {
            try {
                LongRunningOperationStatus result = future.get();
                if (result.toString().equals("SUCCESSFULLY_COMPLETED")) {
                    successfulEmails++;
                } else {
                    failedEmails++;
                    notFailedEmailAddresses.add(subscribers.get(futures.indexOf(future)));
                }
            } catch (InterruptedException | ExecutionException e) {
                failedEmails++;
                notFailedEmailAddresses.add(subscribers.get(futures.indexOf(future)));
            }
        }
        log.info("successful email sends " + successfulEmails);
        log.info("unsuccessful email sends " + failedEmails);
        executorService.shutdown();
        return PromoEmailResponseDTO.builder().success(successfulEmails).subCount((long) subscribers.size()).failedEmails(notFailedEmailAddresses).build();
    }
}
