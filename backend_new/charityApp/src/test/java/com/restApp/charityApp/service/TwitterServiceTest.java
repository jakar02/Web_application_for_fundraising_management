package com.restApp.charityApp.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import org.mockito.Mockito;

import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

class TwitterServiceTest {

    private final TwitterService twitterService = new TwitterService();

    @Test
    void ExtractMediaId_ValidResponse_Test() {
        String jsonResponse = "{\"media_id_string\": \"1234567890\"}";

        String mediaId = twitterService.extractMediaId(jsonResponse);

        assertEquals("1234567890", mediaId);
    }

    @Test
    void ExtractMediaId_InvalidResponse_Test() {
        String jsonResponse = "{\"error\": \"Invalid request\"}";

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            twitterService.extractMediaId(jsonResponse);
        });

        assertEquals("The response does not contain a media_id_string", exception.getMessage());
    }

    @Test
    void WriteMultipartData_Test() throws IOException {
        byte[] fileData = "sampleData".getBytes();
        String boundary = "boundary";
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        twitterService.writeMultipartData(new DataOutputStream(outputStream), fileData, boundary);

        String result = outputStream.toString();
        assertTrue(result.contains("Content-Disposition: form-data; name=\"media\"; filename=\"file.jpg\""));
        assertTrue(result.contains("Content-Type: application/octet-stream"));
        assertTrue(result.contains("--boundary--"));
    }

    @Test
    void GenerateNonce_Test() {
        String nonce1 = TwitterService.generateNonce();
        String nonce2 = TwitterService.generateNonce();

        assertNotNull(nonce1);
        assertNotNull(nonce2);
        assertNotEquals(nonce1, nonce2);
        assertEquals(32, nonce1.length());
    }

    @Test
    void BuildOAuthHeader_Test() {
        Map<String, String> oauthParams = new HashMap<>();
        oauthParams.put("oauth_consumer_key", "key");
        oauthParams.put("oauth_token", "token");
        oauthParams.put("oauth_signature_method", "HMAC-SHA1");
        oauthParams.put("oauth_timestamp", "1234567890");
        oauthParams.put("oauth_nonce", "nonce");
        oauthParams.put("oauth_version", "1.0");

        String signature = "generated_signature";

        String oauthHeader = TwitterService.buildOAuthHeader(oauthParams, signature);

        assertTrue(oauthHeader.startsWith("OAuth "));
        assertTrue(oauthHeader.contains("oauth_consumer_key=\"key\""));
        assertTrue(oauthHeader.contains("oauth_token=\"token\""));
        assertTrue(oauthHeader.contains("oauth_signature=\"generated_signature\""));
    }


}
