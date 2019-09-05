const db = require('../util/database');
const Cart = require('./Cart');

module.exports = class Product
{
    constructor(id, title, imageUrl, description, price){
        this.id=id;
        this.title=title;
        this.imageUrl=imageUrl;
        this.description=description;
        this.price=price;    
    }

    save(){
        return db.execute('INSERT INTO products (title,price,imageUrl,description) values (?,?,?,?)',
        [
            this.title,
            this.price,
            this.imageUrl,this.description
        ]);
    }

    static fetchAll(){
        return db.execute('select * from products');     
    }

    static fetchById(id){
        return db.execute('Select * from products where products.id = ?',[id]);
    }

    static deleteProduct(id){
        
    }

}