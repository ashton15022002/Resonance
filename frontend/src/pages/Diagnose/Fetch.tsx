import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchData, fetchJson, Data, BASE } from "../../api";

// Components
import Loading from "../../components/Loading/Loading";
import Typewriter from "../../components/Typewriter/Typewriter";
import Frame from "../../components/Frame/Frame";
import Artist from "../../components/Artist/Artist";
import Playlist from "../../components/Playlist/Playlist";
import Receipt from "../Receipt/Receipt";
import Footer from "../../components/Footer";

// Style
import "./Fetch.css";

const Fetch = () => {
	const location = useLocation();
	const [data, setData] = useState<Data>();
	const [playlist, setPlaylist] = useState();

	const [firstWriterComplete, setFirstWriterComplete] = useState(false);
	const [secondWriterComplete, setSecondWriterComplete] = useState(false);

	const [showReceipt, setShowReceipt] = useState(false);

	useEffect(() => {
		const fetchDataAndSetData = async () => {
			if (!data) {
				const analysis = await fetchData(location.state.data);
				setData(analysis);
				const playlist = await fetchJson(BASE + "playlist", {
					keyword: location.state.data.description,
				});
				setPlaylist(playlist);
			}
		};

		fetchDataAndSetData();
	}, [data, location.state.data]);

	return (
		<>
			{data ? (
				<>
					<section className="container">
						<motion.h1
							className="result__title"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 1, delay: 0.5 }}
							style={{
								color: data.color,
							}}
						>
							{data.mood}
						</motion.h1>

						<motion.img
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 1, delay: 2 }}
							style={{
								margin: "auto",
							}}
							src="/music_banner.png"
							width={500}
						/>
					</section>
					<motion.section
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1, delay: 3 }}
						className="container"
						id="description"
					>
						<Typewriter
							text={data.characteristics[0]}
							delay={30}
							onComplete={() => {
								setFirstWriterComplete(true);
							}}
						/>
						{firstWriterComplete && (
							<Typewriter
								text={data.characteristics[1]}
								delay={30}
								onComplete={() => {
									setSecondWriterComplete(true);
								}}
							/>
						)}
					</motion.section>

					{secondWriterComplete && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 1, delay: 1 }}
						>
							<section className="container">
								<h1 className="result__header">
									Famous artists represent your music taste
								</h1>

								{data.artists.map((artist: any, index: any) => (
									<Artist
										key={index}
										img={artist.img}
										name={artist.name}
										content={artist.content}
										color={data.color}
									/>
								))}
							</section>

							<section className="container">
								<h1 className="result__header">
									This playlist might be your cup of tea
								</h1>
								<Playlist
									playlist={playlist}
									color={data.color}
								/>
							</section>

							<section className="container">
								<h1 className="result__header">
									Here are the songs that are tailored for you
								</h1>
								{data && data.tracks && Array.isArray(data.tracks) ? (
									<Frame
										trackIds={data.tracks.map(
											(track) => track.id
										)}
									/>
								) : (
									<p>No tracks found or invalid data format</p>
								)}
							</section>

							<section
								className="container"
								style={{
									padding: "0 2rem",
									marginBottom: "6rem",
								}}
							>
								<p className="footer__content">
									Thank you ever so much for choosing our
									musicotherapy service. Your decision has
									undoubtedly left us speechless, or perhaps
									just slightly bemused. We can only imagine
									the profound impact our tunes will have on
									your soul.
								</p>
								<br />
								<p className="footer__content">
									Farewell, dear patron, may your sarcasm be
									as melodious as our melodies. Cheers to your
									journey of sonic enlightenment!
								</p>

								<div
									className="diagnose__button-container"
									onClick={() => setShowReceipt(!showReceipt)}
								>
									Do you need a receipt?{" "}
									<a className="button-alter">
										{showReceipt
											? "Close receipt"
											: "Yes, send me!"}
									</a>
								</div>

								{showReceipt && (
									<Receipt data={data} playlist={playlist} />
								)}

								<p className="footer__content">
									This is a satirical project that leverages
									large language model for music taste
									analysis and recommendation. The system
									engine incorporates a custom blend of
									insights generated by OpenAI's GPT-4 model
									paired with recommendation derived from
									comprehensive data obtained through Spotify
									API.
								</p>
								<br />
								<p className="footer__content">
									Further explore your music taste with
									Musicotherapy's overtime service,{" "}
									<a
										href="https://resonance.streamlit.app/"
										style={{ textDecoration: "underline" }}
									>
										Resonance
									</a>
									.
								</p>
								<br />
								<p className="footer__content">
									Follow our latest updates on{" "}
									<a
										href="https://github.com/nauqh/resonance"
										style={{ textDecoration: "underline" }}
									>
										Github
									</a>
									.
								</p>
							</section>

							<Footer />
						</motion.div>
					)}
				</>
			) : (
				<Loading />
			)}
		</>
	);
};

export default Fetch;