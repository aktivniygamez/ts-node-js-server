import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import UserModel from '../models/User';
import { Controller, Get, Post, Req, Res } from 'routing-controllers';
import 'reflect-metadata';
import logger from '../utils/logger';
import mongoose from 'mongoose';

// Interfaces
interface IAuthRequest extends Request {
  userId?: string
}

@Controller()
export class UserController {
  @Post('/auth/register')
  async register(@Req() req: Request, @Res() res: Response) {
    try {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const doc = new UserModel({
        email: req.body.email,
        passwordHash: hash,
      });

      const user = await doc.save();

      const token = jwt.sign(
        {
          _id: user._id,
        },
        'secret123',
        {
          expiresIn: '30d',
        },
      );

      const { passwordHash, ...userData } = user.toObject();
      return res.json({
        ...userData,
        token,
      });
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
          message: 'Ошибка валидации',
          errors: err.errors,
        });
      } else {
        logger.error(err);
        return res.status(500).json({
          message: 'Не удалось зарегистрироваться',
        });
      }
    }
  }

  @Post('/auth/login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await UserModel.findOne({ email: req.body.email });

      if (!user) {
        logger.info('Ошибка авторизации');
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }

      const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash);

      if (!isValidPass) {
        return res.status(400).json({
          message: 'Неверный логин или пароль',
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        'secret123',
        {
          expiresIn: '30d',
        },
      );

      const { passwordHash, ...userData } = user.toObject();

      res.json({
        ...userData,
        token,
      });
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
          message: 'Ошибка валидации',
          errors: err.errors,
        });
      } else {
        logger.error(err);
        return res.status(500).json({
          message: 'Не удалось зарегистрироваться',
        });
      }
    }
  }

  @Get('/auth/me')
  async getMe(req: IAuthRequest, res: Response) {
    try {
      const user = await UserModel.findById(req.userId);

      if (!user) {
        logger.info('Ошибка авторизации');
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }

      const { passwordHash, ...userData } = user.toObject();

      res.json(userData);
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
          message: 'Ошибка валидации',
          errors: err.errors,
        });
      } else {
        logger.error(err);
        return res.status(500).json({
          message: 'Не удалось зарегистрироваться',
        });
      }
    }
  }
}