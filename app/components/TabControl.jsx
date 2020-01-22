const React = require('react');
const i18n = window.loadTimeData.data_ || window.loadTimeData.conf;

window.updateSendDownloadLinkToMobileResult = (res) => {
	window.mobileCb(res);
}

class TabsControl extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			slideIndex: 0,
			maySetDefault: true,
			isDefaulted: false
		};
		this.setSlideIndex = this.setSlideIndex.bind(this);
		this.getNewSlideIndex = this.getNewSlideIndex.bind(this);
		this.runAutomatic = this.runAutomatic.bind(this);
	};

	componentWillUnmount() {
		if (this.automaticInterval) clearInterval(this.automaticInterval);
	}


	componentDidMount() {
		window.mobileCb = this.updateMobile.bind(this);
		cr.sendWithPromise('requestDefaultBrowserState').then((res) => {
			this.setState({
				isDefaulted: res.isDefault
			});
		});
		if (this.props.mode === "automatic") {
			const timeout = this.props.timeout || 5000;

			this.automaticInterval = setInterval(
				() => this.runAutomatic(),
				Number.parseInt(timeout)
			);
		}
		cr.addWebUIListener('browser-default-state-changed', (res) => {
			this.setState({
				isDefaulted: res.isDefault
			});
		});
	}

	updateMobile(res) {
		if(res) {
			this.succMess.innerText = i18n.welcomePageSendLinkToMobileSuccessMessage;
			this.errMess.innerText = '';
		} else {
			this.errMess.innerText = i18n.welcomePageSendLinkToMobileErrorMessage;
			this.succMess.innerText = '';
		}
	}

	getTitleItemClass(index) {
		return index === this.state.slideIndex ? "slider-block active" : "slider-block";
	}

	getContentItemClass(index) {
		return index === this.state.slideIndex ? "slider active" : "slider";
	}
	setSlideIndex(index) {
		this.setState({
			slideIndex: index
		})
		const timeout = this.props.timeout || 10000;
		clearInterval(this.automaticInterval);
		this.automaticInterval = setInterval(
			() => this.runAutomatic(),
			Number.parseInt(timeout)
		);
	}

	getNewSlideIndex(step) {
		const slideIndex = this.state.slideIndex;
		const numberSlide = this.props.items.length;
		let newSlideIndex = slideIndex + step;

		if (newSlideIndex >= numberSlide) newSlideIndex = 0;
		else if (newSlideIndex < 0) newSlideIndex = numberSlide - 1;

		return newSlideIndex;
	}
	runAutomatic() {
		if(this.state.slideIndex !== 6) {
			this.setState({
				slideIndex: this.getNewSlideIndex(1)
			});
		} else {
			clearInterval(this.automaticInterval);
		}
	}

	onInputChange(e) {
		e.target.value = e.target.value.replace(/\D/g, '');
	}

	submitOnEnter(e) {
        if(e.which == 13 || e.keyCode == 13) {
            this.submitPhoneNumber();
        }
	}
	
	submitPhoneNumber() {
		let phoneNumber = this.phoneInput.value;
		if(phoneNumber === "") {
			chrome.send('sendDownloadLinkToMobile', ["" + this.phoneInput.value]);
		}
		if(phoneNumber[0] !== '0') {
			phoneNumber = '0' + phoneNumber;
		}
		chrome.send('sendDownloadLinkToMobile', ["" + phoneNumber]);
	}

	render() {
		let self = this;
		let tabs = this.props.items.map((elem, index) => {
			return (<div onClick={() => this.setSlideIndex(index)} className={self.getTitleItemClass(index)} key={elem.title}>
				<div className={"icon " + elem.icon}></div>
				<div className="title">{elem.title}</div>
			</div>)
		})
		let slider = this.props.items.map((elem, index) => {
			if(elem.title !== 'Mobile') {
				return (
					<div className={self.getContentItemClass(index)} key={elem.title}>
						<div className="slider-content">
							<div className="desContent">
								<h2 className="title" dangerouslySetInnerHTML={{ __html: elem.titleItem }} />
								<div className="description">{elem.description}</div>
								<button className="btnSet" onClick={() => {chrome.send('setAsDefaultBrowser')}} disabled={this.state.isDefaulted}>{!this.state.isDefaulted ? i18n.welcomePageSetDefaultBrowserBtn : i18n.welcomePageIsDefaultBrowserBtn}</button>
							</div>
							<div className="viewContent" style={{backgroundImage: `url(${elem.imgSrc})`}}>
							</div>
						</div>
					</div>
				)
			} else {
				return (
					<div className={self.getContentItemClass(index)} key={elem.title}>
						<div className="slider-content">
							<div className="desContent">
								<h2 className="title" dangerouslySetInnerHTML={{ __html: elem.titleItem }} />
								<div className="description">{elem.description}</div>
								<div className="phone-input-title">{elem.phoneInputTitle}</div>
								<div className="send-form">
									<div className="input-wrapper">
										<span className="phone-prefix">+84</span>
										<input placeholder="your phone number" type="text" onChange={e => {this.onInputChange(e)}} maxLength={10} ref={(phoneInput) => {this.phoneInput = phoneInput}} onKeyPress={e => {this.submitOnEnter(e)}}/>
									</div>
									<button className="sendBtn" onClick={() => {this.submitPhoneNumber()}}>{i18n.welcomePageSendLinkButton}</button>
								</div>
								<div className="err" ref={(errMess) => {this.errMess = errMess}}></div>
								<div className="success" ref={(succMess) => {this.succMess = succMess}}></div>
								<div className="stores">
									<div className="app-store" onClick={() => {window.open('https://itunes.apple.com/app/id1170593919/')}}></div>
									<div className="google-play" onClick={() => {window.open('https://play.google.com/store/apps/details?id=com.coccoc.trinhduyet&referrer=')}}></div>
								</div>
								<div className="bottom-contact">
									<div className="qr-code"></div>
									<div className="messenger" onClick={() => {window.open('http://m.me/coccocmobile')}}></div>
								</div>
							</div>
							<div className="viewContent" style={{backgroundImage: `url(${elem.imgSrc})`}}>
							</div>
						</div>
					</div>
				)
			}
		})
		return (
			<div className="sliders-wrapper">
				<div className="sliders-header">
					<div className="container">
						{tabs}
					</div>
				</div>
				<div className="sliders clearfix">
					<div className="container">
						{slider}
					</div>
				</div>
			</div>
		)
	}
};

module.exports = TabsControl;