import {
  users,
  songs,
  playlists,
  playlistSongs,
  userLikes,
  type User,
  type UpsertUser,
  type Song,
  type InsertSong,
  type Playlist,
  type InsertPlaylist,
  type PlaylistSong,
  type InsertPlaylistSong,
  type UserLike,
  type InsertUserLike,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, sql, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Song operations
  getSongs(): Promise<Song[]>;
  getSong(id: number): Promise<Song | undefined>;
  createSong(song: InsertSong): Promise<Song>;
  updateSongPlays(id: number): Promise<void>;
  getTopTunes(limit?: number): Promise<Song[]>;
  getSuggestedSongs(userId?: string, limit?: number): Promise<Song[]>;
  
  // Playlist operations
  getPlaylists(userId: string): Promise<Playlist[]>;
  getPlaylist(id: number): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  addSongToPlaylist(playlistSong: InsertPlaylistSong): Promise<PlaylistSong>;
  getPlaylistSongs(playlistId: number): Promise<(PlaylistSong & { song: Song })[]>;
  
  // User likes operations
  likeSong(userLike: InsertUserLike): Promise<UserLike>;
  unlikeSong(userId: string, songId: number): Promise<void>;
  getUserLikes(userId: string): Promise<number[]>;
  isSongLiked(userId: string, songId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Song operations
  async getSongs(): Promise<Song[]> {
    return await db
      .select()
      .from(songs)
      .where(eq(songs.isPublic, true))
      .orderBy(desc(songs.createdAt));
  }

  async getSong(id: number): Promise<Song | undefined> {
    const [song] = await db.select().from(songs).where(eq(songs.id, id));
    return song;
  }

  async createSong(song: InsertSong): Promise<Song> {
    const [newSong] = await db.insert(songs).values(song).returning();
    return newSong;
  }

  async updateSongPlays(id: number): Promise<void> {
    await db
      .update(songs)
      .set({ plays: sql`${songs.plays} + 1` })
      .where(eq(songs.id, id));
  }

  async getTopTunes(limit = 10): Promise<Song[]> {
    return await db
      .select()
      .from(songs)
      .where(eq(songs.isPublic, true))
      .orderBy(desc(songs.plays))
      .limit(limit);
  }

  async getSuggestedSongs(userId?: string, limit = 20): Promise<Song[]> {
    // Simple suggestion algorithm - could be enhanced with user preferences
    return await db
      .select()
      .from(songs)
      .where(eq(songs.isPublic, true))
      .orderBy(desc(songs.createdAt))
      .limit(limit);
  }

  // Playlist operations
  async getPlaylists(userId: string): Promise<Playlist[]> {
    return await db
      .select()
      .from(playlists)
      .where(eq(playlists.userId, userId))
      .orderBy(desc(playlists.createdAt));
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist;
  }

  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    const [newPlaylist] = await db.insert(playlists).values(playlist).returning();
    return newPlaylist;
  }

  async addSongToPlaylist(playlistSong: InsertPlaylistSong): Promise<PlaylistSong> {
    const [newPlaylistSong] = await db.insert(playlistSongs).values(playlistSong).returning();
    return newPlaylistSong;
  }

  async getPlaylistSongs(playlistId: number): Promise<(PlaylistSong & { song: Song })[]> {
    return await db
      .select({
        id: playlistSongs.id,
        playlistId: playlistSongs.playlistId,
        songId: playlistSongs.songId,
        position: playlistSongs.position,
        createdAt: playlistSongs.createdAt,
        song: songs,
      })
      .from(playlistSongs)
      .innerJoin(songs, eq(playlistSongs.songId, songs.id))
      .where(eq(playlistSongs.playlistId, playlistId))
      .orderBy(asc(playlistSongs.position));
  }

  // User likes operations
  async likeSong(userLike: InsertUserLike): Promise<UserLike> {
    const [like] = await db.insert(userLikes).values(userLike).returning();
    return like;
  }

  async unlikeSong(userId: string, songId: number): Promise<void> {
    await db
      .delete(userLikes)
      .where(and(eq(userLikes.userId, userId), eq(userLikes.songId, songId)));
  }

  async getUserLikes(userId: string): Promise<number[]> {
    const likes = await db
      .select({ songId: userLikes.songId })
      .from(userLikes)
      .where(eq(userLikes.userId, userId));
    return likes.map(like => like.songId);
  }

  async isSongLiked(userId: string, songId: number): Promise<boolean> {
    const [like] = await db
      .select()
      .from(userLikes)
      .where(and(eq(userLikes.userId, userId), eq(userLikes.songId, songId)));
    return !!like;
  }
}

export const storage = new DatabaseStorage();
