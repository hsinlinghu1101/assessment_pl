import "./App.css";
import axios from "axios";
import { useState } from "react";
import Artwork from "./Artwork";
function App() {
	const [result, setResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isSearch, setIsSearch] = useState(false);
	const currentYear = new Date().getFullYear();
	let isPublic = "";

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		setIsSearch(true);
		setResult([]);
		const allData = [];
		const { key, century, is_public_domain } = e.target;
		const dateBegin =
			century.value !== ""
				? (parseInt(century.value) * 100 - 100).toString()
				: "";
		const dateEnd =
			century.value !== "" ? (parseInt(century.value) * 100).toString() : "";
		isPublic =
			is_public_domain.value !== ""
				? is_public_domain.value === "true"
					? true
					: false
				: "";
		try {
			axios
				.get(
					"https://collectionapi.metmuseum.org/public/collection/v1/search",
					{
						params: {
							q: key.value,
							dateBegin: dateBegin,
							dateEnd: dateEnd,
						},
					},
				)

				.then(async (response) => {
					var allIds = response.data.objectIDs;
					var count = response.data.objectIDs.length || 0;
					allIds.every(async (id) => {
						var res = await axios.get(
							`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
						);

						if (
							(isPublic === "" || res.data.isPublicDomain === isPublic) &&
							allData.length < 5
						) {
							allData.push(res.data);
						} 
						count--;
						if (count === 0) {
							setLoading(false);
							setResult(allData);
						}
						if (allData.length >= 5) {
							return false;
						}
						return true;
					});
				})

				.catch((error) => {
					console.log(error);
					setLoading(false);
				});
	
		} catch (error) {
			console.log("Error getting wrong data: " + error);
			setLoading(false);
		}
	};
	return (
		<div className={loading ? "loading App" : "App"}>
			<header className="header">FrontEndEval - Met API</header>
			<form onSubmit={(e) => handleSubmit(e)}>
				<h3>Find the Artworks</h3>
				<div className="section">
					<label htmlFor="key">Keyword(s)* </label>
					<input
						type="text"
						name="key"
						id="key"
						placeholder="portrait, flowers, etc"
						required
					/>
				</div>
				<div className="section">
					<label htmlFor="century">Century created (Optional)</label>
					<input
						type="number"
						name="century"
						id="century"
						max="21"
						placeholder="19th, 14th, etc "
					/>
					<span>th</span>
				</div>
				<div className="section">
					<label htmlFor="is_public_domain">
						Is the public domain? (Optional)
					</label>
					<div className="pd">
						<input
							type="radio"
							value="true"
							name="is_public_domain"
							className="isPublic"
						/>
						<span>Yes</span>
					</div>
					<div className="pd">
						<input
							type="radio"
							value="false"
							name="is_public_domain"
							className="isPublic"
						/>
						<span>No</span>
					</div>
				</div>
				<button type="submit" className="btn" disabled={loading}>
					Search
				</button>
			</form>
			<div className="art">
				{isSearch ? (
					loading ? (
						<h3>Loading...</h3>
					) : result.length > 0 ? (
						result.map((data, i) => <Artwork key={i} data={data} />)
					) : (
						<h3> No artwork found, please try again </h3>
					)
				) : (
					""
				)}
			</div>
			<footer>
				<p>© {currentYear} Hsin Ling Hu</p>
			</footer>
		</div>
	);
}

export default App;

