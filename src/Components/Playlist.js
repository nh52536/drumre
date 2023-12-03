// Playlist.js

import React, {useRef, useState} from "react";
import axios from "axios";
import "./Playlist.css";
import {doc, setDoc,deleteDoc} from "firebase/firestore";
import {collection} from "@firebase/firestore";
import {db} from "../firebase";

function Playlist({username}) {
    const [playlistItems, setPlaylistItems] = useState([]);
    const [playlist, setPlaylist] = useState(false);
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [displayPlay, setDisplay] = useState(true);
    const [selectedArtistInfo, setSelectedArtistInfo] = useState(null);
    const [showArtistInfo, setShowArtistInfo] = useState(false);
    const [isLiked, setIsLiked] = useState(true);
    const [trackNameLiked, setTrackNameLiked] = useState([]);
        const [email, setEmail] = useState(window.localStorage.getItem("email"));
    const renderPlaylist = () => {
        return playlistItems.map((item) => (
            <div key={item.id} className="playlist-item">
                <div className="playlist-info">
                    <div className="playlist-name">{item.name}</div>
                    <div className="playlist-track-count">
                        Number of tracks in playlist: {item.tracks.total}
                    </div>
                </div>
                <button onClick={() => getTracks(item.id)}>See Tracks</button>
            </div>
        ));
    };

    const getTracks = async (playlistId) => {
        let token = window.localStorage.getItem("token");
        const {data} = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        );

        setPlaylistTracks(data.items);
        setSelectedPlaylist(playlistId);
    };

    const deleteFrom = async (trackName) => {
        console.log("trackName",trackName + "email",email)
        await deleteDoc(doc(db, email ,trackName.toString()));
    }
    const renderTracks = () => {
        return playlistTracks.map((track) => (
            <div key={track.track.id} className="track-item">
                <img
                    src={track.track.album.images[0].url}
                    alt={`${track.track.name} Album Cover`}
                    className="track-image"
                />
                <div className="track-info">
                    <div className="track-name">{track.track.name}</div>
                    <div className="track-artist">
                        Artist: {track.track.artists[0].name}
                        <div>
                        <button onClick={() => learnMoreAboutArtist(track.track.artists[0].name)}>
                            Learn More
                        </button>
                        <button onClick={() => saveToDataBase(track.track.name,track.track.artists[0].name)}>
                            SAVE TO FAVOURITES
                        </button>
                            <button onClick={async () => { await deleteFrom(track.track.name)

                            }}> REMOVE FROM FAVOURITES</button>
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    const learnMoreAboutArtist = async (artistName) => {
        try {
            const {data} = await axios.get(
                `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=0c3b96177c530815fc64df2a5bc3bfd1&artist=${artistName}&format=json`
            );
            setSelectedArtistInfo(data.artist);
            setShowArtistInfo(true); // Set the state to true when "Learn More" is clicked
        } catch (error) {
            console.error("Error fetching artist information:", error);
        }
    };

const saveToDataBase = async (trackName,artistName) => {
    let emails = window.localStorage.getItem("email")

    const favRef = collection(db, emails.toString()) // Firebase creates this automatically

    try {


        await setDoc(doc(favRef, trackName), {
            nameOfTrack: trackName,
            ArtistName: artistName,
        });
    } catch (e) {
        console.log(e)
    }
};
    const getPlaylist = async (e) => {
        e.preventDefault();
        let token = window.localStorage.getItem("token");
        const {data} = await axios.get("https://api.spotify.com/v1/me/playlists", {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        setPlaylistItems(data.items);
        setPlaylist(true);
        setDisplay(false);
    };

    const closeAll = async (e) => {
        e.preventDefault();
        setDisplay(true);
        setSelectedPlaylist(null);
        setSelectedArtistInfo(null);
        setPlaylist(false);
        setSelectedPlaylist(null);
        setShowArtistInfo(false);
        setPlaylistItems([]);

    }

    return (
        <div className="playlist-container">
            {!displayPlay && (
                <button className="get-playlist-button-close" onClick={closeAll}>
                    X
                </button>
            )}
            <div>{renderPlaylist()}</div>
            {selectedPlaylist !== null && (
                <div>
                    <h3>Tracks of {selectedPlaylist}</h3>
                    <div>{renderTracks()}</div>
                </div>
            )}
            {selectedArtistInfo && showArtistInfo && (
                <div>
                    <h3>Learn More About the Artist</h3>

                    <div>
                        <strong>Name:</strong> {selectedArtistInfo.name}
                    </div>
                    <div>
                        <strong>Biography:</strong> {selectedArtistInfo.bio.summary}
                    </div>
                    <div>
                        <strong>Last.fm Page:</strong>{" "}
                        <a href={selectedArtistInfo.url} target="_blank" rel="noopener noreferrer">
                            {selectedArtistInfo.url}
                        </a>
                    </div>
                    {/* Add more artist information as needed */}
                </div>
            )}
            {displayPlay && (
                <button className="get-playlist-button" onClick={getPlaylist}>
                    GET YOUR PLAYLIST FROM SPOTIFY
                </button>
            )}
        </div>
    );
}

export default Playlist;
