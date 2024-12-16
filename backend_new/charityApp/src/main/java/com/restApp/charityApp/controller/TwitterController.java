package com.restApp.charityApp.controller;

import com.restApp.charityApp.service.TwitterService;
import com.restApp.charityApp.service.UserCollectionService;
import com.restApp.charityApp.usermodel.UserCollection;
import com.restApp.charityApp.usermodel.UserCollectionImage;
import org.hibernate.sql.results.graph.collection.CollectionLoadingLogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("auth/api/twitter")
public class TwitterController {

    @Autowired
    private TwitterService twitterService;

    @Autowired
    private UserCollectionService userCollectionService;

    @PostMapping("/tweet")
    public ResponseEntity<String> postTweet(@RequestParam Long id) {
        try {
            UserCollection userCollection = userCollectionService.getCollectionById(id);
            if (userCollection.getPostedOnTwitter().equals(true)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Tweet already posted");
            }
            UserCollectionImage userCollectionImage = userCollection.getImages().get(0);
            Long media_id = Long.parseLong(twitterService.uploadMedia(userCollectionImage));
            String link = "http://localhost:5173/CollectionDetails/" + id; //userCollection.getCollectionGoal() + "!\n"
            String jsonBody = "{\"text\":\"" + "Wspieraj zbiórkę '" + userCollection.getCollectionGoal() +"' pod linkiem " + link +"\",\"media\":{\"media_ids\":[\"" + media_id + "\"]}}";
            TwitterService.sendTweetWithMedia(jsonBody);
            userCollection.setPostedOnTwitter(true);
            userCollectionService.updateUserCollection(userCollection);
            return ResponseEntity.ok("Tweet posted");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to post tweet: " + e.getMessage());
        }
    }
}

