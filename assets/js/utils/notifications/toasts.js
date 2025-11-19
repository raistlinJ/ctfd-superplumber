import Alpine from "alpinejs";
import { Toast } from "../bootstrap";
import CTFd from "../../index";

const ensureToastStore = () => {
  if (!Alpine.store("toast")) {
    Alpine.store("toast", { title: "", html: "" });
  }
};

ensureToastStore();

if (typeof document !== "undefined") {
  document.addEventListener("alpine:init", ensureToastStore, { once: true });
}

export default () => {
  ensureToastStore();

  CTFd._functions.events.eventToast = data => {
    Alpine.store("toast", data);
    let toast = new Toast(document.querySelector("[x-ref='toast']"));
    // TODO: Get rid of this private attribute access
    // See https://github.com/twbs/bootstrap/issues/31266
    let close = toast._element.querySelector("[data-bs-dismiss='toast']");
    let handler = event => {
      CTFd._functions.events.eventRead(data.id);
    };
    close.addEventListener("click", handler, { once: true });
    toast._element.addEventListener(
      "hidden.bs.toast",
      event => {
        close.removeEventListener("click", handler);
      },
      { once: true },
    );

    toast.show();
  };
};
