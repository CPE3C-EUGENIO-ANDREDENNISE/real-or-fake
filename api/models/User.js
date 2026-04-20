/* MODELS/USER.JS - USER DATABASE OPERATIONS */

import pool from '../dbconfig.js';

export default class User {
    // Find user by ID
    static async findById(id) {
        const [users] = await pool.query(
            'SELECT id, username, email, role, created_at FROM user WHERE id = ?',
            [id]
        );
        return users[0] || null;
    }

    // Find user by email
    static async findByEmail(email) {
        const [users] = await pool.query(
            'SELECT id, username, email, password, role, two_factor_secret, two_factor_enabled FROM user WHERE email = ?',
            [email]
        );
        return users[0] || null;
    }

    // Find user by username or email (for registration check)
    static async findByUsernameOrEmail(username, email) {
        const [users] = await pool.query(
            'SELECT id, username, email, two_factor_secret, two_factor_enabled FROM user WHERE username = ? OR email = ?',
            [username, email]
        );
        return users[0] || null;
    }

    // Create new user
    static async create({ username, email, password, role = 'user', two_factor_secret = null, two_factor_enabled = false }) {
        const [result] = await pool.query(
            'INSERT INTO user (username, email, password, role, two_factor_secret, two_factor_enabled) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, password, role, two_factor_secret, two_factor_enabled]
        );
        return {
            id: result.insertId,
            username,
            email,
            role,
            two_factor_secret: two_factor_secret,
            two_factor_enabled: two_factor_enabled
        };
    }

    // Update 2FA details for a user
    static async updateTwoFactor(userId, secret, enabled) {
        const [result] = await pool.query(
            'UPDATE user SET two_factor_secret = ?, two_factor_enabled = ? WHERE id = ?',
            [secret, enabled, userId]
        );
        return result.affectedRows > 0;
    }
}