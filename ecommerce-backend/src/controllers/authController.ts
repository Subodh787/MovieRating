import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import database from '../models/database';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password, firstName, lastName } = req.body;
    const db = database.getDb();

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (row) {
        res.status(400).json({ error: 'User already exists' });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      db.run(
        'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, firstName, lastName],
        function (err) {
          if (err) {
            res.status(500).json({ error: 'Failed to create user' });
            return;
          }

          // Generate JWT token
          const token = jwt.sign(
            { id: this.lastID, email, role: 'customer' },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
          );

          res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
              id: this.lastID,
              email,
              firstName,
              lastName,
              role: 'customer'
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    const db = database.getDb();

    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user: any) => {
        if (err) {
          res.status(500).json({ error: 'Database error' });
          return;
        }

        if (!user) {
          res.status(401).json({ error: 'Invalid credentials' });
          return;
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          res.status(401).json({ error: 'Invalid credentials' });
          return;
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET as string,
          { expiresIn: '7d' }
        );

        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProfile = (req: Request, res: Response): void => {
  const user = (req as any).user;
  const db = database.getDb();

  db.get(
    'SELECT id, email, first_name, last_name, role, created_at FROM users WHERE id = ?',
    [user.id],
    (err, userData: any) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (!userData) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: userData.role,
          createdAt: userData.created_at
        }
      });
    }
  );
};