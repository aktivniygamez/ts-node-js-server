import { Body, Controller, Delete, Get, Param, Params, Patch, Post, Req, Res, UseBefore } from 'routing-controllers';
import PostModel from '../models/Post';
import { Request, Response } from 'express';
import checkAuth from '../middlewares/checkAuth';
import 'reflect-metadata';
import mongoose from 'mongoose';
import logger from '../utils/logger';

interface IAuthRequest extends Request {
  userId?: string
}

@Controller()
export class PostController {
  @Get('/getlasttags')
  async getLastTags(@Req() req: IAuthRequest, @Res() res: Response) {
    try {
      const posts = await PostModel.find().limit(5).exec();

      const tags = posts
        .map((obj: any) => obj.tags)
        .flat()
        .slice(0, 5);

      return res.json(tags);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({
        message: 'Не удалось получить тэги',
      });
    }
  }

  @Get('/posts')
  async getAll(@Req() req: IAuthRequest, @Res() res: Response) {
    try {
      const posts = await PostModel.find().populate('user').exec();
      return res.json(posts);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({
        message: 'Не удалось получить статьи',
      });
    }
  }

  @Get('/posts/:id')
  async getOne(@Param('id') id: string, @Req() req: IAuthRequest, @Res() res: Response) {
    try {
      const post = await PostModel.findOneAndUpdate(
        { _id: id },
        { $inc: { viewsCount: 1 } },
        { returnDocument: 'after' }
      ).populate('user');
  
      if (!post) {
        return res.status(404).json({
          message: 'Статья не найдена',
        });
      }
  
      return res.json(post);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({
        message: 'Не удалось получить статьи',
      });
    }
  }

  @UseBefore(checkAuth)
  @Delete('posts/:id')
  async remove(@Param('id') id: string, @Req() req: IAuthRequest, @Res() res: Response) {
    try {
      PostModel.findOneAndDelete(
        {
          _id: id,
        },
        (err: Error, doc: Document) => {
          if (err) {
            logger.error(err);
            return res.status(500).json({
              message: 'Не удалось удалить статью',
            });
          }

          if (!doc) {
            logger.error(err);
            return res.status(404).json({
              message: 'Статья не найдена',
            });
          }

          return res.json({
            success: true,
          });
        },
      );
    } catch (err) {
      logger.error(err);
      return res.status(500).json({
        message: 'Не удалось зарегистрироваться',
      });
    }
  }

  @UseBefore(checkAuth)
  @Post('/posts')
  async create(@Req() req: IAuthRequest, @Res() res: Response) {
    try {
      const doc = new PostModel({
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags ? req.body.tags.split(',') : [],
        user: req.userId,
      });

      const post = await doc.save();

      return res.json(post);
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

  @UseBefore(checkAuth)
  @Patch('/posts/:id')
  async update(@Param('id') id: string, @Req() req: IAuthRequest, @Res() res: Response) {
    try {
      await PostModel.updateOne(
        {
          _id: id,
        },
        {
          title: req.body.title,
          text: req.body.text,
          imageUrl: req.body.imageUrl,
          user: req.userId,
          tags: req.body.tags ? req.body.tags.split(',') : [],
        },
      );

      return res.json({
        success: true,
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
}