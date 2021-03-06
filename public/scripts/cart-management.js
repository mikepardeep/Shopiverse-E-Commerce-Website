//target the add cart button element
const addCartButtonElement = document.querySelector('#product-details button');

//target cart badge element
const cardBadgeElements = document.querySelectorAll('.nav-items .badge');


//function to add to cart
async function addToCart(){
    //target button element dataset
    const productId = addCartButtonElement.dataset.productid;
    const csrfToken = addCartButtonElement.dataset.csrf;

    let response;
    try {
        response = await fetch('/cart/items', {
            method: 'POST',
            body: JSON.stringify({
                productId: productId,
                _csrf: csrfToken
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
    } catch(error){
        alert('Something went wrong!');
        return;
    }
    
    if(!response.ok){
        alert('Something went wrong!')
        return;
    }

    //decode the responseData from json format
    const responseData = await response.json();


    //get the new total quantity
    const newTotalQuantity = responseData.newTotalItems;



    //update the element with the new quantity.
    for (const cartBadgeElement of cartBadgeElements){
        cardBadgeElement.textContent = newTotalQuantity

    }


}

//button event listener
addCartButtonElement.addEventListener('click', addToCart);