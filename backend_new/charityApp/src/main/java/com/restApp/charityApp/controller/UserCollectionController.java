package com.restApp.charityApp.controller;

import com.restApp.charityApp.repository.UserRepository;
import com.restApp.charityApp.service.UserCollectionService;
import com.restApp.charityApp.usermodel.User;
import com.restApp.charityApp.usermodel.UserCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
public class UserCollectionController {

    private static final Logger logger = LoggerFactory.getLogger(UserCollectionController.class);

    @Autowired
    private UserCollectionService userCollectionService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/auth/api/update_user_collections")
    public ResponseEntity<UserCollection> updateUserCollection(
            @RequestPart("collection") UserCollection newUserCollection,
            @RequestPart("images") List<MultipartFile> images) {

        User user = newUserCollection.getUser();
        UserCollection userCollectionFromDb = userCollectionService.getUserCollection(user, newUserCollection.getId());

        try {
            userCollectionService.updateUserCollection(newUserCollection, userCollectionFromDb, images);
            return ResponseEntity.ok(userCollectionFromDb);
        } catch (Exception e) {
            logger.error("Error updating UserCollection with ID {}: {}", newUserCollection.getId(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PostMapping("/auth/api/user_collections")
    public ResponseEntity<UserCollection> UserCollection(
            @RequestPart("collection") UserCollection userCollection,
            @RequestPart("images") List<MultipartFile> images,
            Principal principal) {
        try {
            UserCollection createdCollection = userCollectionService.createUserCollection(userCollection, images, principal.getName());
            return ResponseEntity.ok(createdCollection);
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }


    @GetMapping("/all_active_collections")
    public ResponseEntity<List<UserCollection>> getAllActiveCollections() {
        List<UserCollection> collections = userCollectionService.getAllCollections();

        List<UserCollection> activeCollections = new ArrayList<>();
        for (UserCollection collection : collections) {
            if (collection.isActive()) {
                activeCollections.add(collection);
            }
        }
        Collections.reverse(activeCollections);
        return ResponseEntity.ok(activeCollections);
    }

    @GetMapping("/auth/api/all_collections")
    public ResponseEntity<List<UserCollection>> getAllCollections(Principal principal) {
        User user = userRepository.findByEmail(principal.getName());
        if(!user.getRole().equals("ROLE_ADMIN")){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<UserCollection> collections = userCollectionService.getAllCollections();
        return ResponseEntity.ok(collections);
    }


    @GetMapping("/auth/api/user_collections")
    public ResponseEntity<List<UserCollection>> getUserCollections(Principal principal) {
        User user = userRepository.findByEmail(principal.getName());
        List<UserCollection> userCollections = userCollectionService.getUserCollections(user);
        Collections.reverse(userCollections);
        return ResponseEntity.ok(userCollections);
    }


    @PostMapping("/auth/api/user_collection_end")
    public ResponseEntity<Boolean> endUserCollection( @RequestParam Long id, Principal principal) {
        User user = userRepository.findByEmail(principal.getName());
        UserCollection userCollection = userCollectionService.getUserCollection(user, id);
        if (userCollection != null) {
            userCollection.setActive(false);
            userCollectionService.updateUserCollection(userCollection);
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(404).body(false);
        }
    }

    @PostMapping("/auth/api/user_collections_update_active")
    public ResponseEntity<Boolean> updateActive( @RequestParam Long id, @RequestParam Boolean newState) {
        UserCollection userCollection = userCollectionService.getCollectionById(id);
        if (userCollection != null) {
            userCollection.setActive(newState);
            userCollectionService.updateUserCollection(userCollection);
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(404).body(false);
        }
    }


    @GetMapping("/user_FullName")
    public ResponseEntity<String> getCollectionCreator(@RequestParam Long id) {
        UserCollection userCollection = userCollectionService.getCollectionById(id);
        User user = userCollection.getUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(user.getFullName());
    }

    @GetMapping("/collection")
    public ResponseEntity<UserCollection> getCollection(@RequestParam Long id) {
        UserCollection userCollection = userCollectionService.getCollectionById(id);
        if (userCollection == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(userCollection);
    }


    @PostMapping("/auth/api/update_transferred")
    public ResponseEntity<UserCollection> updateTransferred(@RequestParam Long id, @RequestParam Boolean newState) {
        UserCollection userCollection = userCollectionService.getCollectionById(id);
        userCollection.setTransferred(newState);
        userCollectionService.updateUserCollection(userCollection);
        return ResponseEntity.ok(userCollection);
    }

}

