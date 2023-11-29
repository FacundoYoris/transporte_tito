// import database from '../database/db.js'
// import express from 'express'

// document.getElementById("btn_formulario_contacto").addEventListener("click",contacto);
// document.getElementById("btn_iniciar_sesion").addEventListener("click",IniciarSesion);
// window.addEventListener("resize", anchoPagina);
// //Declaración de variables
// var contenedor_delantero = document.querySelector(".contenedor_delantero");
// var formulario_login = document.querySelector(".formulario_login");
// var formulario_contacto = document.querySelector(".formulario_contacto");
// var seccion_login = document.querySelector(".seccion_login");
// var seccion_contacto = document.querySelector(".seccion_contacto");

// function anchoPagina(){
//     if(window.innerWidth > 850){
//         seccion_login.style.display = "block";
//         seccion_contacto.style.display = "block";
//     }else {
//         seccion_contacto.style.display = "block";
//         seccion_contacto.style.opacity = "1";
//         seccion_login.style.display = "none";
//         formulario_login.style.display = "block";
//         contenedor_delantero.style.left = "0px";
//         formulario_contacto.style.display = "none";
       
//     }
// }
// anchoPagina();//Para que cuando se recarga la pagina se ejecute y no me quede todas las letras superpuestas
// function IniciarSesion(){
//     if(window.innerWidth > 850){
//         formulario_contacto.style.display = "none";
//         contenedor_delantero.style.left = "10px";
//         formulario_login.style.display = "block";
//         seccion_contacto.style.opacity = "1";
//         seccion_login.style.opacity = "0";
//     } else {
//         formulario_contacto.style.display = "none";
//         contenedor_delantero.style.left = "0px";
//         formulario_login.style.display = "block";
//         seccion_contacto.style.display = "block";
//         seccion_login.style.display = "none";
//     }
// }
// function contacto(){
//     if(window.innerWidth > 850){
//         formulario_contacto.style.display = "block";
//         contenedor_delantero.style.left = "410px";
//         formulario_login.style.display = "none";
//         seccion_contacto.style.opacity = "0";
//         seccion_login.style.opacity = "1";
//     } else {
//         formulario_contacto.style.display = "block";
//         contenedor_delantero.style.left = "0px";
//         formulario_login.style.display = "none";
//         seccion_contacto.style.display = "none";
//         seccion_login.style.display = "block";
//         seccion_login.style.opacity = "1";
//     }
// }


/////////////////////////////////////////////////////////////
document.getElementById("btn_formulario_contacto").addEventListener("click",contacto);
document.getElementById("btn_iniciar_sesion").addEventListener("click",IniciarSesion);
window.addEventListener("resize", anchoPagina);
//Declaración de variables
var contenedor_delantero = document.querySelector(".contenedor_delantero");
var formulario_login = document.querySelector(".formulario_login");
var formulario_contacto = document.querySelector(".formulario_contacto");
var seccion_login = document.querySelector(".seccion_login");
var seccion_contacto = document.querySelector(".seccion_contacto");

function anchoPagina(){
    if(window.innerWidth > 850){
        seccion_login.style.display = "block";
        seccion_contacto.style.display = "block";
    }else {
        seccion_contacto.style.display = "block";
        seccion_contacto.style.opacity = "1";
        seccion_login.style.display = "none";
        formulario_login.style.display = "block";
        contenedor_delantero.style.left = "0px";
        formulario_contacto.style.display = "none";
       
    }
}
anchoPagina();//Para que cuando se recarga la pagina se ejecute y no me quede todas las letras superpuestas
function IniciarSesion(){
    if(window.innerWidth > 850){
        formulario_contacto.style.display = "none";
        contenedor_delantero.style.left = "10px";
        formulario_login.style.display = "block";
        seccion_contacto.style.opacity = "1";
        seccion_login.style.opacity = "0";
    } else {
        formulario_contacto.style.display = "none";
        contenedor_delantero.style.left = "0px";
        formulario_login.style.display = "block";
        seccion_contacto.style.display = "block";
        seccion_login.style.display = "none";
    }
}
function contacto(){
    if(window.innerWidth > 850){
        formulario_contacto.style.display = "block";
        contenedor_delantero.style.left = "410px";
        formulario_login.style.display = "none";
        seccion_contacto.style.opacity = "0";
        seccion_login.style.opacity = "1";
    } else {
        formulario_contacto.style.display = "block";
        contenedor_delantero.style.left = "0px";
        formulario_login.style.display = "none";
        seccion_contacto.style.display = "none";
        seccion_login.style.display = "block";
        seccion_login.style.opacity = "1";
    }
}