import logo from './logo.svg';
import './App.css'

import {useEffect, useRef, useState} from "react";
import axios from "axios";
import Playlist from "./Components/Playlist";
import TVShow from "./Components/TVShow";
import handleSubmitFn from "./handlers/handleSubmit";
import {addDoc, collection} from "@firebase/firestore"
import {db} from "./firebase";
import handleSubmit from "./handlers/handleSubmit";
import handleMsg from "./handlers/handleMsg";
import getCities from "./handlers/getCities";
import {doc, getDoc} from "firebase/firestore";
import {  getDocs } from "firebase/firestore";

function App() {

    const CLIENT_ID = '59097828c7c14767b30fdc16ede83d49'
    const REDIRET_URI = 'http://localhost:3000/api/auth/callback/spotify'
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
    const RESPONSE_TYPE = 'token'
    const SCOPES = 'user-read-private user-read-email'; // Include 'user-read-email' scope
    const [songs, setSongs] = useState([{}])
    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [typeOfUser, setTypeOfUser] = useState('')
    const [close, setClose] = useState(false)
    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")
        if (!token && hash) {
            token = hash.substring(1).split("&").find(el => el.startsWith("access_token")).split("=")[1]
            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }
        setToken(token)
        setSongs([])
        if (token) {
            axios.get("https://api.spotify.com/v1/me", {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(response => {
                    const username = response.data.display_name || response.data.id;
                    if (response.data.email) {
                        const email = response.data.email;
                        retrieveUserData(email)
                        const type = response.data.product;
                        //console.log("Email:", email);
                        handleSubmit(email, username, type)
                        window.localStorage.setItem("email", email)
                    } else {
                        console.log("Email not available");
                    }
                })
                .catch(error => {
                    console.error("Error fetching user information:", error);
                });
        }
    }, [])

    const retrieveUserData = async (email) => {
        const loginRef = doc(db, "login", email);

        try {
            const docSnap = await getDoc(loginRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                console.log("User Data:", userData);
                setEmail(email)
                setUsername(userData.name)
                setTypeOfUser(userData.typeOfuser)
            } else {
                console.log("No such document!");
            }
        } catch (e) {
            console.error("Error getting document:", e);
        }
    };
    const logOut = () => {
        setToken("")
        window.localStorage.removeItem("token")

    }

    const renderArtists = () => {
        return artists.map(artist => (
            <div key={artist.id}>
                {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
                {artist.name}
            </div>
        ))
    }

    const dataRef = useRef();
    const ref = collection(db, "message")
    const handleSave = async (e) => {
        e.preventDefault()
        await handleMsg()
    }

    const retriveFavourites = async () => {

        const querySnapshot = await getDocs(collection(db, email));
        let songs = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            songs.push(doc.data())

        });
        setClose(true)
        console.log(songs)
        setSongs(songs)
    }
    return (
        <div className="App">
            <header className="App-header">
                    {token && (
                        <div className="columns-both">
                            <TVShow />
                            <Playlist
                                email/>
                        </div>
                    )}

                <div className="user-info-box">

                    {token && (
                        <div>
                            <strong>Spotify Information:</strong>
                            <p>Username: {username}</p>
                            <p>Email: {email}</p>
                            <p>Type of User: {typeOfUser}</p>
                        </div>
                    )}
                    <div className="upperPart">
                        {token ? (
                            <button onClick={logOut}>Log out</button>
                        ) : (
                            <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRET_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`}>Login</a>
                        )}
                    </div>
                </div>

                {token && !close && <button className="get-favorites-button" onClick={() => retriveFavourites()}>
                    GET MY FAVORITE SONGS
                </button>}
                {token &&  close &&  <button onClick={() => {setClose(false)}}>HIDE MY FAVORUTIE SONGS</button> }
                {token &&  close && songs.map(song => (
                    <div key={song.nameOfTrack}>
                        {song.nameOfTrack} - {song.ArtistName}
                    </div>
                ))}
            </header>
        </div>
    );

}

export default App;
