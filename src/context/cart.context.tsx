import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNotification } from "./notification.context";

interface CartContextProps {
    cart: ICart[];
    addToCart: (book: any, quantity: number) => void;
    removeFromCart: (_id: string) => void;
    clearCart: () => void;
    updateQuantity: (_id: string, quantity: number) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const notification = useNotification();
    const [cart, setCart] = useState<ICart[]>(() => {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const syncWithLocalStorage = (updatedCart: ICart[]) => {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const updateQuantity = (_id: string, quantity: number) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) => {
                if (item._id === _id) {
                    return { ...item, quantity };
                }
                return item;
            });

            syncWithLocalStorage(updatedCart);
            return updatedCart;
        });
    }

    const addToCart = (book: any, quantity: number) => {
        try {
            if (quantity <= 0) {
                notification.error({
                    message: "Lỗi",
                    description: "Số lượng không hợp lệ",
                });
                return;
            }

            setCart((prevCart) => {
                const cartData = [...prevCart];
                const bookIndex = cartData.findIndex((item) => item._id === book._id);

                if (bookIndex === -1) {
                    cartData.push({ _id: book._id, book, quantity });
                } else {
                    const newQuantity = cartData[bookIndex].quantity + quantity;

                    if (newQuantity > book.quantity) {
                        notification.error({
                            message: "Lỗi",
                            description: "Số lượng vượt quá số lượng tồn kho",
                        });
                        return prevCart;
                    }
                    cartData[bookIndex].quantity = newQuantity;
                }

                syncWithLocalStorage(cartData);
                notification.success({
                    message: "Thành công",
                    description: "Thêm vào giỏ hàng thành công",
                });

                return cartData;
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
            notification.error({
                message: "Lỗi",
                description: "Có lỗi xảy ra khi thêm vào giỏ hàng",
            });
        }
    };


    const removeFromCart = (_id: string) => {
        try {
            setCart((prevCart) => {
                const updatedCart = prevCart.filter((item) => item._id !== _id);

                if (updatedCart.length === prevCart.length) {
                    notification.warning({
                        message: "Lưu ý",
                        description: "Sản phẩm không tồn tại trong giỏ hàng",
                    });
                    return prevCart;
                }

                syncWithLocalStorage(updatedCart);
                notification.success({
                    message: "Thành công",
                    description: "Sản phẩm đã được xóa khỏi giỏ hàng",
                });
                return updatedCart;
            });
        } catch (error) {
            console.error("Error removing from cart:", error);
            notification.error({
                message: "Lỗi",
                description: "Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng",
            });
        }
    };


    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
