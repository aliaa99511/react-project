
// // with context

// import React, { useContext, useEffect, useState } from "react";
// import { GlobalContext } from "../../Context/globalContext";
// import SpinnerLoading from "../../Components/SpinnerLoading/SpinnerLoading";
// import NotFoundProduct from "../../Components/NotFoundProduct/NotFoundProduct";
// import CartItem from "../../Components/Cart/CartItem";
// import '../../Style/Cart.css'
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import { Helmet } from "react-helmet";
// import EmptyCart from "../../Components/Cart/EmptyCart";

// const Cart = () => {
//     const { GetLoggedUserCart, UpdateCartProductQuantity, RemoveCartItem, setNumOfCartItems } = useContext(GlobalContext)
//     const [cartItemData, setCartItemData] = useState([])
//     const [totalPrice, setTotalPrice] = useState()
//     const [loading, setLoading] = useState(true);

//     async function ShoppingCart() {
//         setLoading(true);
//         try {
//             let { data } = await GetLoggedUserCart()
//             setCartItemData(data.data.products)
//             setTotalPrice(data.data.totalCartPrice)
//         } catch (error) {
//             console.error("Error fetching product :", error);
//         } finally {
//             setLoading(false);
//         }
//     }

//     async function UpdateQuantity(id, count) {
//         let { data } = await UpdateCartProductQuantity(id, count)
//         console.log('dataQuant', data)
//         setCartItemData(data.data.products)
//     }

//     async function RemoveItem(id) {
//         let { data } = await RemoveCartItem(id)
//         if (data.status == "success") {
//             toast.success("product delete successfully");
//             setCartItemData(data.data.products)
//             setNumOfCartItems(data.numOfCartItems)
//         }
//     }
//     useEffect(() => {
//         ShoppingCart()
//     }, [])


//     if (loading) {
//         return (
//             <SpinnerLoading />
//         );
//     }

//     if (!cartItemData) {
//         return (
//             <NotFoundProduct />
//         );
//     }

//     if (cartItemData.length == 0) {
//         return (
//             <EmptyCart />
//         );
//     }

//     if (!cartItemData || cartItemData.length === 0) {
//         return <NotFoundProduct />;
//     }


//     if (cartItemData.length == 0) {
//         return (
//             <EmptyCart />
//         );
//     }

//     return (
//         <div className="cart">
//             <ToastContainer />
//             <Helmet>
//                 <title>My Cart</title>
//             </Helmet>

//             <div className="container">
//                 <h4 className="mt-4">Shop Cart :</h4>
//                 <h6 className="mt-2 bold">Total Cart Price : {totalPrice} EGP</h6>

//                 <div className="card">
//                     {cartItemData.length > 0 &&
//                         cartItemData.map(item => (
//                             <CartItem
//                                 key={item._id}
//                                 item={item}
//                                 RemoveItem={RemoveItem}
//                                 UpdateQuantity={UpdateQuantity} />
//                         ))
//                     }
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default Cart;



// with redux

import React, { useEffect, useState } from "react";
import SpinnerLoading from "../../Components/SpinnerLoading/SpinnerLoading";
import CartItem from "../../Components/Cart/CartItem";
import '../../Style/Cart.css'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import EmptyCart from "../../Components/Cart/EmptyCart";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoppingCart, removeCartItem, updateCartProductQuantity } from "../../Redux/CartSlice";

const Cart = () => {
    const [cartItemData, setCartItemData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch()

    const handleCartQuantity = (id, count) => {
        dispatch(updateCartProductQuantity({ id, count })).then((response) => {
            setCartItemData(response.payload.data.products);
            setTotalPrice(response.payload.data.totalCartPrice);
        })
    }

    const handleRemoveItem = (id) => {
        console.log('Dispatching removeCartItem with ID:', id);
        dispatch(removeCartItem(id))
            .then((action) => {
                console.log("action re", action);

                if (action.meta.requestStatus === 'fulfilled') {
                    toast.success("Product deleted successfully");
                    setCartItemData(action.payload.data.products);
                    setTotalPrice(action.payload.data.totalCartPrice);
                } else {
                    toast.error("Error deleting product");
                    console.error('Remove Item Rejected:', action.payload);
                }
            })
            .catch((error) => {
                toast.error("Error deleting product");
                console.error('Remove Item Catch Error:', error);
            });
    };

    useEffect(() => {
        dispatch(fetchShoppingCart()).then((response) => {
            setLoading(false);
            if (response.meta.requestStatus === 'fulfilled') {
                setCartItemData(response.payload.data.products);
                setTotalPrice(response.payload.data.totalCartPrice);
            } else {
                toast.error("Error fetching cart items");
            }
        });
    }, [dispatch]);


    if (loading) {
        return (
            <SpinnerLoading />
        );
    }

    if (!cartItemData || cartItemData.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="cart">
            <ToastContainer />
            <Helmet>
                <title>My Cart</title>
            </Helmet>
            <div className="container">
                <h4 className="mt-4">Shop Cart :</h4>
                <h6 className="mt-2 bold">Total Cart Price : {totalPrice} EGP</h6>
                <div className="card">
                    {cartItemData.length > 0 &&
                        cartItemData.map(item => (
                            <CartItem
                                key={item._id}
                                item={item}
                                RemoveItem={handleRemoveItem}
                                UpdateQuantity={handleCartQuantity} />
                        ))}
                </div>

            </div>
        </div>
    );
};

export default Cart;