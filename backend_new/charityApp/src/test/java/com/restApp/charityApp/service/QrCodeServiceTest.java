package com.restApp.charityApp.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class QrCodeServiceTest {

    private QrCodeService qrCodeService;

    @BeforeEach
    void setUp() {
        qrCodeService = new QrCodeService();
    }

    @Test
    void generateQrCode_Test() throws Exception {
        String name = "Jakub Kowalski";
        String ibanWithoutPL = "12345678901234567890123456";
        double amount = 50.0;
        String unstructuredReference = "20";
        String information = "";

        String result = qrCodeService.generateQrCode(name, ibanWithoutPL, amount, unstructuredReference, information);

        assertNotNull(result);
        assertTrue(result.startsWith("iVBORw0KGgo"), "QR code should be Base64 png image.");
    }

    @Test
    void generateQrCode_Test_ibanTooShort() {
        String name = "Jakub Kowalski";
        String invalidIban = "123";
        double amount = 50.0;
        String unstructuredReference = "25";
        String information = "";

        assertThrows(Exception.class, () -> {
            qrCodeService.generateQrCode(name, invalidIban, amount, unstructuredReference, information);
        });
    }
}