let gallery = document.getElementById("gallery");
let lightbox = document.getElementById("lightbox");
let lightImg = document.getElementById("lightImg");

let images = [];
let index = 0;
let autoSlide;

//  LOAD SAVED 
window.onload = ()=>{
let saved = JSON.parse(localStorage.getItem("hk_gallery")) || [];
saved.forEach(obj=>createImage(obj.src,obj.cat,false));
};

//  CREATE IMAGE 
function createImage(src,category,save=true){

let img = document.createElement("img");
img.src = src;

// category assign
if(category === "city") img.classList.add("city");
else img.classList.add("nature");

// size
img.style.width="100%";
img.style.height="420px";
img.style.objectFit="cover";

// open lightbox
img.onclick = ()=>{
images = document.querySelectorAll(".gallery img");
index = [...images].indexOf(img);
showImage();
lightbox.style.display="flex";
startAuto();
};

gallery.appendChild(img);

if(save) saveImages();
}

//  ADD IMAGE BUTTON 
function addImage(){
let input = document.getElementById("imgInput");
let file = input.files[0];

if(!file){
alert("Select image first");
return;
}

let category = prompt("Enter category: nature or city");

if(!category){
alert("Category required");
return;
}

category = category.toLowerCase().trim();

if(category !== "nature" && category !== "city"){
alert("Type only: nature or city");
return;
}

let reader = new FileReader();

reader.onload = function(e){
createImage(e.target.result,category,true);
};

reader.readAsDataURL(file);
}

//  SAVE LOCAL 
function saveImages(){
let all = document.querySelectorAll(".gallery img");

let arr = [...all].map(img=>({
src:img.src,
cat: img.classList.contains("city") ? "city":"nature"
}));

localStorage.setItem("hk_gallery",JSON.stringify(arr));
}

//  SHOW IMAGE
function showImage(){
images = document.querySelectorAll(".gallery img");
lightImg.src = images[index].src;
}

// CLOSE
function closeBox(){
lightbox.style.display="none";
clearInterval(autoSlide);
}

//  NEXT PREV 
function change(n){
index += n;
if(index>=images.length) index=0;
if(index<0) index=images.length-1;
showImage();
}

//  AUTO SLIDE 
function startAuto(){
clearInterval(autoSlide);
autoSlide=setInterval(()=>change(1),3000);
}

//  FILTER 
function filterImages(cat){
let imgs=document.querySelectorAll(".gallery img");

imgs.forEach(img=>{
if(cat==="all"){
img.style.display="block";
}
else{
img.style.display = img.classList.contains(cat) ? "block":"none";
}
});
}

//  SEARCH 
function searchImage(){
let val = document.getElementById("search").value.toLowerCase().trim();
let imgs = document.querySelectorAll(".gallery img");

imgs.forEach(img=>{

let isCity = img.classList.contains("city");
let isNature = img.classList.contains("nature");

if(val === "" || val === "all"){
img.style.display="block";
}
else if(val === "city" && isCity){
img.style.display="block";
}
else if(val === "nature" && isNature){
img.style.display="block";
}
else{
img.style.display="none";
}

});
}

//  DOWNLOAD 
function downloadImg(){
let a=document.createElement("a");
a.href=lightImg.src;
a.download="hk_image";
a.click();
}

//  DELETE 
function deleteImg(){
images[index].remove();
closeBox();
saveImages();
}

//DRAG DROP 
document.addEventListener("DOMContentLoaded", function(){

let dropArea = document.getElementById("dropArea");

dropArea.addEventListener("dragover", function(e){
e.preventDefault();
dropArea.classList.add("drag");
});

dropArea.addEventListener("dragleave", function(){
dropArea.classList.remove("drag");
});

dropArea.addEventListener("drop", function(e){
e.preventDefault();
dropArea.classList.remove("drag");

let file = e.dataTransfer.files[0];
if(!file) return;

let category = prompt("Enter category: nature or city");

if(!category){
alert("Category required");
return;
}

category = category.toLowerCase().trim();

if(category !== "nature" && category !== "city"){
alert("Type only nature or city");
return;
}

let reader = new FileReader();

reader.onload = function(ev){
createImage(ev.target.result,category,true);
};

reader.readAsDataURL(file);

});

});
