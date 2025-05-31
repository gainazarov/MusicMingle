import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSongSchema, insertPlaylistSchema, insertUserLikeSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface UserClaims {
      sub: string;
      [key: string]: any;
    }
    interface Request {
      user?: {
        claims: UserClaims;
        [key: string]: any;
      };
    }
  }
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'audio') {
      if (file.mimetype.startsWith('audio/')) {
        cb(null, true);
      } else {
        cb(new Error('Only audio files allowed'));
      }
    } else if (file.fieldname === 'cover') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files allowed'));
      }
    } else {
      cb(new Error('Unknown field'));
    }
  }
});

const JWT_SECRET = process.env.SESSION_SECRET || "dev_secret";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth: регистрация
  app.post("/api/auth/register", async (req, res) => {
    try {
      console.log("[REGISTER] req.body:", req.body);
      const { email, password, firstName, lastName } = req.body;
      if (!email || !password) {
        console.log("[REGISTER] Missing email or password");
        return res.status(400).json({ message: "Email и пароль обязательны" });
      }
      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length > 0) {
        console.log("[REGISTER] User already exists:", email);
        return res.status(400).json({ message: "Пользователь уже существует" });
      }
      const hash = await bcrypt.hash(password, 10);
      const id = crypto.randomUUID();
      await db.insert(users).values({
        id,
        email,
        firstName,
        lastName,
        password: hash,
      });
      console.log("[REGISTER] User created:", email);
      res.json({ success: true });
    } catch (e) {
      console.error("[REGISTER] Ошибка регистрации:", e);
      res.status(500).json({ message: "Ошибка регистрации" });
    }
  });

  // Auth: логин
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email и пароль обязательны" });
      }
      const [user] = await db.select().from(users).where(eq(users.email, email));
      if (!user || !user.password) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(400).json({ message: "Неверный пароль" });
      }
      const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ token });
    } catch (e) {
      res.status(500).json({ message: "Ошибка входа" });
    }
  });

  // Auth: выход (logout)
  app.post("/api/auth/logout", (req, res) => {
    // На фронте просто удаляется токен, серверный logout для совместимости
    res.json({ success: true });
  });

  // Middleware для проверки JWT
  function requireAuth(req: Request, res: any, next: any) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Нет токена" });
    }
    try {
      const payload = jwt.verify(auth.slice(7), JWT_SECRET);
      (req as any).user = { claims: payload };
      next();
    } catch {
      res.status(401).json({ message: "Неверный токен" });
    }
  }

  // Защита всех приватных API-роутов
  app.use("/api", (req, res, next) => {
    // Разрешаем только публичные маршруты
    const openRoutes = [
      "/api/auth/login",
      "/api/auth/register",
      "/api/songs/top-tunes",
      "/api/songs/suggested",
      "/api/songs",
      /^\/api\/songs\/\d+$/,
      /^\/api\/songs\/\d+\/play$/,
      /^\/api\/playlists\/\d+$/,
      /^\/api\/playlists\/\d+\/songs$/,
      "/api/upload"
    ];
    const path = req.path;
    if (openRoutes.some(r => typeof r === "string" ? r === path : r.test(path))) {
      return next();
    }
    requireAuth(req, res, next);
  });

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Song routes - specific routes before parameterized routes
  app.get('/api/songs/top-tunes', async (req, res) => {
    try {
      const limitParam = req.query.limit as string;
      const limit = limitParam && !isNaN(parseInt(limitParam)) ? parseInt(limitParam) : 10;
      const topTunes = await storage.getTopTunes(limit);
      res.json(topTunes);
    } catch (error) {
      console.error("Error fetching top tunes:", error);
      res.status(500).json({ message: "Failed to fetch top tunes" });
    }
  });

  app.get('/api/songs/suggested', async (req, res) => {
    try {
      const limitParam = req.query.limit as string;
      const limit = limitParam && !isNaN(parseInt(limitParam)) ? parseInt(limitParam) : 20;
      let userId: string | undefined;
      
      if ((req.user as any)?.claims?.sub) {
        userId = (req.user as any).claims.sub;
      }
      
      const suggestions = await storage.getSuggestedSongs(userId, limit);
      res.json(suggestions);
    } catch (error) {
      console.error("Error fetching suggested songs:", error);
      res.status(500).json({ message: "Failed to fetch suggested songs" });
    }
  });

  app.get('/api/songs', async (req, res) => {
    try {
      const songs = await storage.getSongs();
      res.json(songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
      res.status(500).json({ message: "Failed to fetch songs" });
    }
  });

  app.get('/api/songs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid song ID" });
      }
      const song = await storage.getSong(id);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      res.json(song);
    } catch (error) {
      console.error("Error fetching song:", error);
      res.status(500).json({ message: "Failed to fetch song" });
    }
  });

  app.post('/api/songs/:id/play', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid song ID" });
      }
      await storage.updateSongPlays(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating song plays:", error);
      res.status(500).json({ message: "Failed to update song plays" });
    }
  });

  app.post('/api/upload', upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]), async (req: any, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (!files.audio || files.audio.length === 0) {
        return res.status(400).json({ message: "Audio file is required" });
      }

      const audioFile = files.audio[0];
      const coverFile = files.cover?.[0];
      
      const songData = insertSongSchema.parse({
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        genre: req.body.genre,
        duration: parseInt(req.body.duration),
        fileUrl: `/uploads/${audioFile.filename}`,
        coverImageUrl: coverFile ? `/uploads/${coverFile.filename}` : null,
        uploadedBy: req.user.claims.sub,
        isPublic: req.body.isPublic === 'true'
      });

      const song = await storage.createSong(songData);
      res.json(song);
    } catch (error) {
      console.error("Error uploading song:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid song data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to upload song" });
      }
    }
  });

  // Playlist routes
  app.get('/api/playlists/:userId', async (req: any, res) => {
    try {
      const { userId } = req.params;
      
      // Only allow users to access their own playlists
      // if (req.user.claims.sub !== userId) {
      //   return res.status(403).json({ message: "Access denied" });
      // }
      
      const playlists = await storage.getPlaylists(userId);
      res.json(playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  app.get('/api/playlists/:id/songs', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const playlistSongs = await storage.getPlaylistSongs(id);
      res.json(playlistSongs);
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
      res.status(500).json({ message: "Failed to fetch playlist songs" });
    }
  });

  app.post('/api/playlists', async (req: any, res) => {
    try {
      const playlistData = insertPlaylistSchema.parse({
        ...req.body,
        userId: req.user.claims.sub
      });
      
      const playlist = await storage.createPlaylist(playlistData);
      res.json(playlist);
    } catch (error) {
      console.error("Error creating playlist:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid playlist data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create playlist" });
      }
    }
  });

  // User likes routes
  app.get('/api/users/:userId/likes', async (req: any, res) => {
    try {
      const { userId } = req.params;
      
      // Only allow users to access their own likes
      // if (req.user.claims.sub !== userId) {
      //   return res.status(403).json({ message: "Access denied" });
      // }
      
      const likes = await storage.getUserLikes(userId);
      res.json(likes);
    } catch (error) {
      console.error("Error fetching user likes:", error);
      res.status(500).json({ message: "Failed to fetch user likes" });
    }
  });

  app.post('/api/songs/:songId/like', async (req: any, res) => {
    try {
      const songId = parseInt(req.params.songId);
      const userId = req.user.claims.sub;
      
      const isLiked = await storage.isSongLiked(userId, songId);
      if (isLiked) {
        return res.status(400).json({ message: "Song already liked" });
      }
      
      const likeData = insertUserLikeSchema.parse({
        userId,
        songId
      });
      
      const like = await storage.likeSong(likeData);
      res.json(like);
    } catch (error) {
      console.error("Error liking song:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid like data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to like song" });
      }
    }
  });

  app.delete('/api/songs/:songId/like', async (req: any, res) => {
    try {
      const songId = parseInt(req.params.songId);
      const userId = req.user.claims.sub;
      
      await storage.unlikeSong(userId, songId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error unliking song:", error);
      res.status(500).json({ message: "Failed to unlike song" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}
