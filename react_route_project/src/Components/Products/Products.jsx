import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Products = () => {

    const [products, setproducts] = useState([])

    async function getAllProducts() {
        const response = await axios.get('https://ecommerce.routemisr.com/api/v1/products')
        console.log('products:', response.data.data);
        setproducts(response.data.data)
    }

    useEffect(() => {
        getAllProducts()
    }, [])

    return (
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {products.map((product) => {
                <div className="col">
                    <div className="card h-100">
                        <img src={product.imageCover} className="card-img-top" alt={product.title} />
                        <div classNames="card-body">
                            <h5 className="card-title">{product.title}</h5>
                            <p className="card-text">{product.description}</p>
                        </div>
                    </div>
                </div>
            })}
        </div>
    )
}

export default Products