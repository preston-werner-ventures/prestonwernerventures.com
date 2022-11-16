// See https://cameronjs.com/stimulus for more info

import { Controller } from "stimulus";

export default class extends Controller {
  static get targets() {
    return ['pwvNotice', 'header', 'home', 'twitterStream', 'year', 'contact']
  }

  connect() {
    this.pwv = false
    this.enableNav = false

    if (location.host.match(/prestonwernerventures/)) {
      this.pwvNoticeTarget.classList.toggle('hidden')
      this.pwv = true
    }

    this._setYear();
    this._showTwitterStream();
    this.onScroll()
  }

  toggleContact(e) {
    this.contactTarget.classList.toggle('hidden')
    this.contactTarget.querySelector('input').focus()
    e.preventDefault()
  }

  onScroll(e) {
    if (
      this.pwv ||
      (this.hasHomeTarget && window.scrollY < 200 && !this.enableNav)
    ) {
      this.headerTarget.classList.add('opacity-0')
    } else {
      this.headerTarget.classList.remove('opacity-0')
      this.enableNav = true
    }
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
