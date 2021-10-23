function $(cadena) {
  return document.getElementById(cadena);
}

function crearTabla(item) {
  let nombre = item.nombre;
  let apellido = item.apellido;
  let localidad = item.localidad.nombre;
  let sexo = item.sexo;
  let ID = item.id;
  let flag = 1;

  let tabla = $("tabla");

  if (tabla == null) {
    let tabla = document.createElement("table");
    tabla.setAttribute("id", "tabla");
    let row = document.createElement("tr");
    let cabecera = document.createElement("th");
    let cabecera2 = document.createElement("th");
    let cabecera3 = document.createElement("th");
    let cabecera4 = document.createElement("th");
    let cabecera5 = document.createElement("th");
    let textoID = document.createTextNode("ID ");
    let textoNombre = document.createTextNode("NOMBRE ");
    let textoApellido = document.createTextNode("APELLIDO ");
    let textLocalidad = document.createTextNode("LOCALIDAD ");
    let textSexo = document.createTextNode("SEXO ");

    tabla.appendChild(row);
    row.appendChild(cabecera);
    row.appendChild(cabecera2);
    row.appendChild(cabecera3);
    row.appendChild(cabecera4);
    row.appendChild(cabecera5);
    cabecera.appendChild(textoNombre);
    cabecera2.appendChild(textoApellido);
    cabecera3.appendChild(textLocalidad);
    cabecera4.appendChild(textSexo);
    cabecera5.appendChild(textoID);

    tablaGeneral = $("tablaNueva");
    tablaGeneral.appendChild(tabla);
  }
  if (flag == 1) {
    let row2 = document.createElement("tr");
    let data = document.createElement("td");
    let data2 = document.createElement("td");
    let data3 = document.createElement("td");
    let data4 = document.createElement("td");
    let data5 = document.createElement("td");
    let textoNombre = document.createTextNode(nombre);
    let textoApellido = document.createTextNode(apellido);
    let textLocalidad = document.createTextNode(localidad);
    let textSexo = document.createTextNode(sexo);
    let textID = document.createTextNode(ID);
    row2.appendChild(data);
    row2.appendChild(data2);
    row2.appendChild(data3);
    row2.appendChild(data4);
    row2.appendChild(data5);
    data.appendChild(textoNombre);
    data2.appendChild(textoApellido);
    data3.appendChild(textLocalidad);
    data4.appendChild(textSexo);
    data5.appendChild(textID);

    tabla = document.getElementById("tabla");
    tabla.appendChild(row2);
    tablaGeneral = $("tablaNueva");
    tablaGeneral.appendChild(tabla);
    tabla.addEventListener("click", mostrarPopUp);

    tablaGeneral.addEventListener("click", autoCompletado);
  }
  window.addEventListener("load", () => {
    let btn = document.getElementById("envio");
    btn.addEventListener("click", crearTabla);
  });
}

function modificar(usuario) {
  var xhhtp = new XMLHttpRequest();
  document.getElementById("loader").style.display = "flex";
  document.getElementById("popup").style.display = "none";
  xhhtp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let respuesta = this.response;
      console.log(respuesta);
      let tabla = document.getElementById("tabla");
      tabla.childNodes.forEach((tr) => {
        if (tr.childNodes[4].innerText == parseInt(usuario.id)) {
          console.log(tr.rowIndex);
          console.log(usuario.id);
          console.log(tr.innerHTML);
          tr.childNodes[0].innerHTML = usuario.nombre;
          tr.childNodes[1].innerHTML = usuario.apellido;
          tr.childNodes[2].innerText = usuario.localidad.nombre;
          tr.childNodes[3].innerText = usuario.sexo;
          tr.childNodes[4].innerText = usuario.id;
          document.getElementById("loader").style.display = "none";
        }
      });
    }
  };

  xhhtp.open("POST", "http://localhost:3000/editar", true);
  xhhtp.setRequestHeader("content-type", "application/json");
  xhhtp.send(JSON.stringify(usuario));
}

function eliminar(usuario) {
  var xhhtp = new XMLHttpRequest();
  document.getElementById("loader").style.display = "flex";
  document.getElementById("popup").style.display = "none";
  xhhtp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let respuesta = this.response;
      let tabla = document.getElementById("tabla");
      tabla.childNodes.forEach((tr) => {
        console.log("intento");
        if (tr.childNodes[4].innerText == parseInt(usuario.id)) {
          tabla.removeChild(tr);
          console.log("hola");
          document.getElementById("loader").style.display = "none";
          return;
        }
      });

      console.log(respuesta);
    }
  };

  xhhtp.open("POST", "http://localhost:3000/eliminar", true);
  xhhtp.setRequestHeader("content-type", "application/json");
  xhhtp.send(JSON.stringify(usuario));
}

function traePersonas() {
  var xhhtp = new XMLHttpRequest();
  xhhtp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let respuesta = this.response;
      let personaOBJ = JSON.parse(respuesta);
      // console.log(respuesta);
      for (let item of personaOBJ) {
        crearTabla(item);
      }
    }
  };

  xhhtp.open("GET", "http://localhost:3000/personas", true);
  xhhtp.send();
}

function traerLocalidades() {
  var xhhtp = new XMLHttpRequest();
  xhhtp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let respuesta = this.response;

      // let select = document.createElement("select");
      // select.setAttribute("id", "select");
      let selector = document.getElementById("txtFecha");

      let personaOBJ = JSON.parse(respuesta);
      for (let item of personaOBJ) {
        let opcion = document.createElement("option");
        selector.appendChild(opcion);
        opcion.innerHTML = item.nombre;

        document.getElementById("contenidoPopUp").appendChild(selector);
      }
    }
  };

  xhhtp.open("GET", "http://localhost:3000/localidades", true);
  xhhtp.send();
}

function modificarPersona() {
  let $nombre = document.getElementById("txtNombre").value;
  let $apellido = document.getElementById("txtApellido").value;
  let $sexo = document.getElementsByName("sexo");
  // console.log(sexo.length);
  for (i = 0; i < $sexo.length; i++) {
    if ($sexo[i].checked) {
      //var memory=memo[i].checked;
      $genero = $sexo[i].value;
      // console.log($genero);
    }
  }

  let $localidad = document.getElementsByName("localidades");
  let $ID = document.getElementById("txtID").value;

  if (validarNombre($nombre) && validarApellido($apellido)) {
    let usuarioModificado = {
      id: $ID,
      nombre: $nombre,
      apellido: $apellido,
      localidad: { id: 5, nombre: $localidad[0].value },
      sexo: $genero,
    };

    modificar(usuarioModificado);
  }
}

function eliminarPersona() {
  let $nombre = document.getElementById("txtNombre").value;
  let $apellido = document.getElementById("txtApellido").value;
  let $sexo = document.getElementsByName("sexo");
  // console.log(sexo.length);
  for (i = 0; i < $sexo.length; i++) {
    if ($sexo[i].checked) {
      //var memory=memo[i].checked;
      $genero = $sexo[i].value;
      // console.log($genero);
    }
  }
  let $fecha = document.getElementById("txtFecha").value;
  let $ID = document.getElementById("txtID").value;

  let usuarioModificado = {
    id: $ID,
    nombre: $nombre,
    apellido: $apellido,
    fecha: $fecha,
    sexo: $genero,
  };

  eliminar(usuarioModificado);
}

window.addEventListener("load", () => {
  let btn = document.getElementById("modificar");
  btn.addEventListener("click", modificarPersona);
});

// window.addEventListener("load", () => {
//   let btn = document.getElementById("eliminar");
//   btn.addEventListener("click", eliminarPersona);
//   // btn.addEventListener("click", eliminarRow);
// });

// // LOCALIDADES
// window.addEventListener("load", () => {
//   let btn = document.getElementById("traerPersonas");
//   btn.addEventListener("click", traerLocalidad);
//   // btn.addEventListener("click", eliminarRow);
// });

window.addEventListener("load", () => {
  let btn = document.getElementById("traerPersonas");
  btn.addEventListener("click", () => {
    document.getElementById("traerPersonas").style.display = "none";
  });
});

// funcion solo para probar
function eliminarRow() {
  let tabla = document.getElementById("tabla");
  tabla.childNodes.forEach((value) => {
    console.log(value.rowIndex + 1);
  });
}

function mostrarPopUp() {
  document.getElementById("popup").style.display = "block";
}

function cerrarPopUp() {
  document.getElementById("popup").style.display = "none";
}

function autoCompletado(e) {
  document.getElementById("txtID").value =
    e.target.parentNode.lastChild.innerHTML;
  document.getElementById("txtNombre").value =
    e.target.parentNode.firstChild.innerHTML;
  document.getElementById("txtApellido").value =
    e.target.parentNode.firstChild.nextSibling.innerHTML;

  let sexo = e.target.parentNode.lastChild.previousSibling.innerHTML;
  // console.log(sexo);
  if (sexo == "Male") {
    document.getElementById("txtSexoH").checked = true;
  } else {
    document.getElementById("txtSexoM").checked = true;
  }

  traerLocalidades();

}

function validarNombre(x) {
  if (x.length >= 6) {
    return x;
  }
  alert("Nombre no cumple el minimo d 6");
  return false;
}

function validarApellido(x) {
  if (x.length >= 6) {
    return x;
  }
  alert("Nombre no cumple el minimo d 6");
  return false;
}
