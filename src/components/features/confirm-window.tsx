import "animate.css"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

export const ConfirmWindow = async (title: string, text?: string): Promise<boolean> => {
  const result = await MySwal.fire({
    title: `<h4 class="text-lg text-left">${title}</h4>`,
    html: text ? `<p class="text-base text-left opacity-[0.7]">${text}</p>` : "",
    // icon: "question",
    showClass: { popup: "animate__animated animate__fadeIn animate__zoomIn animate__faster" },
    hideClass: { popup: "animate__animated animate__fadeOut animate__zoomOut animate__faster" },
    showCancelButton: true,
    cancelButtonText: "Закрити",
    confirmButtonText: "Продовжити",
    backdrop: "color-mix(in oklab, var(--color-black) 80%, transparent)",
    customClass: {
      title: "!px-4",
      popup: "!rounded-none !z-60",
      htmlContainer: "!px-4 !pt-2",
      container: "!z-60",
      actions: "!mt-4 !mr-4 justify-end !gap-2 w-full",
      confirmButton:
        "!bg-destructive !text-white !rounded-none !h-10 !px-4 !py-2 !m-0 !hover:bg-destructive/90 !focus-visible:ring-destructive/20",
      cancelButton:
        "!bg-background !text-sidebar-foreground !border !border-border !rounded-none !h-10 !px-4 !py-2 !m-0  !hover:bg-accent !hover:text-accent-foreground",
    },
  })

  return result.isConfirmed
}
