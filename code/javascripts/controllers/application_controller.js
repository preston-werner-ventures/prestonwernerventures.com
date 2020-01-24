// See https://cameronjs.com/stimulus for more info

import { Controller } from "stimulus";

export default class extends Controller {
  static get targets() {
    return ["year"];
  }

  connect() {
    this._setYear();
  }

  _setYear() {
    this.yearTarget.textContent = new Date().getFullYear();
  }
}
