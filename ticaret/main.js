const categoryList = document.querySelector('.categories');
const productList = document.querySelector('.products');
const modal = document.querySelector('.modal-wrapper');
const openBtn = document.querySelector('#open-btn');
const closeBtn = document.querySelector('#close-btn');
const modalList = document.querySelector('.modal-list');
const modalInfo = document.querySelector('#modal-info');

document.addEventListener('DOMContentLoaded', () => {
    // callback > içerisinde farklı fonksiyonları Çalıştırır.
    fetchCategories();
    fetchProduct();
});

function fetchCategories() {
    // veri çekme isteği atma
    fetch('https://api.escuelajs.co/api/v1/categories')
        // gelen veriyi işleme
        .then(res => res.json())
        // işlenen veriyi foreach ile her bir obje için ekran basma
        .then((data) => data.slice(0, 5).forEach((category) => {
            const {
                image,
                name
            } = category;
            // gelen her bir obje için div oluşturma
            const categoryDiv = document.createElement('div');
            // dive class ekleme
            categoryDiv.classList.add('category');
            //divin içeriğini değiştirme
            categoryDiv.innerHTML = `
    <img src="${image}" alt="${name}">
    <p>${name}</p>
    `;
            categoryList.appendChild(categoryDiv);
        }));
}


// Ürünleri Çekme
function fetchProduct() {
    // apiye veri çekme isteği atma
    fetch('https://api.escuelajs.co/api/v1/products')
        // istek başarılı olorsa veriyi işle
        .then(res => res.json())
        // işlenen veriyi foreach ile her bir obje için ekran basma
        .then((data) => data.slice(0, 32).forEach((item) => {
            // gelen her bir obje için div oluşturma
            const productDiv = document.createElement('div');
            // dive class ekleme
            productDiv.classList.add('product');
            //divin içeriğini değiştirme
            productDiv.innerHTML = ` 
            <img src="${item.images[0]}" />
            <p>${item.title}</p>
            <p>${item.category.name}</p>
            <div class="product-action">
              <p>${item.price} $</p>
              <button onclick="addToBasket({id:${item.id},title:'${item.title}',price:${item.price},img:'${item.images[0]}', amount:1})">Sepete Ekle</button>
            </div>
            `;
            // oluşan Ürünü Htmldeki listeye gönderme
            productList.appendChild(productDiv);
        }));
}

// Sepet 
let basket = [];
let total = 0;

// sepete ekleme işlemei

function addToBasket(product) {
    // sepete parametre olarak gelen elemanı arar.
    const foundItem = basket.find((basketItem) => basketItem.id === product.id);

    if (foundItem) {
        // eğer eleman varsa bulunan elemanın miktarını arttırır.
        foundItem.amount++;
    } else {
        basket.push(product);
    }
}

// açma ve kapatma

openBtn.addEventListener('click', () => {
    modal.classList.add('active');
    // sepetin İçerisine ürünleri listeleme
    addList();
    // toplam bilgisini güncelleme
    modalInfo.innerText = total;
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    // Sepeti kapatınca içini temizleme
    modalList.innerHTML = '';
    //toplam Değerini Sıfırlama
    total = 0;
});

// Sepete Listeleme Fonsiyonu
function addList() {
    basket.forEach((product) => {
        console.log(product);
        //sepet dizisindeki her bir obje için div oluşturur.
        const listItem = document.createElement('div');
        //bunlra class ekleme
        listItem.classList.add('list-item');
        //divin içeriğini değiştirme
        listItem.innerHTML = `
        <img src="${product.img}" />
            <h2>${product.title}</h2>
            <h2 class="price">${product.price}  $</h2>
            <p>Miktar: ${product.amount}</p>
            <button id="del" onclick="deleteItem({id:${product.id},price:${product.price} ,amount: ${product.amount}})">Sil</button>
        `;
        // oluşan Elemanı Htmldeki listeye gönderme
        modalList.appendChild(listItem);

        // toplam değişkeni güncelleme
        total += product.price * product.amount;
    });
}


// sepet dizisinde silme Fonksiyonu
function deleteItem(deletingItem){
    basket = basket.filter((i) => i.id !== deletingItem.id);
    // silinen elemanın fiyatını tatalden çıkarma
    total -= deletingItem.price * deletingItem.amount;

    modalInfo.innerText = total;
}

// silinen elemanı htmlden kaldırma

modalList.addEventListener('click', (e) =>{
    if(e.target.id === 'del'){
    e.target.parentElement.remove();
    }
});

// Eğer dışarıya tıklanırsa kapatma

modal.addEventListener('click', (e) =>{
    if(e.target.classList.contains('modal-wrapper')){
        modal.classList.remove('active');
    }
});