import React, {useRef, useState} from "react";
import axios from "axios";
import "./TVShow.css";

function TVShow() {
    const TVMAZE_API_BASE_URL = 'https://api.tvmaze.com';

    const [movies, setMovies] = useState([]);
    const [searchMovieKey, setSearchMovieKey] = useState('');
    const [displayShow, setDisplay] = useState(true);
    const [displayAll, setDisplayAll] = useState(false)
    const searchMovies = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.get(`${TVMAZE_API_BASE_URL}/search/shows`, {
                params: {
                    q: searchMovieKey,
                },
            });
            setMovies(data);
        } catch (error) {
            console.error("Error searching for movies:", error);
        }
    };

    // Function to render movie results
    const renderMovies = () => {
        return movies.map((movie) => (
            <div key={movie.show.id} className="movie-item">
                {movie.show.image ? (
                    <img className="movie-image" src={movie.show.image.medium} alt=""/>
                ) : (
                    <div>No Image</div>
                )}
                <div className="movie-title">{movie.show.name}</div>
            </div>
        ));
    };


    const closeAll = async (e) => {
        e.preventDefault();
        setDisplay(true)
        setDisplayAll(false)
        setSearchMovieKey('')
        setMovies([])

    }
    return (
        <div>

            <div className="movie-container">
                <div>
                    {!displayShow && (
                        <button className="get-playlist-button-close" onClick={closeAll}>
                            X
                        </button>
                    )}
                </div>
                {displayAll &&
                    <form onSubmit={searchMovies}>
                        <div>Enter TV SHOW</div>
                        <input
                            title={"You are not sure what is the exact name of the show you watched recently? Try this out. Enter a part of the name you think it is and we will show you all the similiar shows with that name!"}
                            type="text" onChange={(e) => setSearchMovieKey(e.target.value)}/>
                        <button type={"submit"}>Search TvShow</button>
                    </form>
                }
                <div>{renderMovies()}</div>

            </div>
            {displayShow && (
                <button className="get-playlist-button" onClick={() => {
                    setDisplayAll(true);
                    setDisplay(false)
                }}>
                    ADDITIONAL HELP
                </button>
            )}
        </div>
    )
        ;
}

export default TVShow;
