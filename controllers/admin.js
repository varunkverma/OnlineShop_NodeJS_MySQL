const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
        res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing:false
    });
}

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price; 
    const description = req.body.description;
    
    // Product.create({
    //     title,
    //     imageUrl,
    //     description,
    //     price,
    //     userId:req.user.id
    // }).then(result => {
    //     console.log(result);
    //     res.redirect('/admin/products');
    // })
    // .catch( err => {
    //     console.log(err);
    // });

    //or

    req.user.createProduct({
        title,
        imageUrl,
        description,
        price
    })
    .then(result => {
        console.log(result);
        res.redirect('/admin/products');
    })
    .catch( err => {
        console.log(err);
    });

    
}

exports.getEditProduct = (req, res, next) => {
    // Get edit value from url using key
    const editMode = req.query.edit === "true" ? true : false; 
    if(!editMode) {
        return res.redirect('/');
    }
    const prodId=req.params.productId;
    
    // for getting products related to user only:

    req.user.getProducts({where : {id:prodId}})
    // Product.findByPk(prodId)
    .then(products => {
        const product = products[0];
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing:editMode,
            product
        });
    })
    .catch(err => {
        console.log(err);
    })
      
}

exports.postEditProduct = (req, res, next) => {
    
    const prodId = parseInt(req.body.productId);
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = parseInt(req.body.price);
    const updatedDescription = req.body.description;
    
    Product.findByPk(prodId)
    .then( product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl;
        return product.save(); 
    })
    .then(result => {
        console.log("UPDATED");
        res.redirect('/admin/products');
    })
    .catch(err => {
        // will catch error for both promises
        console.log(err);
    })

    
}

exports.getProducts = (req,res,next) => {
    // To fetch products for a particular user
    req.user.getProducts()
    // Product.findAll()
    .then( products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    })
    .catch( err => {
        console.log(err);
    });
}


exports.deleteProduct =(req,res,next)=>{
    const prodId = req.body.productId;

    Product.findByPk(prodId)
    .then(product => {
        return product.destroy();
    })
    .then(result => {
        console.log("Product Deleted");
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
}