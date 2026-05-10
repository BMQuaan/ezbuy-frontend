import Swal from "sweetalert2";

/**
 * Hiển thị hộp thoại xác nhận hành động sản phẩm.
 * @param actionType "add" | "edit" | "delete"
 * @returns true nếu người dùng xác nhận, false nếu hủy.
 */
export async function confirmProductAction(
  actionType: "add" | "edit" | "delete"
): Promise<boolean> {
  let title = "";
  let text = "";
  let confirmButtonText = "";
  let icon: "question" | "warning" = "question";
  let confirmButtonColor = "#0e7cc9"; // Màu xanh mặc định (EZBuy)

  switch (actionType) {
    case "add":
      title = "Add new product";
      text = "Are you sure you want to add this product?";
      confirmButtonText = "Yes, add";
      break;

    case "edit":
      title = "Edit product";
      text = "Are you sure you want to save the changes to this product?";
      confirmButtonText = "Yes, save changes";
      break;

    case "delete":
      title = "Delete product";
      text = "This action cannot be undone. Do you really want to delete this product?";
      confirmButtonText = "Yes, delete";
      icon = "warning";
      confirmButtonColor = "#d33"; // đỏ cho hành động xóa
      break;

    default:
      // giúp TS đảm bảo exhaustiveness check
      const exhaustiveCheck: never = actionType;
      throw new Error(`Invalid action type: ${exhaustiveCheck}`);
  }

  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancel",
    confirmButtonColor,
    reverseButtons: true,
  });

  return result.isConfirmed;
}
