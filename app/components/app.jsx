const React = require('react');
const TabsControl = require('./TabControl.jsx');
const i18n = window.loadTimeData.data_ || window.loadTimeData.conf;

class App extends React.Component {
	constructor(props) {
		super(props);
		const lang = i18n.language;
		this.items = [
			{
				title: "Download",
				icon: "download",
				titleItem: i18n.welcomePageDownloadTitle,
				description: i18n.welcomePageDownloadDescription,
				imgSrc: DEVELOPMENT ? require('../styles/assets/download_video.svg') : (lang === 'vi' ? 'images/download_video_vi.svg' : "images/download_video_en.svg")
			},
			{
				title: "Read news",
				icon: "news",
				titleItem: i18n.welcomePageReadNewsTitle,
				description: i18n.welcomePageReadNewsDescription,
				imgSrc: DEVELOPMENT ? require('../styles/assets/zen_new_tab.svg') : "images/zen_new_tab.svg"
			},
			{
				title: "Sidebar messenger",
				icon: "messenger",
				titleItem: i18n.welcomePageMessengerTitle,
				description: i18n.welcomePageMessengerDescription,
				imgSrc: DEVELOPMENT ? require('../styles/assets/siedbar_messenger.svg') : "images/sidebar_messenger.svg"
			},
			{
				title: "Dictionary",
				icon: "dictionary",
				titleItem: i18n.welcomePageDictionaryTitle,
				description: i18n.welcomePageDictionaryDescription,
				imgSrc: DEVELOPMENT ? require('../styles/assets/eng_viet_dict.svg') : "images/eng_viet_dict.svg"
			},
			{
				title: "Grammar",
				icon:"grammar",
				titleItem: i18n.welcomePageGrammarTitle,
				description: i18n.welcomePageGrammarDescription,
				imgSrc: DEVELOPMENT ? require('../styles/assets/spell_checker.svg') : "images/spell_checker.svg"
			},
			{
				title: "Pin video",
				icon: "pin",
				titleItem: i18n.welcomePagePinVideoTitle,
				description: i18n.welcomePagePinVideoDescription,
				imgSrc: DEVELOPMENT ? require('../styles/assets/pinvideo.gif') : "images/pin_video.gif"
			},
			{
				title: "Mobile",
				icon: 'mobile',
				titleItem: i18n.welcomePageMobileTitle,
				description: i18n.welcomePageMobileDescription,
				imgSrc: DEVELOPMENT ? require('../styles/assets/mobile-icon.svg') : "images/mobile_icon.svg",
				phoneInputTitle: i18n.welcomePageSendDownloadLinkLabel
			}
		]
	};

	render() {
		return (
			<TabsControl mode={"automatic"} items={this.items}>
			</TabsControl>);
	}
};
module.exports = App;