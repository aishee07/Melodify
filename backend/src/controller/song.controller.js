import { Song } from "../models/song.model.js";

export const getAllSongs = async (req, res, next) => {
    try {
        // -1 = Descending => newest -> oldest
        // 1 = Ascending => oldest -> newest
        const songs = await Song.find().sort({ createdAt: -1 })
        res.json(songs)
    } catch (error) {
        next(error)
    }
};

export const getFeaturedSongs = async (req, res, next) => {
    try {
        //fetch 6 random songs using mongodb's aggregation pipeline
        const songs = await Song.aggregate([
            {
                $sample: { size: 6 }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1
                }
            }
        ])

        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const getMadeForYouSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            {
                $sample: { size: 4 }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1
                }
            }
        ])

        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const getTrendingSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            {
                $sample: { size: 4 }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1
                }
            }
        ])

        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const searchSongs = async (req, res, next) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: "Search query is required" 
            });
        }

        const songs = await Song.aggregate([
            {
                $match: {
                    $or: [
                        { title: { $regex: q, $options: "i" } },
                        { artist: { $regex: q, $options: "i" } }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                    duration: 1
                }
            },
            { $limit: 20 }
        ]);

        res.status(200).json({
            success: true,
            results: songs.length,
            data: songs
        });
    } catch (error) {
        next(error);
    }
};