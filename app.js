  //Inicio de escritura
  const InitialByte = parseInt(inodeList[id-1].finalByte);

  //creo el bloque datos o buffer
  let bufferEspecifico = Buffer.alloc(80);
  bufferEspecifico.write(`${id}-${data}-${ActualDate()}-`);
  let dataFinal = bufferEspecifico.toString('base64'); 

  //Se sobreescribe la data    
  await handle.write(dataFinal, InitialByte);

  //actualizo la lista
  await UpdateMainData(id);