import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";

function ProductFormWrapper() {
    let params = useParams()
    let navigate = useNavigate()

    return <ProductForm params={params} navigate={navigate} />

}

export default ProductFormWrapper