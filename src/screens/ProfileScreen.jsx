import React from "react";
import { useSelector } from "react-redux";
import Nav from "../components/Nav";
import Plans from "../components/Plans";
import { selectUser } from "../features/userSlice";
import { auth } from "../firebase";
import "./ProfileScreen.css";

function ProfileScreen() {
	const user = useSelector(selectUser);

	return (
		<div className="profileScreen">
			<Nav />
			<div className="profileScreen__body">
				<h1>Edit Profile</h1>
				<div className="profileScreen__info">
					<img
						height={100}
						width={100}
						src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
						alt="avatar"
					/>
					<div className="profileScreen__details">
						<h2>{user.email}</h2>
						<div className="profileScreen__plans">
							<h3>Plans</h3>
							<Plans />
							<button
								className="profileScreen__signOut"
								onClick={() => auth.signOut()}
							>
								Sign Out
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProfileScreen;
