import express from 'express'
import { addPost, getPosts } from '../controllers/feed.js'

export const router = express.Router()

router.get('/posts', getPosts)

router.post('/post', addPost)