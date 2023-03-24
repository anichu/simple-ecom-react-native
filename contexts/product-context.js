import { createContext, useEffect, useState } from "react";
import { getProducts } from "../utils/http";

export const ProductContext = createContext();
const ProductContextProvider = ({ children }) => {
	const [products, setProducts] = useState([]);
	useEffect(() => {
		const getProductsFunc = async () => {
			const data = await getProducts();

			setProducts(data);
		};
		getProductsFunc();
	}, []);
	const value = {
		products,
		setProducts,
	};

	return (
		<ProductContext.Provider value={value}>{children}</ProductContext.Provider>
	);
};

export default ProductContextProvider;
