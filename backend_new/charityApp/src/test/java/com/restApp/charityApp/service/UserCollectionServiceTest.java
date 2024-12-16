package com.restApp.charityApp.service;

import com.restApp.charityApp.repository.UserCollectionImageRepository;
import com.restApp.charityApp.repository.UserCollectionRepository;
import com.restApp.charityApp.repository.UserRepository;
import com.restApp.charityApp.usermodel.User;
import com.restApp.charityApp.usermodel.UserCollection;
import com.restApp.charityApp.usermodel.UserCollectionImage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static java.lang.String.valueOf;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserCollectionServiceTest {

    @Mock
    private UserCollectionRepository userCollectionRepository;

    @Mock
    private UserCollectionImageRepository userCollectionImageRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserCollectionService userCollectionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createUserCollection_Test() throws IOException {
        User user = new User();
        user.setEmail("jakub@gmail.com");
        when(userRepository.findByEmail("jakub@gmail.com")).thenReturn(user);
        UserCollection userCollection = new UserCollection();
        MultipartFile imageFile = mock(MultipartFile.class);
        when(imageFile.getBytes()).thenReturn("sampleImageData".getBytes());
        when(imageFile.getOriginalFilename()).thenReturn("image.jpg");
        List<MultipartFile> images = Collections.singletonList(imageFile);
        when(userCollectionRepository.save(any(UserCollection.class))).thenReturn(userCollection);
        UserCollection savedCollection = userCollectionService.createUserCollection(userCollection, images, "jakub@gmail.com");

        assertNotNull(savedCollection);
        verify(userCollectionRepository, times(1)).save(userCollection);
        verify(userCollectionImageRepository, times(1)).saveAll(anyList());
    }

    @Test
    void createUserCollection_Test_InvalidUserError() {
        when(userRepository.findByEmail("invalid@example.com")).thenReturn(null);
        UserCollection userCollection = new UserCollection();
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userCollectionService.createUserCollection(userCollection, Collections.emptyList(), "invalid@example.com");
        });

        assertEquals("User not found with this email: invalid@example.com", exception.getMessage());
        verify(userCollectionRepository, never()).save(any(UserCollection.class));
    }


    @Test
    void getAllCollections_Test() {
        UserCollection collection1 = new UserCollection();
        UserCollection collection2 = new UserCollection();
        List<UserCollection> collections = Arrays.asList(collection1, collection2);
        when(userCollectionRepository.findAll()).thenReturn(collections);
        List<UserCollection> result = userCollectionService.getAllCollections();

        assertEquals(2, result.size());
        verify(userCollectionRepository, times(1)).findAll();
    }


    @Test
    void getUserCollections_Test() {
        User user = new User();
        user.setId(1L);
        UserCollection collection = new UserCollection();
        List<UserCollection> collections = Collections.singletonList(collection);
        when(userCollectionRepository.findByUser(user)).thenReturn(collections);
        List<UserCollection> result = userCollectionService.getUserCollections(user);

        assertEquals(1, result.size());
        verify(userCollectionRepository, times(1)).findByUser(user);
    }


    @Test
    void getUserCollection_Test() {
        UserCollection collection = new UserCollection();
        collection.setId(1L);
        when(userCollectionRepository.getReferenceById(1L)).thenReturn(collection);
        UserCollection result = userCollectionService.getUserCollection(new User(), 1L);

        assertEquals(1L, result.getId());
        verify(userCollectionRepository, times(1)).getReferenceById(1L);
    }


    @Test
    void updateUserCollection_Test() {
        UserCollection collection = new UserCollection();
        collection.setId(1L);
        userCollectionService.updateUserCollection(collection);

        verify(userCollectionRepository, times(1)).save(collection);
    }


    @Test
    void getCollectionById_Test() {
        UserCollection collection = new UserCollection();
        collection.setId(1L);
        when(userCollectionRepository.findById(1L)).thenReturn(Optional.of(collection));
        UserCollection result = userCollectionService.getCollectionById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(userCollectionRepository, times(1)).findById(1L);
    }

    @Test
    void getCollectionById_Test_ifNotExists() {
        when(userCollectionRepository.findById(1L)).thenReturn(Optional.empty());

        UserCollection result = userCollectionService.getCollectionById(1L);

        assertNull(result);
        verify(userCollectionRepository, times(1)).findById(1L);
    }
}
