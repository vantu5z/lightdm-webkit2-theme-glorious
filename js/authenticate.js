
class Authenticate {
	constructor() {
		this._localStorage = window.localStorage;
		this._passwordBox = document.querySelector('#input-password-box');
		this._passwordInput = document.querySelector('#input-password');
		this._buttonAuthenticate = document.querySelector('#button-authenticate');
		this._passwordInputContainer = document.querySelector('#input-password-container');
		this._tooltipPassword = document.querySelector('#tooltip-password');
		this._password = '';
		
		this._init();
	}

	_returnRandomErrorMessages() {
		const randomMsg = JSON.parse(this._localStorage.getItem('randomMsg')) || false;
		const errorMessages = language._getErrorMessages();
		if (randomMsg) {
			return errorMessages[Math.floor(Math.random() * errorMessages.length)];
		} else {
			return errorMessages[0];
		}
	}

	_returnRandomSuccessfulMessages() {
		const randomMsg = JSON.parse(this._localStorage.getItem('randomMsg')) || false;
		const successfulMessages = language._getSuccessfulMessages();
		if (randomMsg) {
			return successfulMessages[Math.floor(Math.random() * successfulMessages.length)];
		} else {
			return successfulMessages[0];
		}
	}

	// Start authentication
	startAuthentication() {
		lightdm.cancel_authentication();
		lightdm.authenticate(String(accounts.getDefaultUserName()));
	}

	// Timer expired, create new authentication session
	_autologinTimerExpired() {
		window.autologin_timer_expired = () => {
			this.startAuthentication();
		};
	}

	// Authentication completed callback
	_authenticationComplete() {
		window.authentication_complete = () => {
			if (lightdm.is_authenticated) {
				this._authenticationSuccess();
			} else {
				this._authenticationFailed();
			}
		};
	}

	// You passed to authentication
	_authenticationSuccess() {
		this._password = null;

		// Make password input read-only
		this._passwordInput.readOnly = true;
		this._passwordInput.blur();
		
		// Success messages
		this._passwordBox.classList.add('authentication-success');
		this._tooltipPassword.innerText = this._returnRandomSuccessfulMessages();
		this._tooltipPassword.classList.add('tooltip-success');

		setTimeout(
			() => {
				loginFade.showLoginFade();
			},
			500
		);

		// Add a delay before unlocking
		setTimeout(
			() => {
				var defSession = String(sessions.getDefaultSession());
				console.log(defSession);
				this._buttonAuthenticate.classList.remove('authentication-success');
				lightdm.start_session(defSession);
				this._tooltipPassword.classList.remove('tooltip-success');
			},
			1000
		);
	}

	// Remove authentication failure messages
	_authFailedRemove() {
		this._tooltipPassword.classList.remove('tooltip-error');
		this._passwordBox.classList.remove('authentication-failed');
	}

	// You failed to authenticate
	_authenticationFailed() {
		this._password = null;

		// New authentication session
		this.startAuthentication();
		this._passwordInput.value = '';

		// Error messages/UI
		this._passwordBox.classList.add('authentication-failed');
		this._tooltipPassword.innerText = this._returnRandomErrorMessages();
		this._tooltipPassword.classList.add('tooltip-error');

		// Shake animation
		this._passwordInputContainer.classList.add('shake');
		setTimeout(
			() => {
				// Stop shaking
				this._passwordInputContainer.classList.remove('shake');
			},
			500
		);
	}

	// Register keyup event
	_buttonAuthenticateClickEvent() {
		this._buttonAuthenticate.addEventListener(
			'click',
			() => {
				//console.log(lightdm.in_authentication);
				//console.log("Auth: " + lightdm.is_authenticated);
				this._authFailedRemove();
				this._password = this._passwordInput.value;
				lightdm.respond(String(this._password));
			}
		);
	}

	// Register keydown event
	_passwordInputKeyDownEvent() {
		this._passwordInput.addEventListener(
			'keydown',
			e => {
				this._authFailedRemove();
				this._password = this._passwordInput.value;
				if (e.key === 'Enter') {
					lightdm.respond(String(this._password));
				}
			}
		);
	}

	_init() {
		this._autologinTimerExpired();
		this._authenticationComplete();
		this._buttonAuthenticateClickEvent();
		this._passwordInputKeyDownEvent();
		if (!lightdm) {
			lightdm.onload = function() {
				console.log('Start authentication');
				this.startAuthentication();
			};
		} else {
			console.log('Start authentication');
			this.startAuthentication();
		}
	}
}
