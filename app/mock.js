window.loadTimeData = {
    conf: {
		language: 'en',
		welcomePageTitle: 'Welcome to Cốc Cốc',
		welcomePageDownloadDescription: 'Download your favorite videos or songs anywhere, anytime. Cốc Cốc is 8 times faster than regular browser.',
		welcomePageReadNewsDescription: 'Thousands of hot news are collected and waiting for you to explore right on Cốc Cốc new tab. Daily updates, various news sources, compact design for eye comfort!',
		welcomePageMessengerDescription: 'Never miss a great conversation. Message your friends right from the sidebar with Facebook Messenger.',
		welcomePageDictionaryDescription: 'English will never be a challenge with Cốc Cốc handy dictionary. Double click on any English word to see their meaning in Vietnamese in a blink!',
		welcomePageGrammarDescription: 'Write emails, blog posts, or Facebook comments with zero spelling error. Let Cốc Cốc do the spell check and auto correction on any Vietnamese word or long passages for you.',
		welcomePagePinVideoDescription: 'Play video, browsing web, or reading news at the same time. Unlimited video pinning for your pleasure.',
		welcomePageSetDefaultBrowserBtn: 'Set Cốc Cốc as default browser',
		welcomePageIsDefaultBrowserBtn: "Coc Coc is now your default browser",
		welcomePageDownloadTitle: 'Download video and music',
		welcomePageReadNewsTitle: 'Personalized news on new tab',
		welcomePageMessengerTitle: 'Messenger on sidebar',
		welcomePageDictionaryTitle: 'Look up English words quickly',
		welcomePageGrammarTitle: 'Vietnamese automatic spell checker',
		welcomePagePinVideoTitle: 'Pin unlimited videos'
    },

    getBoolean: function (id) {
        return !!this.conf[id];
    },

    getString: function (id) {
        return this.conf[id];
    },

    getStringF: function (id) {
        const str = this.getString(id);

        if (!str) {
            return '';
        }

        const args = arguments;
        return str.replace(/\$[$1-9]/g, m => (m === '$$' ? '$' : args[m[1]]));
    },

    getInteger: function (id) {
        return this.conf[id];
    },

    valueExists: function (id) {
        return id in this.conf;
    },

    getValue: function (id) {
        return this.conf[id];
    }
};

window.i18nTemplate = (() => {
	/**
	 * This provides the handlers for the templating engine. The key is used as
	 * the attribute name and the value is the function that gets called for every
	 * single node that has this attribute.
	 * @type {!Object}
	 */
	const handlers = {
		/**
		 * This handler sets the textContent of the element.
		 * @param {HTMLElement} element The node to modify.
		 * @param {string} key The name of the value in the dictionary.
		 * @param {LoadTimeData} dictionary The dictionary of strings to draw from.
		 */
		'i18n-content': function (element, key, dictionary) {
			element.textContent = dictionary.getString(key);
		},

		/**
		 * This handler adds options to a <select> element.
		 * @param {HTMLElement} select The node to modify.
		 * @param {string} key The name of the value in the dictionary. It should
		 *     identify an array of values to initialize an <option>. Each value,
		 *     if a pair, represents [content, value]. Otherwise, it should be a
		 *     content string with no value.
		 * @param {LoadTimeData} dictionary The dictionary of strings to draw from.
		 */
		'i18n-options': function (select, key, dictionary) {
			const options = dictionary.getValue(key);
			options.forEach(optionData => {
				const option =
					typeof optionData == 'string'
						? new Option(optionData)
						: new Option(optionData[1], optionData[0]);
				select.appendChild(option);
			});
		},

		/**
		 * This is used to set HTML attributes and DOM properties. The syntax is:
		 *   attributename:key;
		 *   .domProperty:key;
		 *   .nested.dom.property:key
		 * @param {HTMLElement} element The node to modify.
		 * @param {string} attributeAndKeys The path of the attribute to modify
		 *     followed by a colon, and the name of the value in the dictionary.
		 *     Multiple attribute/key pairs may be separated by semicolons.
		 * @param {LoadTimeData} dictionary The dictionary of strings to draw from.
		 */
		'i18n-values': function (element, attributeAndKeys, dictionary) {
			const parts = attributeAndKeys.replace(/\s/g, '').split(/;/);
			parts.forEach(part => {
				if (!part) return;

				const attributeAndKeyPair = part.match(/^([^:]+):(.+)$/);
				if (!attributeAndKeyPair)
					throw new Error('malformed i18n-values: ' + attributeAndKeys);

				const propName = attributeAndKeyPair[1];
				const propExpr = attributeAndKeyPair[2];

				const value = dictionary.getValue(propExpr);

				// Allow a property of the form '.foo.bar' to assign a value into
				// element.foo.bar.
				if (propName[0] == '.') {
					const path = propName.slice(1).split('.');
					let targetObject = element;
					while (targetObject && path.length > 1) {
						targetObject = targetObject[path.shift()];
					}
					if (targetObject) {
						targetObject[path] = value;
						// In case we set innerHTML (ignoring others) we need to
						// recursively check the content.
						if (path === 'innerHTML') process(element, dictionary);
					}
				} else {
					element.setAttribute(propName, /** @type {string} */(value));
				}
			});
		}
	};

	const attributeNames = Object.keys(handlers);
	const selector = '[' + attributeNames.join('],[') + ']';

	/**
	 * Processes a DOM tree with the {@code dictionary} map.
	 * @param {HTMLElement} node The root of the DOM tree to process.
	 * @param {LoadTimeData} dictionary The dictionary to draw from.
	 */
	function process(node, dictionary) {
		const elements = Array.from(node.querySelectorAll(selector));
		elements.forEach(element => {
			for (let j = 0; j < attributeNames.length; j++) {
				const name = attributeNames[j];
				const attribute = element.getAttribute(name);
				if (attribute !== null) handlers[name](element, attribute, dictionary);
			}
		});
	}

	return {
		process: process
	};
})();

window.cr = {
	sendWithPromise: () => {
		return new Promise((resolve, reject) => {
			resolve(false)
		})
	},
	addWebUIListener: () => {
		return new Promise((resolve, reject) => {
			resolve({
				isDefault: false
			})
		})
	}
}