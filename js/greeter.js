class GreeterScreen {
	constructor() {
		this._localStorage = window.localStorage;
		this._screenGreeter = document.querySelector('#screen-greeter');
		this._passwordInput = document.querySelector('#input-password');
		this._buttonScreenGreeter = document.querySelector('#button-greeter-screen');
		this._arrowIndicatorGreeter = document.querySelector('#arrow-indicator-greeter');
		this._screenGreeterVisible = true;
		this._buttonGreeterClickEvent();
		this._arrowIndicatorClickEvent();

		this._init();
	}

	_init() {
		const autoHideGreeter = JSON.parse(this._localStorage.getItem('autoHideGreeter')) || false;
		if (autoHideGreeter) {
			this._hideGreeter();
		}
	}

	getGreeterVisibility() {
		return this._screenGreeterVisible;
	}

	_buttonGreeterClickEvent() {
		this._buttonScreenGreeter.addEventListener(
			'click',
			() => {
				this._showGreeter();
			}
		);
	}

	_arrowIndicatorClickEvent() {
		this._arrowIndicatorGreeter.addEventListener(
			'click',
			() => {
				this._hideGreeter();
			}
		);
	}

	_showGreeter() {
		userProfile.rotateProfilePicture();
		this._screenGreeter.classList.remove('screen-greeter-hide');
		this._passwordInput.blur();
		this._screenGreeterVisible = true;
	}

	_hideGreeter() {
		userProfile.rotateProfilePicture();
		this._screenGreeter.classList.add('screen-greeter-hide');
		this._passwordInput.focus();
		this._screenGreeterVisible = false;
	}

	toggleGreeter() {
		if (!this._screenGreeterVisible) {
			this._showGreeter();
		} else {
			this._hideGreeter();
		}
	}
}
