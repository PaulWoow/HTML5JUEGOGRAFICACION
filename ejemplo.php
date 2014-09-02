<!DOCTYPE html>
<html>
    <head>
        <title>Funcion Parabola</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="js/ejecutar.js"></script>
        <link rel="stylesheet" href="css/estilos.css">
    </head>
    <body lang='es'>
    <header>
        <h1>Calculo de la Funcion Parabola.-</h1>
    </header>
        <section>
            <article>
              Nombre: Paul Landazuri
              <br/>
              Fecha: 2014-09-02
              <br/>
            </article>
        </section>
        <form>
            <label> Ingrese la Velocidad (m/s): </label>
            </br>
            <input type="number" min="0" max="10" id="velocidadTXT" required>
            <br>
            
            <label> Ingrese el Angulo (grados): </label>
            <br>
            <input type="number" min="0" max="10" id="anguloTxt" required><br>
            <br>
            <div id="principal">
            <input type="button" name='Aceptar' value="Aceptar"><br>
            </div>
        </form>
        <div id="resultado">
           <input type="text" name='resp' value="RESPUESTA..." size="150">
        </div>
    </body>
</html>