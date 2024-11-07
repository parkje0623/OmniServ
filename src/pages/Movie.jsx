import React, { useState, useEffect, useMemo } from "react";
import SubContentBar from "../components/SubContentBar";
import { useSubContentContext } from "../context/SubContentContext";
import Modal from "../components/Modal";
import useFetchGenre from '../hooks/useFetchGenre';
import useFetchMovies from "../hooks/useFetchMovies";
import '../stylesheets/movie.css';

function Movie() {
    const contentArr = useMemo(() => {
        return ['Now Playing', 'Popular', 'Top Rated', 'Upcoming'];
    }, []);
    const { selectedItem, handleClickContentArr } = useSubContentContext();

    const [movieCategory, setMovieCategory] = useState('');
    const { movieList, error } = useFetchMovies(movieCategory);
    const { genreList } = useFetchGenre();
    const [movieClick, setMovieClick] = useState(null);
    const [isMovieOpen, setIsMovieOpen] = useState(false);

    // Handling Onclick Movie - Display Movie Details on a Modal
    const handleMovieClick = (movie) => {
        // Since Movie List data handles Genre as ID (numbers)
        //  -> Find matching genre ID and return the name of the genre
        console.log(genreList);
        const genres = movie.genre_ids.map((id) => {
            const movieGenre = genreList.find((genre) => genre.id === id);
            return movieGenre ? movieGenre.name : 'Unknown';
        });

        setMovieClick({ ...movie, genres });
        setIsMovieOpen(true);
    };
    // Handling Closing Move Details
    const handleCloseMovie = () => {
        setIsMovieOpen(false);
        setMovieClick(null);
    };

    // Handle Default selectedItem at Initial
    useEffect(() => {
        if (!contentArr.includes(selectedItem)) {
            handleClickContentArr('Now Playing');
        }
    }, [selectedItem, handleClickContentArr, contentArr]);

    // Handling API reference naming for each selected content
    useEffect(() => {
        const categoryMap = {
            'Now Playing': 'now_playing',
            'Popular': 'popular',
            'Top Rated': 'top_rated',
            'Upcoming': 'upcoming'
        };
        setMovieCategory(categoryMap[selectedItem] || '');
    }, [selectedItem]);

    return (
        <div className="container">
            <div className="main-container">
                <div className="sub-content-bar">
                    <SubContentBar subContentArr={contentArr} />
                </div>

                <div className="main-content">
                    <div className="content-title">
                        <h2>{selectedItem} Movies</h2>
                    </div>

                    <div className="content-content">
                        <ul className="movie-list-content">
                            {movieList.length > 0 ? (
                                movieList.map((item) => (
                                    <li key={item.id} onClick={() => handleMovieClick(item)}>
                                        <img src={`https://image.tmdb.org/t/p/original${item.poster_path}`} alt={`${item.title} Poster`} />
                                        <strong>{item.title}</strong>
                                    </li>
                                ))
                            ) : (
                                <>
                                    {error ? (
                                        <p>An error occured. Please try again later.</p>
                                    ) : (
                                        <p>{selectedItem} Movie List is not Available at the moment.</p>
                                    )}
                                </>
                            )}
                        </ul>
                        
                        {/* Movie Detail Modal - Only Shown Upon Clicking Movie Poster */}
                        <Modal isOpen={isMovieOpen} onClose={handleCloseMovie}>
                            {movieClick && (
                                <div>
                                    <h2>{movieClick.title}</h2>
                                    <h4>Release Date: <strong>{movieClick.release_date}</strong></h4>
                                    <h4>Genre: <strong>{movieClick.genres.join(', ')}</strong></h4>
                                    <h4>Rating: <strong>{movieClick.vote_average}</strong></h4>
                                    <p>{movieClick.overview}</p>
                                </div>
                            )}
                        </Modal>
                    </div>
                </div>
            </div>

            <div className="attribution">
                <strong>Data provided by TMDB.</strong>
                <img src="movie_api_attr.svg" alt="TMDB: The Movie DB" />
            </div>
        </div>
    );
}

export default Movie;