import express from 'express';

export interface Controller {
    readonly router: express.Router;
}
