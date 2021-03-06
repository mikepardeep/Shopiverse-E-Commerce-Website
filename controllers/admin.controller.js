//import the Product Model
const Order = require('../models/order.model');
const Product = require('../models/product.model')

//get the admin get product
async function getProducts(req,res, next){
    try {
        const products = await Product.findAll();
        res.render('admin/products/all-products', {products:products});

    } catch(error) {
        next(error);
        return;
    }
   
}

//get the admin new product
function getNewProducts(req, res){
    res.render('admin/products/new-product');
}


//submitting a new product
async function createNewProduct(req,res, next){
   
   const product = new Product({
       ...req.body, 
       image: req.file.filename
   });


   try {
        await product.save();
        res.redirect('/admin/products');
   } catch(error) {
        next(error);
        return;
   }


}

async function getUpdateProduct(req,res,next) {

    try {
        const product = await Product.findById(req.params.id);
        res.render('admin/products/update-product', { product: product })
    } catch (error){
        console.log(error);
        next(error);
    }
}

async function updateProduct(req,res, next){

    //create a new Product object
    const product = new Product({
        ...req.body,
        _id : req.params.id
    });

    //checking whether the file exist
    if(req.file){
        //replace the old image with the new one
        product.replaceImage(req.file.filename);
    }

    //save the product
    try {
        await product.save();
    } catch(error) {
        next(error);
        return;
    }
    
    //redirect
    res.redirect('/admin/products');
}

async function deleteProduct(req,res,next){
    let product;
    try {
        //find by id method store in product
        product = await Product.findById(req.params.id);
        await product.remove();
    } catch(error){
        return next(error);
    }
   
    res.status(200).json({ message: 'Deleted Product!'});
    
}

//function to get orders
async function getOrders(req,res,next) {
    try {
        const orders = await Order.findAll();
        res.render('admin/orders/admin-orders', {
            orders: orders
        });
    } catch(error) {
        next(error);
    }
}

//function to update orders
async function updateOrder(req,res,next) {
    const orderId = req.params.id;
    const newStatus = req.body.newStatus;

    try {
        const order = await Order.findById(orderId);

        order.status = newStatus;

        await order.save();

        res.json({ message: 'Order updated', newStatus: newStatus})
    } catch(error) {
        next(error);
    }
}


module.exports = {

    getProducts: getProducts,
    getNewProducts: getNewProducts,
    createNewProduct: createNewProduct,
    getUpdateProduct: getUpdateProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    getOrders: getOrders,
    updateOrder: updateOrder

}