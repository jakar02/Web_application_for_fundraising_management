package com.restApp.charityApp.controller;

import com.restApp.charityApp.service.QrCodeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.View;

@RestController
public class QrCodeController {

    private final View error;
    private QrCodeService qrCodeService;

    public QrCodeController(View error) {
        this.error = error;
    }

    @GetMapping("/generate-qr")
    public ResponseEntity<String> generateQrCode(
            @RequestParam String name,
            @RequestParam String ibanWithoutPL,
            @RequestParam double amount,
            @RequestParam String unstructuredReference,
            @RequestParam String information) throws Exception {

        qrCodeService = new QrCodeService();
        String base64QrCode =  qrCodeService.generateQrCode(name, ibanWithoutPL, amount, unstructuredReference, information);

        try{
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "image/png");
            headers.add("Content-Disposition", "inline; filename=qr.png");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body("data:image/png;base64," + base64QrCode);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating QR code: " + e.getMessage());
        }
    }
}
