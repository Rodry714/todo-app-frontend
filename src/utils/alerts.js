import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const showAddTaskModal = async () => {
  const { value: formValues } = await Swal.fire({
    title: "Agrega una nueva tarea",
    html:
      '<input id="swal-title" class="swal2-input" placeholder="Titulo de tu tarea">' +
      '<textarea id="swal-desc" class="swal2-textarea" placeholder="Descripcion de tu tarea"></textarea>',
    focusConfirm: false,
    confirmButtonText: "Save",
    showCancelButton: true,
    preConfirm: () => {
      const title = document.getElementById("swal-title").value;
      const description = document.getElementById("swal-desc").value;
      if (!title) {
        Swal.showValidationMessage("Title is required");
        return false;
      }
      return { title, description };
    },
  });

  return formValues;
};

export const showEditTaskModal = async (task) => {
  const { value: formValues } = await Swal.fire({
    title: "Editar tarea",
    html:
      `<input id="swal-title" class="swal2-input" placeholder="Titulo de tu tarea" value="${task.title}">` +
      `<textarea id="swal-desc" class="swal2-textarea" placeholder="Descripcion de tu tarea">${task.description || ''}</textarea>`,
    focusConfirm: false,
    confirmButtonText: "Guardar",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const title = document.getElementById("swal-title").value;
      const description = document.getElementById("swal-desc").value;
      if (!title) {
        Swal.showValidationMessage("El título es requerido");
        return false;
      }
      return { title, description };
    },
  });

  return formValues;
};

export const showConfirmDelete = async () => {
  const result = await Swal.fire({
    title: "¿Eliminar tarea?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  return result.isConfirmed;
};
