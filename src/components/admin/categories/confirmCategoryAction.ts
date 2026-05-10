import Swal from "sweetalert2";

export async function confirmCategoryAction(actionType: string) {
  let actionText = "";
  let confirmButton = "";
  let title = "";
  let icon: "question" | "warning" = "question";
  let confirmButtonColor = "#0e7cc9"; // Màu mặc định (xanh)

  switch (actionType) {
    case "add":
      title = "Add new category";
      actionText = "add this category";
      confirmButton = "Yes, add";
      break;

    case "edit":
      title = "Edit category";
      actionText = "edit this category";
      confirmButton = "Yes, save changes";
      break;

    case "delete":
      title = "Delete category";
      actionText = "delete this category";
      confirmButton = "Yes, delete";
      icon = "warning";
      confirmButtonColor = "#d33"; // Đỏ cho hành động xóa
      break;

    default:
      throw new Error("Invalid action type");
  }

  const result = await Swal.fire({
    title,
    text: `Are you sure you want to ${actionText}?`,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmButton,
    cancelButtonText: "Cancel",
    confirmButtonColor,
  });

  return result.isConfirmed;
}
