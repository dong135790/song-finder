import { Router } from "express";
import {
  searchShazam,
  getWorldChart,
  searchArtists,
  getArtistSongs,
  getSongsByArtistName,
} from "../controller/shazamController.js";

const router = Router();

router.get("/search", searchShazam);
router.get("/top", getWorldChart);
router.get("/artist", searchArtists);
router.get("/artist/:artistId/songs", getArtistSongs);
router.get("/artist-songs", getSongsByArtistName);

export default router;
