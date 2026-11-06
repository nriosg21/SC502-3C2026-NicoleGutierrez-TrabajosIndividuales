
/* BLOOM CAFÉ - FUNCIONALIDADES */

// 1. BOTÓN DE BIENVENIDA

const botonBienvenida =
    document.getElementById("botonBienvenida");

const mensajeBienvenida =
    document.getElementById("mensajeBienvenida");

function mostrarBienvenida() {
    mensajeBienvenida.textContent =
        "¡Bienvenido a Bloom Café! ☕ Gracias por visitarnos.";
}

botonBienvenida.addEventListener("click", mostrarBienvenida);


// 2. FORMULARIO DE CONTACTO

const formulario =
    document.getElementById("formularioContacto");

const nombre =
    document.getElementById("nombre");

const correo =
    document.getElementById("correo");

const respuestaFormulario =
    document.getElementById("respuestaFormulario");

function validarFormulario(evento) {
    evento.preventDefault();

    const nombreIngresado = nombre.value.trim();
    const correoIngresado = correo.value.trim();

    if (nombreIngresado === "" || correoIngresado === "") {
        respuestaFormulario.textContent =
            "Por favor, completá tu nombre y correo.";
        respuestaFormulario.style.color = "#c0392b";

    } else if (!correo.validity.valid) {
        respuestaFormulario.textContent =
            "Ingresá un correo electrónico válido.";
        respuestaFormulario.style.color = "#c0392b";

    } else {
        respuestaFormulario.textContent =
            "¡Gracias, " + nombreIngresado +
            "! Tu mensaje fue registrado en esta demostración.";
        respuestaFormulario.style.color = "#27845d";

        formulario.reset();
    }
}

formulario.addEventListener("submit", validarFormulario);


// 3. CALCULADORA DE PEDIDOS

const productoSeleccionado =
    document.getElementById("productoSeleccionado");

const cantidad =
    document.getElementById("cantidad");

const botonCalcular =
    document.getElementById("botonCalcular");

const resultadoCalculo =
    document.getElementById("resultadoCalculo");

function calcularPedido() {
    const precio = Number(productoSeleccionado.value);
    const unidades = Number(cantidad.value);

    if (
        cantidad.value.trim() === "" ||
        !Number.isInteger(unidades) ||
        unidades <= 0
    ) {
        resultadoCalculo.textContent =
            "Ingresá una cantidad válida mayor que cero.";
        resultadoCalculo.style.color = "#c0392b";

    } else {
        const total = precio * unidades;

        const totalFormateado = total.toLocaleString(
            "es-CR",
            {
                style: "currency",
                currency: "CRC",
                maximumFractionDigits: 0
            }
        );

        resultadoCalculo.textContent =
            "Total de tu pedido: " + totalFormateado;

        resultadoCalculo.style.color = "";
    }
}

botonCalcular.addEventListener("click", calcularPedido);


// 4. CAMBIO DINÁMICO DE TEMA

const botonTema =
    document.getElementById("botonTema");

function cambiarTema() {
    document.body.classList.toggle("tema-oscuro");

    const oscuro =
        document.body.classList.contains("tema-oscuro");

    if (oscuro) {
        botonTema.textContent = "☀ Tema claro";
    } else {
        botonTema.textContent = "☾ Tema oscuro";
    }
}

botonTema.addEventListener("click", cambiarTema);
