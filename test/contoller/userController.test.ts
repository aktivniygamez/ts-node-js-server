import { UserController } from '../../src/controllers/UserController';
import User from '../../src/models/User';
import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { useExpressServer } from 'routing-controllers';
import { GlobalErrorHandler } from '../../src/middlewares/globalErrorHandler';
import mongoose from 'mongoose';

describe('UserController', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    let server: Application;
    beforeAll(async () => {
        await mongoose
        .connect('mongodb://localhost:27017/tstest')
        .then(() => console.log('DB ok'))
        .catch((err) => console.log('DB error', err));

        server = express();
        server.use(bodyParser.json());
        useExpressServer(server, {
            controllers: [UserController],
            middlewares: [GlobalErrorHandler],
            defaultErrorHandler: false
        });
    });


    it('register', async () => {
        const user = {
            email: '4135@g31ma.com',
            password: '31341'
        };

        const response = await request(server)
            .post('/auth/register')
            .send(user)
            .expect(200);

        expect(response.body.token).toBeDefined(); 
    });

    it('login', async () => {
        const user = {
            email: '4135@g31ma.com',
            password: '31341'
        }

        const response = await request(server)
            .post('/auth/login')
            .send(user)
            .expect(200)

        expect(response.body.token).toBeDefined()
    })
});