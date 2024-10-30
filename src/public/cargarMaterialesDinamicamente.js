let filaActual = 0;

document.querySelectorAll(".add-material").forEach((button) => {
    button.addEventListener("click", function () {
        const orderId = this.getAttribute("data-order-id");
        const container = document.getElementById(`material-container-${orderId}`);
        const filas = container.querySelectorAll(".material-row");

        if (filaActual < filas.length) {
            const fila = filas[filaActual];
            fila.style.display = "flex"; // Mostrar la fila actual
            filaActual++; // Incrementar el contador para la siguiente fila
        } else {
            console.log("No hay más filas para mostrar");
        }
    });
});

function eliminar(button) {
    const row = button.closest(".material-row");
    if (row) {
        row.style.display = "none";
        filaActual--; // Decrementar el contador de filas visibles
    }
}

// Validación solo de filas visibles
document
    .getElementById("orderForm")
    .addEventListener("submit", function (event) {
        const filas = document.querySelectorAll(".material-row");
        let esValido = true;

        filas.forEach((row) => {
            if (row.style.display === "flex") {
                const input = row.querySelector("input[type='number']");
                if (input && input.value <= 0) {
                    esValido = false;
                    input.classList.add("is-invalid");
                    alert(
                        "Las cantidades deben ser mayores a 0 para los materiales que deseas utilizar."
                    );
                } else {
                    input.classList.remove("is-invalid");
                }
            }
        });

        if (!esValido) {
            event.preventDefault();
        }
    });
