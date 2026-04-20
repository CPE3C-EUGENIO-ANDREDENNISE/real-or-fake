/* CONTROLLERS/AUTHCONTROLLER.JS - USER AUTHENTICATION LOGIC */

import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config.js';

// POST /api/auth/register - Register new user
export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'username, email, and password are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'invalid email format' });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ error: 'password must be at least 8 characters' });
        }

        // Check if user already exists
        const existingUser = await User.findByUsernameOrEmail(username, email);
        if (existingUser) {
            return res.status(409).json({ error: 'username or email already exists' });
        }

        // Hash password with argon2
        const hashedPassword = await argon2.hash(password);

        // Create user in database
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'user'
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'user registered successfully',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (err) {
        console.error('Register error:', err.message);
        res.status(500).json({ error: 'registration failed' });
    }
}

// POST /api/auth/login - Login user
export async function login(req, res) {
    try {
        const { email, password, mfaCode } = req.body;
        let user;
        let token;

        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }

        // Normalize email for case-insensitive lookup
        const normalizedEmail = email.toLowerCase();

        // Find user
        user = await User.findByEmail(normalizedEmail);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Verify password with argon2
        const isValidPassword = await argon2.verify(user.password, password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // If 2FA is enabled, require code
        if (user.two_factor_enabled && !mfaCode) {
            return res.status(403).json({ error: '2FA required' });
        }

        if (user.two_factor_enabled && mfaCode) {
            // Verify 2FA code
            const is2faValid = await argon2.verify(user.two_factor_secret, mfaCode);
            if (!is2faValid) {
                return res.status(403).json({ error: 'Invalid 2FA code' });
            }
        }

        // Generate JWT token
        token = jwt.sign(
            { id: user.id, username: user.username, email: user.email, role: user.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        );

        res.json({
            message: 'login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err.message, err.stack);
        return res.status(500).json({
            error: 'login failed',
            devError: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

// POST /api/auth/logout - Logout user (client-side token invalidation)
export async function logout(req, res) {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            
            // Decode the token to get user info for logging
            try {
                const decoded = jwt.verify(token, config.JWT_SECRET);
                console.log(`User ${decoded.username} logged out at ${new Date().toISOString()}`);
                
                // In a production system, you could add the token to a blacklist here
                // to prevent reuse before expiration. For now, the client will discard it.
            } catch (err) {
                // Token might be expired or invalid, still allow logout
                console.log('Logout with invalid/expired token - client will still clear it');
            }
        }
        
        res.json({ message: 'logout successful' });
    } catch (err) {
        console.error('Logout error:', err.message);
        res.status(500).json({ error: 'logout failed' });
    }
}

// POST /api/auth/setup-2fa - Enable 2FA for user
export async function setup2fa(req, res) {
    try {
        const { email, code } = req.body;
        
        if (!email || !code) {
            return res.status(400).json({ error: 'email and code are required' });
        }
        
        // 1. Find user by email (to ensure user exists)
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // --- MOCK TOTP GENERATION (Requires external library in real-world scenario) ---
        // For demonstration, we mock the secret and assume we used a library to verify the code.
        const mockSecret = 'MOCK_SECRET_KEY_FOR_2FA_SETUP'; 
        const isCodeValid = await argon2.verify(mockSecret, code); // This is just for flow completion

        if (!isCodeValid) {
            return res.status(403).json({ error: 'Invalid verification code provided' });
        }
        // --- END MOCK ---

        // 2. Update user with the new secret and enable 2FA
        const success = await User.updateTwoFactor(user.id, mockSecret, true);

        if (!success) {
            return res.status(500).json({ error: 'Failed to update 2FA settings' });
        }

        // 3. Return the necessary info for the client to save the secret (QR code)
        res.json({ 
            message: '2FA successfully enabled', 
            secret: mockSecret 
        });

    } catch (err) {
        console.error('2FA setup error:', err.message);
        res.status(500).json({ error: '2FA setup failed' });
    }
}

