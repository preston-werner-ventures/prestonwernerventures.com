import { Controller } from "stimulus";

export default class extends Controller {
  static get targets() {
    return ["nav"];
  }

  toggle() {
    this.navTarget.classList.toggle("hidden");
  }
}
