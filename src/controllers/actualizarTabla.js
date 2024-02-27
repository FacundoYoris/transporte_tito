import connection from "../database/db.js";
import express from 'express'


const rangoFechas = (req, res)=>{
    const fechaInicio = req.body.fechaInicio;
    const fechaFin = req.body.fechaFin;
    
    
    const inicio = fechaInicio.split('-');
    const anioInicio=inicio[0];
    const mesInicio=inicio[1];
    const diaInicio=inicio[2];

    const fin = fechaFin.split('-');
    const anioFin=fin[0];
    const mesFin=fin[1];
    const diaFin=fin[2];

    const segundosInicio = new Date(anioInicio,mesInicio,diaInicio).getTime();
    const segundosFin = new Date(anioFin,mesFin,diaFin).getTime();
    let ordenesFiltradas=[];
    connection.query('SELECT * FROM orden_trabajo', (error, results)=>{
       if(error){
          console.log(error);
       }else{
         for (let i = 0; i < results.length; i++) {
            const dia = results[i].fecha_inicio.split('-')[2].split('T')[0];
            const mes = results[i].fecha_inicio.split('-')[1];
            const anio = results[i].fecha_inicio.split('-')[0];
            const segundosActual = new Date(anio,mes,dia).getTime();
            if(segundosActual >= segundosInicio && segundosActual <= segundosFin){
               ordenesFiltradas.push(results[i]);
            }
            if(i==results.length-1){
               res.render('nuevaTablaFiltrada.ejs', { results: ordenesFiltradas,"login": req.session.loggedImAdmin});
            }
          }
      
       }
    })
 };
 

 const rangoFechasPendientes = (req, res)=>{
   const fechaInicio = req.body.fechaInicio;
   const fechaFin = req.body.fechaFin;
   
   const inicio = fechaInicio.split('-');
   const anioInicio=inicio[0];
   const mesInicio=inicio[1];
   const diaInicio=inicio[2];

   const fin = fechaFin.split('-');
   const anioFin=fin[0];
   const mesFin=fin[1];
   const diaFin=fin[2];

   const segundosInicio = new Date(anioInicio,mesInicio,diaInicio).getTime();
   const segundosFin = new Date(anioFin,mesFin,diaFin).getTime();
   let ordenesFiltradas=[];
   connection.query('SELECT * FROM orden_trabajo WHERE estado = ?', ['Pendiente'] , (error, results)=>{
      if(error){
         console.log(error);
      }else{
        for (let i = 0; i < results.length; i++) {
         const dia = results[i].fecha_inicio.split('-')[2].split('T')[0];
         const mes = results[i].fecha_inicio.split('-')[1];
         const anio = results[i].fecha_inicio.split('-')[0];
           const segundosActual = new Date(anio,mes,dia).getTime();
           if(segundosActual >= segundosInicio && segundosActual <= segundosFin){
              ordenesFiltradas.push(results[i]);
           }
           if(i==results.length-1){
              res.render('nuevaTablaFiltrada.ejs', { results: ordenesFiltradas,"login": req.session.loggedImAdmin});
           }
         }
     
      }
   })
};

const rangoFechasEnProceso = (req, res)=>{
   const fechaInicio = req.body.fechaInicio;
   const fechaFin = req.body.fechaFin;
   
   const inicio = fechaInicio.split('-');
   const anioInicio=inicio[0];
   const mesInicio=inicio[1];
   const diaInicio=inicio[2];

   const fin = fechaFin.split('-');
   const anioFin=fin[0];
   const mesFin=fin[1];
   const diaFin=fin[2];

   const segundosInicio = new Date(anioInicio,mesInicio,diaInicio).getTime();
   const segundosFin = new Date(anioFin,mesFin,diaFin).getTime();
   let ordenesFiltradas=[];
   connection.query('SELECT * FROM orden_trabajo WHERE estado = ?', ['En proceso'] , (error, results)=>{
      if(error){
         console.log(error);
      }else{
        for (let i = 0; i < results.length; i++) {
            const dia = results[i].fecha_inicio_real.split('-')[2].split('T')[0];
            const mes = results[i].fecha_inicio_real.split('-')[1];
            const anio = results[i].fecha_inicio_real.split('-')[0];
           const segundosActual = new Date(anio,mes,dia).getTime();
           if(segundosActual >= segundosInicio && segundosActual <= segundosFin){
              ordenesFiltradas.push(results[i]);
           }
           if(i==results.length-1){
              res.render('nuevaTablaFiltradaEnProceso.ejs', { results: ordenesFiltradas,"login": req.session.loggedImAdmin});
           }
         }
     
      }
   })
};

const rangoFechasFinalizadas = (req, res)=>{
   const fechaInicio = req.body.fechaInicio;
   const fechaFin = req.body.fechaFin;
   
   const inicio = fechaInicio.split('-');
   const anioInicio=inicio[0];
   const mesInicio=inicio[1];
   const diaInicio=inicio[2];

   const fin = fechaFin.split('-');
   const anioFin=fin[0];
   const mesFin=fin[1];
   const diaFin=fin[2];

   const segundosInicio = new Date(anioInicio,mesInicio,diaInicio).getTime();
   const segundosFin = new Date(anioFin,mesFin,diaFin).getTime();
   let ordenesFiltradas=[];
   connection.query('SELECT * FROM orden_trabajo WHERE estado = ?', ['Finalizada'] , (error, results)=>{
      if(error){
         console.log(error);
      }else{
        for (let i = 0; i < results.length; i++) {
            const dia = results[i].fecha_fin.split('-')[2].split('T')[0];
            const mes = results[i].fecha_fin.split('-')[1];
            const anio = results[i].fecha_fin.split('-')[0];
           const segundosActual = new Date(anio,mes,dia).getTime();
           if(segundosActual >= segundosInicio && segundosActual <= segundosFin){
              ordenesFiltradas.push(results[i]);
           }
           if(i==results.length-1){
              res.render('nuevaTablaFiltradaFinalizada.ejs', { results: ordenesFiltradas,"login": req.session.loggedImAdmin});
           }
         }
     
      }
   })
};

const rangoFechasGestion = (req, res)=>{
   const fechaInicio = req.body.fechaInicio;
   const fechaFin = req.body.fechaFin;
   
   const inicio = fechaInicio.split('-');
   const anioInicio=inicio[0];
   const mesInicio=inicio[1];
   const diaInicio=inicio[2];

   const fin = fechaFin.split('-');
   const anioFin=fin[0];
   const mesFin=fin[1];
   const diaFin=fin[2];

   const segundosInicio = new Date(anioInicio,mesInicio,diaInicio).getTime();
   const segundosFin = new Date(anioFin,mesFin,diaFin).getTime();
   let ordenesFiltradas=[];
   connection.query('SELECT * FROM orden_trabajo', (error, results)=>{
      if(error){
         console.log(error);
      }else{
        for (let i = 0; i < results.length; i++) {
            const dia = results[i].fecha_inicio.split('-')[2].split('T')[0];
            const mes = results[i].fecha_inicio.split('-')[1];
            const anio = results[i].fecha_inicio.split('-')[0];
           const segundosActual = new Date(anio,mes,dia).getTime();
           if(segundosActual >= segundosInicio && segundosActual <= segundosFin){
              ordenesFiltradas.push(results[i]);
           }
           if(i==results.length-1){
              res.render('nuevaTablaFiltrada.ejs', { results: ordenesFiltradas,"login": req.session.loggedImAdmin});
           }
         }
     
      }
   })
};
 export default {
    rangoFechas,
    rangoFechasEnProceso,
    rangoFechasFinalizadas,
    rangoFechasPendientes,
    rangoFechasGestion,
 };