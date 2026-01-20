import { useState, useEffect } from 'react';
import { useGetProductsQuery } from '@/libreduxservices/productApi';
import { useGetCategoriesQuery } from '@/libreduxservices/categoryApi';
import { useCreateOrderMutation } from '@/libreduxservices/orderApi';
import dayjs from 'dayjs';
import { toast } from 'sonner';

export const usePOS = () => {
    const { data: categories } = useGetCategoriesQuery();
    const [activeCategory, setActiveCategory] = useState("");

    // Set initial category when categories load
    useEffect(() => {
        if (categories && categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0].name);
        }
    }, [categories, activeCategory]);

    const { data: productsData, isLoading: loadingProducts } = useGetProductsQuery(
        activeCategory ? { category: activeCategory } : {},
        { skip: !activeCategory }
    );
    const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

    const [cart, setCart] = useState<any[]>([]);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [orderType, setOrderType] = useState("IN_STORE");
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        setCurrentDate(dayjs().format("dddd, D MMM YYYY"));
    }, []);

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product._id);
            if (existing) {
                return prev.map(item => item.id === product._id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { id: product._id, name: product.name, price: product.price, qty: 1, note: "", image: product.image }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQty = (id: string, qty: number) => {
        if (qty <= 0) {
            removeFromCart(id);
            return;
        }
        setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;

        try {
            await createOrder({
                items: cart.map(item => ({
                    product: item.id,
                    quantity: item.qty
                })),
                type: orderType,
                paymentMethod: 'Credit Card', // default
            }).unwrap();

            setCart([]);
            setPaymentOpen(false);
            toast.success("Order placed successfully!");
        } catch (error: any) {
            console.error("Order failed:", error);
            toast.error(error.data?.message || "Failed to place order. Check stock.");
        }
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const discount = 0;
    const total = subtotal - discount;

    return {
        products: productsData
            ?.filter((p: any) => p.isActive !== false) // Only show active products
            .map((p: any) => ({
                ...p,
                available: p.availability // using calculated availability
            })) || [],
        categories: categories || [],
        activeCategory,
        setActiveCategory,
        currentDate,
        cart,
        subtotal,
        discount,
        total,
        paymentOpen,
        setPaymentOpen,
        orderType,
        setOrderType,
        addToCart,
        removeFromCart,
        updateQty,
        handlePlaceOrder,
        isLoading: loadingProducts || isCreatingOrder
    };
};
