import { db } from "./db";
import { songs, playlists, playlistSongs, userLikes } from "@shared/schema";

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Clear existing data
    await db.delete(playlistSongs);
    await db.delete(userLikes);
    await db.delete(playlists);
    await db.delete(songs);

    // Sample songs with realistic data
    const sampleSongs = [
      {
        title: "Midnight Echoes",
        artist: "Luna Waves",
        album: "Neon Dreams",
        genre: "Electronic",
        duration: 195,
        fileUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder audio
        coverImageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        uploadedBy: null,
        plays: 1500000,
        isPublic: true
      },
      {
        title: "Digital Sunrise",
        artist: "Cyber Dreams",
        album: "Future Beats",
        genre: "Synthwave",
        duration: 223,
        fileUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverImageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
        uploadedBy: null,
        plays: 890000,
        isPublic: true
      },
      {
        title: "Neon Highway",
        artist: "Electric Pulse",
        album: "City Lights",
        genre: "Electronic",
        duration: 187,
        fileUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverImageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
        uploadedBy: null,
        plays: 2100000,
        isPublic: true
      },
      {
        title: "Stellar Journey",
        artist: "Cosmic Flow",
        album: "Beyond Stars",
        genre: "Ambient",
        duration: 301,
        fileUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverImageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
        uploadedBy: null,
        plays: 756000,
        isPublic: true
      },
      {
        title: "Urban Pulse",
        artist: "Metro Beats",
        album: "Street Symphony",
        genre: "Hip Hop",
        duration: 198,
        fileUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverImageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        uploadedBy: null,
        plays: 3200000,
        isPublic: true
      },
      {
        title: "Crystal Waters",
        artist: "Aqua Sounds",
        album: "Deep Blue",
        genre: "Chill",
        duration: 245,
        fileUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverImageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
        uploadedBy: null,
        plays: 1800000,
        isPublic: true
      },
      {
        title: "Fire Storm",
        artist: "Blaze Runners",
        album: "Heat Wave",
        genre: "Rock",
        duration: 212,
        fileUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverImageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
        uploadedBy: null,
        plays: 950000,
        isPublic: true
      },
      {
        title: "Mystic Forest",
        artist: "Nature Harmony",
        album: "Earth Songs",
        genre: "New Age",
        duration: 278,
        fileUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverImageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
        uploadedBy: null,
        plays: 620000,
        isPublic: true
      },
      {
        title: "Electric Dreams",
        artist: "Volt Society",
        album: "High Voltage",
        genre: "Electronic",
        duration: 165,
        fileUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverImageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
        uploadedBy: null,
        plays: 1200000,
        isPublic: true
      },
      {
        title: "Ocean Drift",
        artist: "Wave Riders",
        album: "Tidal Flow",
        genre: "Ambient",
        duration: 289,
        fileUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverImageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
        uploadedBy: null,
        plays: 840000,
        isPublic: true
      }
    ];

    // Insert songs
    const insertedSongs = await db.insert(songs).values(sampleSongs).returning();
    console.log(`Inserted ${insertedSongs.length} songs`);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("Seeding finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };