import axios from "../axios";
import React, { useEffect, useState } from "react";
import requests from "../utils/requests";
import "./Banner.css";

function Banner() {
	const [movie, setMovie] = useState(null);
	const backgroundImageUrl = movie
		? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
		: "";

	const truncate = (string, n) => {
		return string?.length > n ? string.substr(0, n - 1) + "..." : string;
	};

	useEffect(() => {
		async function fetchData() {
			const request = await axios.get(requests.fetchNetflixOriginals);
			setMovie(
				request.data.results[
					Math.floor(Math.random() * request.data.results.length - 1)
				]
			);
		}

		fetchData();
	}, []);

	return (
		<header
			className="banner"
			style={{
				backgroundSize: "cover",
				backgroundImage: `url('${backgroundImageUrl}')`,
				backgroundPosition: "center center",
			}}
		>
			<div className="banner__contents">
				<h1 className="banner__title">Movie Name</h1>
				<div className="banner__buttons">
					<button className="banner__button">Play</button>
					<button className="banner__button">My List</button>
				</div>
				<h1 className="banner__description">
					{truncate(
						"This is a test!This is a test!This is a test!This is a test!This is atest!This is a test!This is a test!This is a test!This is a test!This is a test!This is a test!This is a test!This is a test!This is atest!This is a test!This is a test!This is a test!This is a test!This is a test!This is a test!This is a test!This is a test!This is atest!This is a test!This is a test!This is a test!This is a test!",
						150
					)}
				</h1>
			</div>

			<div className="banner--fadeButton" />
		</header>
	);
}

export default Banner;
