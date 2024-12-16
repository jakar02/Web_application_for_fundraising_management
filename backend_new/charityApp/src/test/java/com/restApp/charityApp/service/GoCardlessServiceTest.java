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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GoCardlessServiceTest {

    @Mock
    private GoCardlessFetchDateRepository fetchDateRepository;

    @Mock
    private AccountDetailsRepository accountDetailsRepository;

    @Mock
    private UserCollectionRepository userCollectionRepository;

    @Mock
    private OkHttpClient client;

    @InjectMocks
    private GoCardlessService goCardlessService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void isFetchDateOlderThan6Hours_Test_moreThan6HoursTest() {
        LocalDateTime pastDate = LocalDateTime.now().minusHours(7);
        boolean result = goCardlessService.isFetchDateOlderThan6Hours(pastDate);

        assertTrue(result);
    }


    @Test
    void isFetchDateOlderThan6Hours_Test_lessThan6HoursTest() {
        LocalDateTime recentDate = LocalDateTime.now().minusHours(5);

        boolean result = goCardlessService.isFetchDateOlderThan6Hours(recentDate);

        assertFalse(result);
    }


    @Test
    void getLastFetchDate_Test_Exists() {
        GoCardlessFetchDate fetchDate = new GoCardlessFetchDate();
        fetchDate.setLastFetchDate(LocalDateTime.now().minusHours(10));
        when(fetchDateRepository.findById(1L)).thenReturn(Optional.of(fetchDate));
        LocalDateTime result = goCardlessService.getLastFetchDate();

        assertNotNull(result);
        assertEquals(fetchDate.getLastFetchDate(), result);
    }


    @Test
    void getLastFetchDate_Test_notExist() {
        when(fetchDateRepository.findById(1L)).thenReturn(Optional.empty());
        LocalDateTime result = goCardlessService.getLastFetchDate();

        assertNull(result);
    }


    @Test
    void updateGoCardlessFetchDate_Test() {
        GoCardlessFetchDate fetchDate = new GoCardlessFetchDate();
        fetchDate.setLastFetchDate(LocalDateTime.now().minusHours(10));
        when(fetchDateRepository.findById(1L)).thenReturn(Optional.of(fetchDate));
        goCardlessService.updateGoCardlessFetchDate(1L);

        verify(fetchDateRepository, times(1)).save(fetchDate);
    }


    @Test
    void updateAccountDetails_Test() {
        String transactionId = "123456";
        UserCollection userCollection = new UserCollection();
        userCollection.setId(1L);
        when(accountDetailsRepository.existsById(transactionId)).thenReturn(false);
        when(userCollectionRepository.findById(1L)).thenReturn(Optional.of(userCollection));
        goCardlessService.updateAccountDetails(transactionId, null, null, "50.00", "PLN", "Jakub Karas", "PL1234567890", "1");

        verify(accountDetailsRepository, times(1)).save(any(AccountDetails.class));
    }
}
