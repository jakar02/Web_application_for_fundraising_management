package com.restApp.charityApp.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class QrCodeService {

    public String generateQrCode(String name, String ibanWithoutPL, double amount, String unstructuredReference, String information) throws Exception {

        if(ibanWithoutPL.length() != 26){
            System.out.println("iban length: " + ibanWithoutPL.length());
            throw new Exception();
        }

        String qrContent = String.format(
                "||%s|%s|%s|%s||%s|%s",
                ibanWithoutPL,
                (int)(amount*100),
                name.toUpperCase(),
                unstructuredReference,
                "INV-08A",
                "PLN"
        );

        QRCodeWriter qrCodeWriter = new QRCodeWriter();

        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

        try {
            BitMatrix bitMatrix = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, 300, 300, hints);
            BufferedImage qrImage = new BufferedImage(300, 300, BufferedImage.TYPE_INT_RGB);

            for (int x = 0; x < 300; x++) {
                for (int y = 0; y < 300; y++) {
                    qrImage.setRGB(x, y, bitMatrix.get(x, y) ? 0x000000 : 0xFFFFFF);
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(qrImage, "png", baos);
            byte[] qrCodeBytes = baos.toByteArray();

            String base64QrCode = Base64.getEncoder().encodeToString(qrCodeBytes);

            return base64QrCode;
        }
        catch (WriterException | IOException e) {
            System.out.println("Error generating QR code: " + e.getMessage());
        }
        return "";
    }

}
