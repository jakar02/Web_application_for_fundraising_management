package com.restApp.charityApp.service;

import com.restApp.charityApp.repository.UserCollectionRepository;
import com.restApp.charityApp.repository.UserRepository;
import com.restApp.charityApp.usermodel.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceImplementationTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserCollectionRepository userCollectionRepository;

    @InjectMocks
    private UserServiceImplementation userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void loadUserByUsername_Test_ifExists() {
        String email = "jakub@gmail.com";
        User user = new User();
        user.setEmail(email);
        user.setPassword("maslo");
        when(userRepository.findByEmail(email)).thenReturn(user);
        var userDetails = userService.loadUserByUsername(email);

        assertNotNull(userDetails);
        assertEquals(email, userDetails.getUsername());
    }

    @Test
    void loadUserByUsername_Test_NotFound() {
        String email = "jakub@gmail.com";
        when(userRepository.findByEmail(email)).thenReturn(null);

        assertThrows(UsernameNotFoundException.class, () -> userService.loadUserByUsername(email));
    }


    @Test
    void findUserById_Test_ifUserExists() {
        long userId = 1L;
        User user = new User();
        user.setId(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        User result = userService.findUserById(String.valueOf(userId));

        assertNotNull(result);
        assertEquals(userId, result.getId());
    }

    @Test
    void findUserById_Test_notFound() {
        when(userRepository.findById(997L)).thenReturn(Optional.empty());
        User result = userService.findUserById(String.valueOf(997L));

        assertNull(result);
    }

}
