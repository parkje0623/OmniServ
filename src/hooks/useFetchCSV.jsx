import { useEffect, useState } from 'react';
import Papa from 'papaparse';

const useFetchCSV = (url) => {
    const [data, setData] = useState([]);
    const [, setLoading] = useState(true);

    useEffect(() => {
        try {
            Papa.parse(url, {
                download: true,
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    setData(result.data);
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error(`Error Fetching ${url} data.`);
            setLoading(false);
        }
    }, [url]);

    return { data };
};

export default useFetchCSV;