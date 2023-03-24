export const getProducts = async () => {
	try {
		const response = await fetch(
			"https://anis-molla-server.vercel.app/api/product/"
		);
		const data = await response.json();
		console.log(data);
		return data || [];
	} catch (err) {
		console.log("anis", err);
	}
};
