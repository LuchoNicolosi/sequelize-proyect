import path from 'path';

export default path.dirname(process.mainModule.filename); //Obtengo el directorio raiz del proyecto para situarme en /, y luego entrar a cualquiera de las carpetas hermanas (models,public,viws,routes, etc...), esta funcion es util para no tener inconveniente en ningun sistema operativo
