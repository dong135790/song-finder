package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/shazam")
public class ShazamController {

    @Value("${shazam.api.key}")
    private String apiKey;

    @Value("${shazam.api.host}")
    private String apiHost;

    @Autowired
    private RestTemplate restTemplate;

    public HttpEntity<String> getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-RapidAPI-Key", apiKey);
        headers.set("X-RapidAPI-Host", apiHost);
        return new HttpEntity<>(headers);
    }

    @GetMapping("/search")
    public ResponseEntity<String> searchSong(@RequestParam String query) {

        String url = "https://shazam-core.p.rapidapi.com/v1/search/suggest";

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
            .queryParam("query", query);

        ResponseEntity<String> response = restTemplate.exchange(
            builder.toUriString(),
            HttpMethod.GET,
            getHeaders(),
            String.class
        );

        return ResponseEntity.ok(response.getBody());
    }

    @GetMapping("/charts")
    public ResponseEntity<String> getTopCharts() {

        String url = "https://shazam-core.p.rapidapi.com/v1/charts/world?country_code=US";
        ResponseEntity<String> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            getHeaders(),
            String.class
        );

        return ResponseEntity.ok(response.getBody());
    }

    @GetMapping("artist")
    public ResponseEntity<String> getArtistById(@RequestParam String artistId) {

        String url = "https://shazam-core.p.rapidapi.com/v2/artists/details";

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
            .queryParam("artist_id", artistId);

        ResponseEntity<String> response = restTemplate.exchange(
            builder.toUriString(),
            HttpMethod.GET,
            getHeaders(),
            String.class
        );

        return ResponseEntity.ok(response.getBody());

    }

    // @GetMapping("/search-artist")
    // public ResponseEntity<String> getArtistByName(@RequestParam String query) {
        
    //     String url = "https://shazam-core.p.rapidapi.com/v1/search/multi";

    //     UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
    //             .queryParam("query", query);

    //     ResponseEntity<String> response = restTemplate.exchange(
    //             builder.toUriString(),
    //             HttpMethod.GET,
    //             getHeaders(),
    //             String.class
    //     );

    //     return ResponseEntity.ok(response.getBody());
    // }


    @GetMapping("/multi-search")
    public ResponseEntity<String> searchMulti(@RequestParam String query) {
        String url = "https://shazam-core.p.rapidapi.com/v1/search/multi";

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
            .queryParam("query", query)
            .queryParam("search_type", "SONGS_ARTISTS");

        ResponseEntity<String> response = restTemplate.exchange(
            builder.toUriString(),
            HttpMethod.GET,
            getHeaders(),
            String.class
        );

        return ResponseEntity.ok(response.getBody());
    }

    @GetMapping("/search-album-songs")
    public ResponseEntity<String> searchAlbumSongs(@RequestParam String albumName, @RequestParam String artistName) {
        String searchQuery = albumName + " " + artistName;
        String url = "https://shazam-core.p.rapidapi.com/v1/search/multi";

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
            .queryParam("query", searchQuery)
            .queryParam("search_type", "SONGS_ARTISTS");

        ResponseEntity<String> response = restTemplate.exchange(
            builder.toUriString(),
            HttpMethod.GET,
            getHeaders(),
            String.class
        );

        return ResponseEntity.ok(response.getBody());
    }



    @GetMapping("/song-details")
    public ResponseEntity<String> getSongDetails(@RequestParam String trackId) {
        String url = "https://shazam-core.p.rapidapi.com/v1/tracks/details";

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
            .queryParam("track_id", trackId);

        ResponseEntity<String> response = restTemplate.exchange(
            builder.toUriString(),
            HttpMethod.GET,
            getHeaders(),
            String.class
        );

        return ResponseEntity.ok(response.getBody());
    }


}