import { useState, useEffect } from "react";
import axios from "axios";

const useFetchMovies = (movieCategory) => {
    const [movieList, setMovieList] = useState({});
    const [error, setError] = useState(); 

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const url = `https://api.themoviedb.org/3/movie/${movieCategory}?include_adult=false&language=en-US&page=1`;
                const response = await axios.get(url, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${process.env.REACT_APP_MOVIES_API_READ_ACCESS_TOKEN}`,
                    }
                });
                console.log(`Fetching ${movieCategory} Movie List Successful: `, response.data);
                setMovieList(response.data.results)
            } catch (error) {
                console.error("Error Fetching Movie List: ", error);
                setError(error);
            }
        };

        if (movieCategory !== '') {
            fetchMovies();
        }
    }, [movieCategory]);

    return { movieList, error };
};

export default useFetchMovies;