import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertSongSchema, insertPlaylistSchema, insertUserLikeSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";

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

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/upload', isAuthenticated, upload.fields([
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
  app.get('/api/playlists/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      
      // Only allow users to access their own playlists
      if (req.user.claims.sub !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
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

  app.post('/api/playlists', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/users/:userId/likes', isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      
      // Only allow users to access their own likes
      if (req.user.claims.sub !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const likes = await storage.getUserLikes(userId);
      res.json(likes);
    } catch (error) {
      console.error("Error fetching user likes:", error);
      res.status(500).json({ message: "Failed to fetch user likes" });
    }
  });

  app.post('/api/songs/:songId/like', isAuthenticated, async (req: any, res) => {
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

  app.delete('/api/songs/:songId/like', isAuthenticated, async (req: any, res) => {
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
