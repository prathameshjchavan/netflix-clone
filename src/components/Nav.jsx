import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./Nav.css";

function Nav() {
	const [show, handleShow] = useState(false);
	const history = useHistory();

	const transitionNavBar = () => {
		if (window.scrollY > 100) {
			handleShow(true);
		} else {
			handleShow(false);
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", transitionNavBar);

		return () => window.removeEventListener("scroll", transitionNavBar);
	}, []);

	return (
		<div className={`nav ${show && "nav__black"}`}>
			<div className="nav__contents">
				<img
					className="nav__logo"
					width={80}
					src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
					alt="netflix logo"
				/>
				<img
					onClick={() => history.push("/profile")}
					width={30}
					height={30}
					className="nav__avatar"
					src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
					alt="avatar"
				/>
			</div>
		</div>
	);
}

export default Nav;
