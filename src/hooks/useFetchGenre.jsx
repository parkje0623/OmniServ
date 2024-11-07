import { useState, useEffect } from "react";
import axios from "axios";

const useFetchGenre = () => {
    const [genreList, setGenreList] = useState({});

    // Handling/Fetching API Calls for a Movie Genre list
    useEffect(() => {
        const fetchGenre = async () => {
            try {
                const url = `https://api.themoviedb.org/3/genre/movie/list?language=en`;
                const response = await axios.get(url, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${process.env.REACT_APP_MOVIES_API_READ_ACCESS_TOKEN}`,
                    }
                });
                console.log("Fetching Genre List Successful: ", response.data);
                setGenreList(response.data.genres)
            } catch (error) {
                console.error("Error Fetching Genre List: ", error);
            }
        };

        fetchGenre();
    }, []);

    return { genreList };
};

export default useFetchGenre;