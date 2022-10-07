import {
	query,
	where,
	collection,
	getDocs,
	addDoc,
	onSnapshot,
} from "firebase/firestore";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import db from "../firebase";
import { selectUser } from "../features/userSlice";
import _ from "lodash";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import "./Plans.css";
import { loadStripe } from "@stripe/stripe-js";

function Plans() {
	const [products, setProducts] = useState({});
	const [subscription, setSubscription] = useState(null);
	const user = useSelector(selectUser);
	const stripe_publishable_key = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

	const fetchData = useCallback(async () => {
		const q = query(collection(db, "products"), where("active", "==", true));
		const querySnapshot = await getDocs(q);

		let fetchedProducts = {};
		querySnapshot.forEach((productDoc) => {
			fetchedProducts[productDoc.id] = productDoc.data();
		});

		Object.keys(fetchedProducts).map(async (productId) => {
			const docRef = collection(db, "products", productId, "prices");
			const pricesSnapshot = await getDocs(docRef);

			let prices = {};
			pricesSnapshot.forEach((price) => {
				prices.priceId = price.id;
				prices.priceData = price.data();
			});

			fetchedProducts[productId].prices = prices;
		});

		setProducts(fetchedProducts);
	}, [setProducts]);

	const loadCheckout = useCallback(
		async (priceId) => {
			const colRef = collection(db, "customers", user.uid, "checkout_sessions");
			const docRef = await addDoc(colRef, {
				price: priceId,
				success_url: window.location.origin,
				cancel_url: window.location.origin,
			});

			let unsubscribe;

			const checkout = async (sessionId, error) => {
				if (error) {
					alert(`An error occured: ${error.message}`);
				}

				if (sessionId) {
					const stripe = await loadStripe(stripe_publishable_key);
					stripe.redirectToCheckout({ sessionId });
				}

				unsubscribe();
			};

			unsubscribe = onSnapshot(docRef, async (docSnapshot) => {
				const { sessionId, error } = docSnapshot.data();

				if (sessionId) await checkout(sessionId, error);
			});
		},
		[user.uid, stripe_publishable_key]
	);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		async function fetchSubscriptions() {
			const docRef = collection(db, "customers", user.uid, "subscriptions");
			const subscriptionsSnapshot = await getDocs(docRef);

			subscriptionsSnapshot.forEach((subscription) => {
				const { role, current_period_start, current_period_end } =
					subscription.data();

				setSubscription({
					role,
					current_period_start: current_period_start.seconds,
					current_period_end: current_period_end.seconds,
				});
			});
		}

		fetchSubscriptions();
	}, [user.uid]);

	return (
		<Fragment>
			{_.isEmpty(products) && !subscription ? (
				<Box sx={{ width: "100%", color: "#e50914" }}>
					<LinearProgress color="inherit" />
				</Box>
			) : (
				<div className="plans">
					{subscription && (
						<p className="plans__planRenewal">
							Renewal Date:{" "}
							{new Date(
								subscription?.current_period_end * 1000
							).toLocaleDateString()}
						</p>
					)}
					{Object.entries(products).map(([productId, productData]) => {
						// TODO: add some logic to check if the user's subscription is active...
						const isCurrentPackage = productData.name
							?.toLowerCase()
							.includes(subscription?.role);

						return (
							<div
								key={productId}
								className={`plans__plan ${
									isCurrentPackage && "plans__plan--disabled"
								}`}
							>
								<div className="plans__planInfo">
									<h5>{productData.name}</h5>
									<h6>{productData.description}</h6>
								</div>
								<button
									onClick={() =>
										!isCurrentPackage &&
										loadCheckout(productData.prices.priceId)
									}
								>
									{isCurrentPackage ? "Current Package" : "Subscribe"}
								</button>
							</div>
						);
					})}
				</div>
			)}
		</Fragment>
	);
}

export default Plans;
