package com.restApp.charityApp.service;

import com.restApp.charityApp.usermodel.UserCollectionImage;
import org.springframework.stereotype.Service;
import org.json.JSONObject;
import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;

@Service
public class TwitterService {

    private static final String CONSUMER_KEY = "qUihPHeWCPsbdyolkq9q3pWd6";
    private static final String CONSUMER_SECRET = "joDpimQRdyyA7w98vqbEb5OV3yw1WO5Tdti1YnufIxttitos4Q";
    private static final String ACCESS_TOKEN = "1742254697535156224-v8ifS9bRSVec2HLWlaUWn50KJy6Zvi";
    private static final String ACCESS_TOKEN_SECRET = "wYHH16rLRWo0HR08TmIjJn5O8ZicxtpF7uaKYSCci5ccM";

    public static String requestUrl = "https://api.twitter.com/2/tweets";


    public String uploadMedia(UserCollectionImage userCollectionImage) throws Exception {
        String mediaUploadUrl = "https://upload.twitter.com/1.1/media/upload.json";
        String mediaId;

        byte[] fileData = userCollectionImage.getImageData(); // Assume this method provides image bytes
        String boundary = "------------------------" + UUID.randomUUID().toString();
        HttpURLConnection connection = (HttpURLConnection) new URL(mediaUploadUrl).openConnection();

        connection.setRequestMethod("POST");
        connection.setRequestProperty("Authorization", generateOAuthHeaderForMedia(mediaUploadUrl));
        connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
        connection.setDoOutput(true);

        try (DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream())) {
            writeMultipartData(outputStream, fileData, boundary);
            outputStream.flush();
        }

        if (connection.getResponseCode() == 200) {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                String response = reader.lines().reduce("", (acc, line) -> acc + line);
                mediaId = extractMediaId(response);
            }
        } else {
            throw new IOException("Media upload failed with response code: " + connection.getResponseCode());
        }

        connection.disconnect();
        return mediaId;
    }

    public String generateOAuthHeaderForMedia(String requestUrl) throws Exception {
        Map<String, String> oauthParams = generateOAuthParams(); // Generate standard OAuth params
        String signature = generateOAuthSignature(requestUrl, "POST", oauthParams); // Generate signature
        return buildOAuthHeader(oauthParams, signature); // Build and return the header
    }



    public void writeMultipartData(DataOutputStream outputStream, byte[] fileData, String boundary) throws IOException {
        outputStream.writeBytes("--" + boundary + "\r\n");
        outputStream.writeBytes("Content-Disposition: form-data; name=\"media\"; filename=\"file.jpg\"\r\n");
        outputStream.writeBytes("Content-Type: application/octet-stream\r\n\r\n");
        outputStream.write(fileData);
        outputStream.writeBytes("\r\n--" + boundary + "--\r\n");
    }


    public String extractMediaId(String jsonResponse) {
        JSONObject jsonObject = new JSONObject(jsonResponse);
        if (jsonObject.has("media_id_string")) {
            String mediaId = jsonObject.getString("media_id_string");
            System.out.println("Extracted media ID: " + mediaId);
            return mediaId;
        } else {
            throw new IllegalArgumentException("The response does not contain a media_id_string");
        }
    }


    public static void sendTweetWithMedia(String body) throws IOException {
        String tweetUrl = "https://api.twitter.com/2/tweets";

        // Generate the OAuth parameters
        Map<String, String> oauthParams = generateOAuthParams();

        // Generate the OAuth signature
        String signature = null;
        try {
            signature = generateOAuthSignature(requestUrl, "POST", oauthParams);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        // Build the OAuth authorization header
        String oauthHeader = buildOAuthHeader(oauthParams, signature);

        System.out.println("oauthHeader: " + oauthHeader);
        URL url = new URL(requestUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Authorization", oauthHeader);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream());
        writer.write(body);
        writer.flush();

        int responseCode = connection.getResponseCode();
        System.out.println("Response code: " + responseCode);

        writer.close();
        connection.disconnect();
    }

    public static Map<String, String> generateOAuthParams() {
        Map<String, String> params = new HashMap<>();
        params.put("oauth_consumer_key", CONSUMER_KEY);
        params.put("oauth_token", ACCESS_TOKEN);
        params.put("oauth_signature_method", "HMAC-SHA1");
        params.put("oauth_timestamp", String.valueOf(System.currentTimeMillis() / 1000));
        params.put("oauth_nonce", generateNonce());
        params.put("oauth_version", "1.0");
        return params;
    }

    public static String generateOAuthSignature(String requestUrl, String requestMethod, Map<String, String> oauthParams) throws Exception {
        Map<String, String> allParams = new HashMap<>(oauthParams);

        String[] sortedKeys = allParams.keySet().toArray(new String[0]);
        Arrays.sort(sortedKeys);

        // Construct the parameter string
        StringBuilder paramBuilder = new StringBuilder();
        for (String key : sortedKeys) {
            if (paramBuilder.length() > 0) {
                paramBuilder.append("&");
            }
            paramBuilder.append(key).append("=").append(allParams.get(key));
        }
        String parameterString = paramBuilder.toString();

        String baseString = requestMethod + "&" + encode(requestUrl) + "&" + encode(parameterString);

        String signingKey = encode(CONSUMER_SECRET) + "&" + encode(ACCESS_TOKEN_SECRET);

        Mac mac = Mac.getInstance("HmacSHA1");
        SecretKey secretKey = new SecretKeySpec(signingKey.getBytes(), "HmacSHA1");
        mac.init(secretKey);
        byte[] baseStringBytes = baseString.getBytes("UTF-8");
        byte[] signatureBytes = mac.doFinal(baseStringBytes);
        String signature = new String(Base64.getEncoder().encode(signatureBytes));
        return signature;
    }

    public static String buildOAuthHeader(Map<String, String> oauthParams, String signature) {
        StringBuilder headerBuilder = new StringBuilder();
        headerBuilder.append("OAuth ");

        List<String> encodedParams = new ArrayList<>();

        encodedParams.add("oauth_consumer_key=\"" + encode(oauthParams.get("oauth_consumer_key")) + "\"");
        encodedParams.add("oauth_token=\"" + encode(oauthParams.get("oauth_token")) + "\"");
        encodedParams.add("oauth_signature_method=\"" + encode(oauthParams.get("oauth_signature_method")) + "\"");
        encodedParams.add("oauth_timestamp=\"" + encode(oauthParams.get("oauth_timestamp")) + "\"");
        encodedParams.add("oauth_nonce=\"" + encode(oauthParams.get("oauth_nonce")) + "\"");
        encodedParams.add("oauth_version=\"" + encode(oauthParams.get("oauth_version")) + "\"");
        encodedParams.add("oauth_signature=\"" + encode(signature) + "\"");

        String header = String.join(", ", encodedParams);
        headerBuilder.append(header);

        return headerBuilder.toString();
    }

    public static String encode(String value) {
        try {
            return URLEncoder.encode(value, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to encode parameter: " + value, e);
        }
    }

    public static String generateNonce() {
        String characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random rand = new Random();
        StringBuilder nonceBuilder = new StringBuilder();
        for (int i = 0; i < 32; i++) {
            nonceBuilder.append(characters.charAt(rand.nextInt(characters.length())));
        }
        return nonceBuilder.toString();
    }
}


