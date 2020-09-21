// See https://cameronjs.com/stimulus for more info

import { Controller } from "stimulus";

export default class extends Controller {
  static get targets() {
    return ["twitterStream","year"];
  }

  connect() {
    this._setYear();
    this._showTwitterStream();
  }

  _setYear() {
    this.yearTarget.textContent = new Date().getFullYear();
  }

  _showTwitterStream() {
    if (this.hasTwitterStreamTarget) {
      twttr.widgets.createTimeline(
        {
          sourceType: "profile",
          screenName: this.twitterStreamTarget.dataset['profile']
        },
        this.twitterStreamTarget,
        {
          chrome: "noheader nofooter",
          tweetLimit: this.twitterStreamTarget.dataset['limit'],
          borderColor: '#ffffff',
          dnt: true
        }
      );
    }
  }
}
