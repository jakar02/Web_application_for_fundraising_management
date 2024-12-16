package com.restApp.charityApp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.restApp.charityApp.repository.AccountDetailsRepository;
import com.restApp.charityApp.repository.GoCardlessFetchDateRepository;
import com.restApp.charityApp.repository.UserCollectionRepository;
import com.restApp.charityApp.usermodel.AccountDetails;
import com.restApp.charityApp.usermodel.GoCardlessFetchDate;
import com.restApp.charityApp.usermodel.UserCollection;
import okhttp3.*;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import okhttp3.MediaType;
import okhttp3.RequestBody;

@Service
public class GoCardlessService {

    private static final String BASE_URL = "https://bankaccountdata.gocardless.com/api/v2/accounts/";
    private final UserCollectionRepository userCollectionRepository;
    String bearerTokenAccess;
    private final OkHttpClient client;
    private final GoCardlessFetchDateRepository fetchDateRepository;
    private final AccountDetailsRepository accountDetailsRepository;

    public GoCardlessService(GoCardlessFetchDateRepository fetchDateRepository, AccountDetailsRepository accountDetailsRepository, UserCollectionRepository userCollectionRepository) {
        this.accountDetailsRepository = accountDetailsRepository;
        this.client = new OkHttpClient();
        this.fetchDateRepository = fetchDateRepository;
        this.userCollectionRepository = userCollectionRepository;
    }

    public boolean isFetchDateOlderThan6Hours(LocalDateTime lastFetchDate) {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(lastFetchDate, now);
        //return duration.toMinutes() >= 1;
        return duration.toHours() >= 6;
    }

    public void getNewToken() {
        String url = "https://bankaccountdata.gocardless.com/api/v2/token/new/";
        String json = "{"
                + "\"secret_id\": \"1a5f2cb5-5b80-45f7-9bf3-a42ce32f76ad\","
                + "\"secret_key\": \"614f0b1296c51cd2002e709f811bfa0186a5e7c00701ac2d39df4e7559018b8c2a9f5786cd7ea7c22fc88fc35c6d878a85d397e23b7b24e251468dc5d91c46a7\""
                + "}";

        MediaType JSON = MediaType.get("application/json; charset=utf-8");
        RequestBody body = RequestBody.create(json, JSON);

        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("accept", "application/json")
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }

            String responseBody = response.body().string();
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode responseJson = objectMapper.readTree(responseBody);
            this.bearerTokenAccess = responseJson.get("access").asText();

            System.out.println(responseBody);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public LocalDateTime getLastFetchDate() {
        Optional<GoCardlessFetchDate> fetchedDateOpt = fetchDateRepository.findById(1L);
        return fetchedDateOpt.map(GoCardlessFetchDate::getLastFetchDate)
                .orElse(null);
    }

    public void updateGoCardlessFetchDate(Long id) {
        Optional<GoCardlessFetchDate> goCardlessFetchDateOpt = fetchDateRepository.findById(id);
        if (goCardlessFetchDateOpt.isPresent()) {
            GoCardlessFetchDate goCardlessFetchDate = goCardlessFetchDateOpt.get();
            goCardlessFetchDate.setLastFetchDate(LocalDateTime.now());
            fetchDateRepository.save(goCardlessFetchDate);
        } else {
            System.out.println("GoCardlessFetchDate with id " + id + " not found.");
        }
    }


    public void updateAccountDetails(String transactionId, LocalDate bookingDate, LocalDate valueDate, String amount, String currency, String debtorName, String iban, String remittanceInformation) {
        try {
            if (!accountDetailsRepository.existsById(transactionId)) {
                String cleanedText = remittanceInformation.replaceAll("[^a-zA-Z0-9]", "").replaceAll("\\s+", "");
                if (cleanedText.isEmpty()) {
                    System.out.println("cleanedText is empty after cleaning: " + remittanceInformation);
                    return;
                }
                if (!cleanedText.matches("\\d+")) {
                    System.out.println("Invalid number format for cleanedText: " + cleanedText);
                    return;
                }
                Optional<UserCollection> userCollectionOpt = userCollectionRepository.findById(Long.parseLong(cleanedText));

                if (userCollectionOpt.isPresent()) {
                    UserCollection userCollection = userCollectionOpt.get();
                    AccountDetails accountDetails = new AccountDetails();
                    accountDetails.setTransactionId(transactionId);
                    accountDetails.setUserCollection(userCollection);
                    accountDetails.setDebtorName(debtorName);
                    accountDetails.setIban(iban);
                    accountDetails.setTransactionCurrency(currency);
                    accountDetails.setTransactionAmount(amount);
                    accountDetails.setBookingDate(bookingDate);
                    accountDetails.setValueDate(valueDate);
                    accountDetails.setRemittanceInformationUnstructured(remittanceInformation);
                    accountDetailsRepository.save(accountDetails);
                } else {
                    System.out.println("UserCollection not found for ID: " + cleanedText);
                }
            }
            else{
                System.out.println("Account details already exist for Transaction ID: " + transactionId);
            }
        } catch (NumberFormatException e) {
            System.out.println("NumberFormatException during updateAccountDetails" + e.getMessage());
        }
        catch (Exception e){
            System.out.println("An unpexted error during updateAccountDetails");
        }
    }

    public void updateCollectedAmount(){
        List<AccountDetails> accountDetailsList = accountDetailsRepository.findAll();
        Map<Long, Double> mapOfIdCollectionsWithAmount = new HashMap<>();

        for (AccountDetails accountDetails : accountDetailsList) {
            Long collectionId = accountDetails.getUserCollection().getId();

            mapOfIdCollectionsWithAmount.put(collectionId,
                    mapOfIdCollectionsWithAmount.getOrDefault(collectionId, 0.0)
                            + Double.parseDouble(accountDetails.getTransactionAmount()));
        }

        for (Map.Entry<Long, Double> entry : mapOfIdCollectionsWithAmount.entrySet()) {
            Long collectionId = entry.getKey();
            Double totalAmount = entry.getValue();

            UserCollection userCollection = userCollectionRepository.findById(collectionId).orElse(null);

            if (userCollection != null) {
                userCollection.setCollectedAmount(totalAmount);
                userCollectionRepository.save(userCollection);
            }
        }
    }


    //tutaj pobieramy wszystkie z GoCardless, ale możemy tylko 4razy/dzień
    public String getAccountTransactions(String accountId) throws IOException {

        if (accountId == null || accountId.isEmpty()) {
            System.out.println("Account ID is null or empty");
            return null;
        }

        getNewToken();
        updateGoCardlessFetchDate(1L);

        String url = BASE_URL + accountId + "/transactions/";
        Request request = new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer " + bearerTokenAccess)
                .addHeader("accept", "application/json")
                .build();


        try (Response response = client.newCall(request).execute()) {
            System.out.println("Response Code: " + response.code());
            String responseBody = response.body().string();
            System.out.println("Response Body: " + responseBody);

            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }
            System.out.println("After getting response");

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseBody);
            JsonNode bookedTransactions = rootNode.path("transactions").path("booked");
            StringBuilder result = new StringBuilder();

            if (bookedTransactions.isArray()) {
                for (JsonNode transaction : bookedTransactions) {
                    String transactionId = transaction.path("transactionId").asText();
                    String bookingDateString = transaction.path("bookingDate").asText();
                    LocalDate bookingDate = LocalDate.parse(bookingDateString);
                    String valueDateString = transaction.path("valueDate").asText();
                    LocalDate valueDate = LocalDate.parse(valueDateString);
                    String amount = transaction.path("transactionAmount").path("amount").asText();
                    String currency = transaction.path("transactionAmount").path("currency").asText();
                    String debtorName = transaction.path("debtorName").asText();
                    String iban = transaction.path("debtorAccount").path("iban").asText();
                    String remittanceInformation = transaction.path("remittanceInformationUnstructured").asText();

                    result.append("Transaction ID: ").append(transactionId).append("\n")
                            .append("Booking Date: ").append(bookingDateString).append("\n")
                            .append("Value Date: ").append(valueDateString).append("\n")
                            .append("Amount: ").append(amount).append(" ").append(currency).append("\n")
                            .append("Debtor Name: ").append(debtorName).append("\n")
                            .append("IBAN: ").append(iban).append("\n")
                            .append("Remittance Info: ").append(remittanceInformation).append("\n")
                            .append("-------------------------------\n");

                    updateAccountDetails(transactionId, bookingDate, valueDate, amount, currency, debtorName, iban, remittanceInformation);
                }
            }
            updateCollectedAmount();

            return result.toString();
        }
    }
}
