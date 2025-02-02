'use client';
import { createContext, ReactNode, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
interface Product {
  id: number;
  category: string;
  shoeName: string;
  price: number;
  discountPrice: number;
  shortDescription: string;
  rating: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: Product[] | any;
  grandTotal: number;
  addCart: (product: Product) => void;
  updateQuantityOfProduct: (productId: number, state: boolean) => void;
  deleteCart: (productId: number) => void;
  compareShoes: (shoeId: string) => void; 
  getComparedShoes: () => string[];
  removeShoe: (shoeId: string) => void;
}

export const CartContext = createContext<CartContextType | null>(null);

const CartProvider = ({ children }: { children: ReactNode }) => {

  const [compare, setCompare] = useState(() => {
    const saveCompare = localStorage.getItem('comparedShoes');
    return saveCompare ? JSON.parse(saveCompare) : [];
  });

  useEffect(()=>{
    localStorage.setItem('comparedShoes', JSON.stringify(compare));
  },[compare])

  const compareShoes = (shoeId: any): void => {
    let comparedShoes: string[] = JSON.parse(localStorage.getItem('comparedShoes') || '[]');
    const isShoe =  comparedShoes.find((shoe:any)=>shoe.id==shoeId.id)
    console.log(isShoe)
    if (isShoe) {
      toast.error('Shoe is already in the comparison list');
      return;
    }
  
    if (comparedShoes.length >= 2) {
      toast.error('You can only compare two shoes at a time');
      return;
    }

    comparedShoes.push(shoeId);
    localStorage.setItem('comparedShoes', JSON.stringify(comparedShoes));
    toast.success('Shoe added for comparison');
     return setCompare(comparedShoes)
    
  };

  const getComparedShoes = () => {
    const comparedShoes:string[] = JSON.parse(localStorage.getItem('comparedShoes')|| '[]')  ;
    return comparedShoes;
  };
  const removeShoe = (shoeId: string): void => {
    
    let comparedShoes: string[] = JSON.parse(localStorage.getItem('comparedShoes') || '[]');
    console.log(comparedShoes)
    const remaining =comparedShoes.filter((shoe:any)=>shoe.id!=shoeId)
  
    localStorage.setItem('comparedShoes', JSON.stringify(remaining));
    toast.success('Shoe removed from comparison');
    return setCompare(remaining)
  };



  const [grandTotal, setGrandTotal] = useState<number>(0);

  const [cart, setCart] = useState(() => {
    const saveCart = localStorage.getItem('shoeCart');
    return saveCart ? JSON.parse(saveCart) : [];
  });

  // save cart in local storage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));

    //   grand Total
    let result = 0;

    cart.forEach((product: Product) => {
      const totalPrice = product.discountPrice * product.quantity;
      result += totalPrice;
    });
    setGrandTotal(result);
  }, [cart]);

  // add to cart
  const addCart = (product: Product) => {
    const existingProduct = cart.find((c:any) => c.id === product.id);
    if (existingProduct) {
      const result = cart.map((c:any) =>
        c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c
      );
      toast.success('Quantity updated', {
        style: {
          background: '#2B3440',
          color: '#fff',
        },
      });
      return setCart(result);
    }

    setCart([...cart, product]);
    toast.success('Product Added', {
      style: {
        background: '#2B3440',
        color: '#fff',
      },
    });
  };

  //   quantity update
  const updateQuantityOfProduct = (productId: number, state: boolean) => {
    if (state) {
      const result = cart.map((c) => (c.id === productId ? { ...c, quantity: c.quantity + 1 } : c));
      toast.success(' +1 Quantity Updated', {
        style: {
          background: '#2B3441',
          color: '#fff',
        },
      });
      return setCart(result);
    } else {
      const result = cart.map((c:any) => (c.id === productId ? { ...c, quantity: c.quantity - 1 } : c));

      toast.success(' -1 Quantity Updated', {
        style: {
          background: '#2B3440',
          color: '#fff',
        },
      });
      return setCart(result);
    }
  };

  //   delete from cart
  const deleteCart = (productId: number) => {
    const result = cart.filter((p:any) => productId !== p.id);
    setCart(result);
  };

  const cartInfo: CartContextType = {
    cart,
    grandTotal,
    addCart,
    updateQuantityOfProduct,
    deleteCart,
    compareShoes,
    getComparedShoes,
    removeShoe
  };

  return <CartContext.Provider value={cartInfo}>{children}</CartContext.Provider>;
};

export default CartProvider;
