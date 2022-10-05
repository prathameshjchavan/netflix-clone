import axios from "../axios";
import React, { useEffect, useState } from "react";
import "./Row.css";

function Row({ title, fetchUrl, isLargeRow = false }) {
	const [movies, setMovies] = useState([]);
	const base_url = "https://image.tmdb.org/t/p/original";

	useEffect(() => {
		async function fetchData() {
			const response = await axios.get(fetchUrl);

			setMovies(response.data.results);
		}

		fetchData();
	}, [fetchUrl]);

	return (
		<div className="row">
			<h2 className="row__title">{title}</h2>
			<div className="row__posters">
				{movies.map(
					({ id, name, poster_path, backdrop_path }) =>
						((isLargeRow && poster_path) || (!isLargeRow && backdrop_path)) && (
							<img
								loading="lazy"
								className={`row__poster ${isLargeRow && "row__posterLarge"}`}
								key={id}
								src={`${base_url}${isLargeRow ? poster_path : backdrop_path}`}
								alt={name}
							/>
						)
				)}
			</div>
		</div>
	);
}

export default Row;
