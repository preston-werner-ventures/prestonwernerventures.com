import { Controller } from "stimulus";

export default class extends Controller {
  static get targets() {
    return ["nav"];
  }

  toggle(event) {
    event.preventDefault();
    this.navTarget.classList.toggle("hidden");
  }
}
