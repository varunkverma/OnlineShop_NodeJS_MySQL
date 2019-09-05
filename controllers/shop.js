const Product = require('../models/product');
const Cart = require('../models/Cart');

exports.getProducts = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/product-list',{
            prods:products,
            pageTitle:'All Products',
            path:'/products'
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getProduct = (req,res,next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
    .then(product => {
        res.render('shop/product-details',{
            product,
            pageTitle:product.title,
            path:'/products'
        });
    })        
    .catch( err => { 
        console.log(err);
    })

    // or

    // Product.findAll( { where: { id:prodId } } )
    // .then(products => {
    //     res.render('shop/product-details',{
    //         product:products[0],
    //         pageTitle:products[0].title,
    //         path:'/products'
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    
}

exports.getIndex = (req,res,next) => {
    Product.findAll().then(products => {
        res.render('shop/index',{
            prods:products,
            pageTitle:'Shop',
            path:'/'
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getCart = (req,res,next) => {
    req.user.getCart()
    .then( cart => {
        cart.getProducts()
        .then( products => {
            console.log(products);
            res.render('shop/cart',{
                pageTitle: 'Your Cart',
                path: '/cart',
                products: products
            });
        })
        .catch( err => {
            console.log(err);
        });
    })
    .catch( err => {
        console.log(err);
    });
    
    // Cart.fetchCart((cart) => {
    //     Product.fetchAll(products => {
    //         const cartProducts=[];
    //         for(product of products){

    //             const cartProductData = cart.products.find(prod => prod.id ===product.id);
    //             if(cartProductData){
    //                 cartProducts.push({productData:product, qty:cartProductData.qty});
    //             }
    //         }
            
            // res.render('shop/cart',{
            //     pageTitle: 'Your Cart',
            //     path: '/cart',
            //     products: cartProducts
            // });
    //     })
        
    // })
    
}

exports.postCart = (req,res,next) => {
    
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
    .then( cart => {
        fetchedCart = cart;
        
        return cart.getProducts( { where : { id:prodId }})
    })
    .then( products =>{
        let product;
        if( products.length > 0 ){
            product  = products[0];
        }
        console.log("------------------------------------------------------------------------------")
        console.log(product);

        console.log("------------------------------------------------------------------------------")
        // if product already exists
        if(product){
            console.log("Product Exists!!!!!!!!!");
            let oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity+1;
            return product;
        }

        // adding a new product in the cart
        return Product.findByPk(prodId)
        
    })
    .then( product => {
        return fetchedCart.addProduct(product, {through : {quantity:newQuantity}} );
    })
    .then( () => res.redirect('/cart'))
    .catch( err => {
        console.log(err);
    })

    
}
exports.postCartDelete = (req,res,next) => {
    const prodId = req.body.productId;
    req.user.getCart()
    .then( cart => {
        return cart.getProducts( {where : {id: prodId}})
    })
    .then(products => {
        let product = products[0];
        return product.cartItem.destroy();
    })
    .then( () => {
        res.redirect('/cart');
    })
    .catch( err => console.log(err));  
}

exports.getOrders = (req,res,next) => {
    req.user.getOrders( {include : ['products'] } )
    .then( orders => {
        res.render('shop/orders',{
            pageTitle: 'Your Orders',
            path: '/orders',
            orders
        });
    })
    .catch(err => console.log(err))
    
}

exports.postOrder = (req,res,next) => {
    let fetchedCart;

    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then( products => {
        req.user.createOrder()
        .then( order => {
            return order.addProducts(products.map(product =>
                {
                    product.orderItem = {quantity: product.cartItem.quantity};
                    return product;
                })
            );
        })
        .catch(err =>  console.log(err));
        
    })
    .then(result => {
        return fetchedCart.setProducts(null);
    })
    .then( result => {
        res.redirect('/orders');
    })
    .catch( err => {
        console.log(err);
    })
}

exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout',{
        pageTitle: 'Checkout',
        path: '/checkout'
    });
}
