/* eslint object-curly-newline: "off", max-len: "off" */
const { Language, LanguageHelp, Timestamp, FriendlyDuration, klasaUtil: { toTitleCase, codeBlock }, constants: { EMOJIS: { SHINY, GREENTICK, REDCROSS } }, versions: { skyra, klasa } } = require('../index');

const builder = new LanguageHelp()
	.setExplainedUsage('⚙ | ***समझाया उपयोग***')
	.setPossibleFormats('🔢 | ***मुमकिन फॉर्मेट***')
	.setExamples('🔗 | ***उदाहरण***')
	.setReminder('⏰ | ***रीमाइन्डर***');
const timestamp = new Timestamp('YYYY/MM/DD [at] HH:mm:ss');

const TIMES = {
	YEAR: {
		1: 'साल',
		DEFAULT: 'साल'
	},
	MONTH: {
		1: 'महीना',
		DEFAULT: 'महीने'
	},
	WEEK: {
		1: 'हफ़्ता',
		DEFAULT: 'हफ्ते'
	},
	DAY: {
		1: 'दिन',
		DEFAULT: 'दिन'
	},
	HOUR: {
		1: 'घंटा',
		DEFAULT: 'घंटे'
	},
	MINUTE: {
		1: 'मिनट',
		DEFAULT: 'मिनट'
	},
	SECOND: {
		1: 'सेकंड',
		DEFAULT: 'सेकंड'
	}
};

const PERMS = {
	ADMINISTRATOR: 'ऐडमिनिस्ट्रेटर',
	VIEW_AUDIT_LOG: 'ऑडिट लॉग देखें',
	MANAGE_GUILD: 'सर्वर का प्रबंधन करें',
	MANAGE_ROLES: 'भूमिकाओं का प्रबंधन करें',
	MANAGE_CHANNELS: 'चैनलों प्रबंधित करें',
	KICK_MEMBERS: 'किक सदस्य',
	BAN_MEMBERS: 'प्रतिबंध सदस्य',
	CREATE_INSTANT_INVITE: 'तुरंत आमंत्रण बनाएं',
	CHANGE_NICKNAME: 'नीकनेम बदलें',
	MANAGE_NICKNAMES: 'नीकनेम का प्रबंधन करे',
	MANAGE_EMOJIS: 'इमोजी प्रबंधित करें',
	MANAGE_WEBHOOKS: 'वेबहुक्स का प्रबंधन करें',
	VIEW_CHANNEL: 'संदेश पढ़ें',
	SEND_MESSAGES: 'संदेश भेजें',
	SEND_TTS_MESSAGES: 'टीटीएस संदेश भेजें',
	MANAGE_MESSAGES: 'संदेश प्रबंधित करें',
	EMBED_LINKS: 'एम्बेड लिंक',
	ATTACH_FILES: 'फ़ाइल साथ लगाना',
	READ_MESSAGE_HISTORY: 'संदेश इतिहास पढ़ें',
	MENTION_EVERYONE: 'सभी का ज़िक्र करें',
	USE_EXTERNAL_EMOJIS: 'बाहरी इमोजी उपयोग करें',
	ADD_REACTIONS: 'प्रतिक्रियाएं जोड़ें',
	CONNECT: 'जोड़ना',
	SPEAK: 'बोलना',
	MUTE_MEMBERS: 'म्यूट सदस्य',
	DEAFEN_MEMBERS: 'बहरे मेंबर्',
	MOVE_MEMBERS: 'मूव मेंबर्स',
	USE_VAD: 'आवाज़ गतिविधि का उपयोग करें'
};

const random = num => Math.round(Math.random() * num);

const EIGHT_BALL = {
	WHEN: ['जल्दी™', 'शायद कल', 'शायद अगले साल...', 'अभी इस वक्त', 'कुछ महीनों में'],
	WHAT: ['एक विमान', 'क्या? फिर से पुछो।', 'एक उपहार।', 'कुछ नहीं', 'एक अंगूठी।', 'मुझे नहीं पता, शायद कुछ'],
	HOWMUCH: ['बहुत।', 'थोड़ा सा।', 'कुछ।', 'कल मुझसे पूछना।', 'मुझे नहीं पता, एक भौतिक विज्ञानी से पूछो।', 'कुछ नहीं।', '2 या 3 लीटर, मुझे याद नहीं है', 'इन्फिनिटी।', '1010 लीटर'],
	HOWMANY: ['बहुत।', 'थोड़ा सा।', 'कुछ।', 'कल मुझसे पूछना।', 'मुझे नहीं पता, एक भौतिक विज्ञानी से पूछो।', 'कुछ नहीं।', '2 या 3 लीटर, मुझे याद नहीं है', 'इन्फिनिटी।', '1010'],
	WHY: ['क्योंकि किसी ने तय किया', 'निश्चित रूप से शैतान की वजह से', 'मुझे नहीं पता, शायद भाग्य की वजह से', 'क्योंकि मैंने ऐसा कहा।', 'मुझे पता नहीं', 'हरमबे ने कुछ भी गलत नहीं किया', 'इस सर्वर के मालिक से पूछें', 'फिर से पुछो।', 'दूसरी तरफ जाने के लिए।', 'यह बाइबल में ऐसा कहा जाता है'],
	WHO: ['एक मनुष्य।', 'एक रोबोट।', 'एक हवाई जहाज।', 'एक पक्षी।', 'एक कार्बन संरचना', '0 और 1 का एक समूह', 'मेरे पास कोई सुराग नहीं है, क्या यह सामग्री है?', 'यह तर्कसंगत नहीं है'],
	ELSE: ['सबसे अधिक संभावना', 'नहीं', 'हाँ!', 'शायद।']
};

function duration(time) { // eslint-disable-line no-unused-vars
	return FriendlyDuration.duration(time, TIMES);
}

module.exports = class extends Language {

	constructor(client, store, file, directory) {
		super(client, store, file, directory);
		
		this.PERMISSIONS = PERMS;
		this.EIGHT_BALL = EIGHT_BALL;

		this.HUMAN_LEVELS = {
			0: 'कुछ भी नहीं',
			1: 'कम',
			2: 'मीडियम',
			3: '(╯°□°）╯︵ ┻━┻',
			4: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
		};

		this.duration = duration;
		
		this.language = {
			/**
			 * ################################
			 * #      FRAMEWORK MESSAGES      #
			 * #         KLASA 0.5.0d         #
			 * ################################
			 */

			DEFAULT: (key) => `${key} का hi-IN में अभी तक अनुवाद नहीं किया गया है`,
			DEFAULT_LANGUAGE: 'डिफ़ॉल्ट भाषा',
                        SETTING_GATEWAY_EXPECTS_GUILD: 'पैरामीटर <Guild> या तो गिल्ड या गिल्ड ऑब्जेक्ट की अपेक्षा करता है।',
			SETTING_GATEWAY_VALUE_FOR_KEY_NOEXT: (data, key) => `चाबी ${key} के लिए मान ${data} मौजूद नहीं है।`,
			SETTING_GATEWAY_VALUE_FOR_KEY_ALREXT: (data, key) => `चाबी ${key} के लिए मूल्य ${data} पहले से मौजूद है।`,
			SETTING_GATEWAY_SPECIFY_VALUE: 'आपको जोड़ने या फ़िल्टर करने के लिए मान बताना होगा।',
			SETTING_GATEWAY_KEY_NOT_ARRAY: (key) => `चाबी ${key} एक ऐरे नहीं है।`,
			SETTING_GATEWAY_KEY_NOEXT: (key) => `चाबी ${key} वर्तमान डेटा स्कीमा में मौजूद नहीं है।`,
			SETTING_GATEWAY_INVALID_TYPE: 'प्रकार पैरामीटर या तो जोड़ या निकालना चाहिए।',
			RESOLVER_MULTI_TOO_FEW: (name, min = 1) => `बहुत कम ${name} एस प्रदान किये गएा। कम से कम ${min} ${min === 1? 'है': 'हैं'} आवश्यक है।`,
			RESOLVER_INVALID_BOOL: (name) => `'${name}' सही या गलत होना चाहिए`,
			RESOLVER_INVALID_CHANNEL: (name) => `'${name}' एक चैनल टैग या मान्य चैनल आईडी होना चाहिए`,
			RESOLVER_INVALID_CUSTOM: (name) => `${name} मान्य ${type} होना चाहिए।`,
			RESOLVER_INVALID_DATE: (name) => `${name} एक वैध तिथि होना चाहिए।`,
			RESOLVER_INVALID_DURATION: (name) => `${name} एक वैध अवधि स्ट्रिंग होना चाहिए।`,
			RESOLVER_INVALID_EMOJI: (name) => `${name} एक कस्टम इमोजी टैग या वैध इमोजी आईडी होना चाहिए।`,
			RESOLVER_INVALID_FLOAT: (name) => `'${name}' एक वैध संख्या होना चाहिए`,
			RESOLVER_INVALID_GUILD: (name) => `'${name}' एक वैध गिल्ड आईडी होना चाहिए`,
			RESOLVER_INVALID_INT: (name) => `'${name}' पूरा संख्या होना चाहिए`,
			RESOLVER_INVALID_LITERAL: (name) => `आपका विकल्प केवल संभावना से मेल नहीं खाता है: '${name}'`,
			RESOLVER_INVALID_MEMBER: (name) => `'${name}' एक मान्य उपयोगकर्ता आईडी होना चाहिए`,
			RESOLVER_INVALID_MSG: (name) => `'${name}' एक मान्य संदेश आईडी होना चाहिए`,
			RESOLVER_INVALID_PIECE: (name, piece) => `'${name}' एक वैध ${piece} नाम होना चाहिए।`,
			RESOLVER_INVALID_REGIX_MATCH: (name) => `${name} को इस रेजिक्स पैटर्न \`${pattern}\` का पालन करना होगा।`,
			RESOLVER_INVALID_ROLE: (name) => `'${name}' एक भूमिका उल्लेख या भूमिका आईडी होना चाहिए`,
			RESOLVER_INVALID_STRING: (name) => `${name} एक वैध स्ट्रिंग होना चाहिए।`,
			RESOLVER_INVALID_TIME: (name) => `${name} मान्य अवधि या दिनांक स्ट्रिंग होना चाहिए।`,
			RESOLVER_INVALID_URL: (name) => `'${name}' एक वैध यूआरएल होना चाहिए`,
			RESOLVER_INVALID_USER: (name) => `'${name}' एक मान्य उपयोगकर्ता आईडी होना चाहिए`,
			RESOLVER_STRING_SUFFIX: ' अक्षर',
			RESOLVER_MINMAX_EXACTLY: (name, min, suffix) => `'${name}' बिल्कुल ${min}${suffix} होना चाहिए।`,
			RESOLVER_MINMAX_BOTH: (name, min, max, suffix) => `'${name}' ये ${min} और ${max}${suffix} के बीच होना चाहिए।`,
			RESOLVER_MINMAX_MIN: (name, min, suffix) => `'${name}' ${min}${suffix} से बड़ा होना चाहिए।`,
			RESOLVER_MINMAX_MAX: (name, max, suffix) => `'${name}' ये ${max}${suffix} से कम होना चाहिए।`,
			REACTIONHANDLER_PROMPT: `आप किस पेज पर जाना चाहते हैं?`,
			COMMANDMESSAGE_MISSING: 'इनपुट के अंत के बाद एक या अधिक आवश्यक तर्क गायब हैं',
			COMMANDMESSAGE_MISSING_REQUIRED: (name) => `'${name}' एक आवश्यक तर्क है।`,
			COMMANDMESSAGE_MISSING_OPTIONALS: (possibles) => `एक आवश्यक विकल्प गुम है: (${possibles})`,
			COMMANDMESSAGE_NOMATCH: (possibles) => `आपका विकल्प किसी भी संभावना से मेल नहीं खाता है: (${possibles})`,
			MONITOR_COMMAND_HANDLER_REPROMPT: (tag, error) => `${tag} | **${error}** | आपके पास एक वैध तर्क के साथ इस प्रॉमप्ट का उत्तर देने के लिए **30** सेकंड हैं। इस प्रॉमप्ट को रद्द करने के लिए **"ABORT"** टाइप करें`,
			MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT: (tag, name, time) => `${tag} | **${name}** एक दोहराव तर्क है | आपके पास अतिरिक्त मान्य तर्कों के साथ इस प्रॉम्प्ट का जवाब देने के लिए **${time}** सेकंड हैं। इस प्रॉम्प्ट को रद्द करने के लिए **"CANCEL"** टाइप करें।`, // eslint-disable-line max-len
			MONITOR_COMMAND_HANDLER_ABORTED: 'निरस्त',
			INHIBITOR_COOLDOWN: (remaining) => `आपने इस कमांड का इस्तेमाल अभी किया है। आप इस कमांड को ${remaining} सेकंड में फिर से उपयोग कर सकते हैं।`,
			INHIBITOR_DISABLED: 'यह कमांड अभी के लिए डिसेबल्ड है',
			INHIBITOR_MISSING_BOT_PERMS: (missing) => `अपर्याप्त  पेर्मिशन्स, गायब: **${missing}**`,
			INHIBITOR_NSFW: 'आप इस चैनल में NSFW कमांड का उपयोग नहीं कर सकते हैं।',
			INHIBITOR_PERMISSIONS: 'आपको इस आदेश का उपयोग करने की अनुमति नहीं है',

			// Commands#anime
			COMMAND_ANIME_DESCRIPTION: (entry, context) => [
				`**अंग्रेजी शीर्षक:** ${entry.english}`,
				`${context.length > 750 ? `${util.splitText(context, 750)}... [पढ़ना जारी रखें](https://myanimelist.net/anime/${entry.id})` : context}`
			].join('\n'),
			COMMAND_ANIME_TITLE: (entry) => `${entry.title} (${entry.episodes === 0 ? 'अज्ञात' : entry.episodes} एपिसोड)`,
			COMMAND_ANIME_STATUS: (entry) => [
				`❯  वर्तमान स्थिति: **${entry.status}**`,
				`• शुरू कर दिया है: **${entry.start_date}**\n${entry.end_date === '0000-00-00' ? '' : `    • समाप्त: **${entry.end_date}**`}`
			].join('\n'),
			COMMAND_MANGA_DESCRIPTION: (entry, context) => [
				`**अंग्रेजी शीर्षक:** ${entry.english}`,
				`${context.length > 750 ? `${util.splitText(context, 750)}... [पढ़ना जारी रखें](https://myanimelist.net/anime/${entry.id})` : context}`
			].join('\n'),
			COMMAND_MANGA_TITLE: (entry) => `${entry.title} (${entry.chapters ? 'अज्ञात' : entry.chapters} अध्याय और ${entry.volumes ? 'अज्ञात' : entry.volumes} संस्करण)`,
			COMMAND_MANGA_STATUS: (entry) => [
				`❯  वर्तमान स्थिति: **${entry.status}**`,
				`• शुरू कर दिया है: **${entry.start_date}**\n${entry.end_date === '0000-00-00' ? '' : `    • समाप्त: **${entry.end_date}**`}`
			].join('\n'),
			COMMAND_ANIME_TITLES: {
				TYPE: 'टाइप',
				SCORE: 'स्कोर',
				STATUS: 'स्थति',
				WATCH_IT: 'इसे यहां देखें:'
			},

			// Commands#fun
			COMMAND_8BALL: (author, input, output) => `🎱 ${author} द्वारा प्रश्न: *${input}*\n${output}`,
			COMMAND_8BALL_NOT_QUESTION: 'ये कोई प्रश्न नहीं लगता है',
			COMMAND_8BALL_QUESTIONS: {
				QUESTION: '?',
				WHEN: 'कब',
				WHAT: 'क्या',
				HOW_MUCH: 'कितना',
				HOW_MANY: 'कितने',
				WHY: 'क्यों',
				WHO: 'कौन'
			},
			COMMAND_CATFACT: 'बिल्ली तथ्य',
			COMMAND_DICE: (sides, rolls, result) => `आपने **${sides}** - पासा **${rolls}** बार लुढ़का, आपको मिला: **${result}**`,
			// https://bulbapedia.bulbagarden.net/wiki/Escape_Rope
			COMMAND_ESCAPEROPE: (user) => `**${user}** ने **एस्केप रोप** का इस्तेमा किया`,
			COMMAND_LOVE_LESS45: 'अगली बार फिर कोशिश करें ...',
			COMMAND_LOVE_LESS75: 'काफी है!',
			COMMAND_LOVE_LESS100: 'अच्छा जोड़!',
			COMMAND_LOVE_100: 'बहतरीन मैच!',
			COMMAND_LOVE_ITSELF: 'आप एक विशेष प्राणी हैं और आपको अपने आप से किसी से भी ज्यादा प्यार करना चाहिए <3',
			COMMAND_LOVE_RESULT: 'नतीजा',
			COMMAND_NORRIS: 'Chuck Norris',
			COMMAND_RATE: (user, rate, emoji) => `मैं **${user} ${rate}**/100 ${emoji} देना होगा`,
			COMMAND_RATE_MYSELF: ['मैं खुद को बहुत प्यार करता हूँ 😊', 'अपने आप को'],
			COMMAND_RNG: (user, word) => `🕺 *एनी, मेनी, माइनी, मो, पैर की अंगूठी से एक शेर पकड़ो* ${user}, मैं चुनती हूं: ${util.codeBlock('', word)}`,
			COMMAND_RNG_MISSING: 'कृपया कम से कम दो विकल्पों को अल्पविराम से विभाजित करें।',
			COMMAND_RNG_DUP: (words) => `मैं दोहराया शब्दों को स्वीकार क्यों करुँगी? '${words}'.`,
			COMMAND_XKCD_COMICS: (amount) => `केवल ${amount} कॉमिक्स हैं`,

			// Commands#misc
			COMMAND_UNICODE: (string) => `आपका परिवर्तित संदेश है:\n${string}`,

			// Commands#moderation
			// ## Utilities
			COMMAND_PERMISSIONS: (username, id) => `${username} (${id}) के लिए अनुमतियाँ`,
			COMMAND_RAID_DISABLED: 'इस सर्वर पर एंटी-रेड सिस्टम सक्षम नहीं है',
			COMMAND_RAID_MISSING_KICK: `चूंकि मेरे पास ${PERMS.KICK_MEMBERS} की अनुमति नहीं है, मैं Anti-RAID निष्क्रिय करती हूं।`,
			COMMAND_RAID_LIST: 'RAID कतार में उपयोगकर्ताओं की सूची',
			COMMAND_RAID_CLEAR: 'RAID सूची को सफलतापूर्वक साफ़ किया गया',
			COMMAND_RAID_COOL: 'RAID को सफलतापूर्वक निष्क्रिय किया गया',
			COMMAND_FLOW: (amount) => `${amount} संदेश अंतिम मिनट के भीतर भेज दिए गए हैं`,
			COMMAND_TIME_TIMED: 'चयनित मॉडरेशन केस का समय पहले ही समाप्त हो चुका है।',
			COMMAND_TIME_UNDEFINED_TIME: 'आपको समय निर्दिष्ट करना होगा',
			COMMAND_TIME_UNSUPPORTED_TIPE: 'चयनित केस के लिए कार्रवाई का प्रकार रिवर्स नहीं हो सकता है, इसलिए यह क्रिया असमर्थित है।',
			COMMAND_TIME_NOT_SCHEDULED: 'यह कार्य निर्धारित नहीं है',
			COMMAND_TIME_ABORTED: (title) => `${title} के लिए शेड्यूल सफलतापूर्वक निरस्त कर दिया गया`,
			COMMAND_TIME_SCHEDULED: (title, user, time) => `✅ ${duration(time)} की अवधि के साथ उपयोगकर्ता ${user.tag} (${user.id}} के लिए एक मॉडरेशन एक्शन टाइप **${title}** सफलतापूर्वक निर्धारित किया गया है`,

			// ## General
			COMMAND_BAN_NOT_BANNABLE: 'लक्ष्य मेरे द्वारा प्रतिबंधित नहीं किया जा सकता',
			COMMAND_BAN_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **प्रतिबंधित**: ${user.tag} (${user.id})${reason ? `\nवजह: ${reason}` : ''}`,
			COMMAND_SOFTBAN_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **SOFTBANNED**: ${user.tag} (${user.id})${reason ? `\nवजह: ${reason}` : ''}`,
			COMMAND_UNBAN_MESSAGE: (user, reason, banReason, log) => `|\`🔨\`| [Case::${log}] **अप्रतिबंधित**: ${user.tag} (${user.id})${reason ? `\nवजह: ${reason}` : ''}${banReason ? `\nप्रतिबंध के लिए कारण:${banReason}` : ''}`,
			COMMAND_UNBAN_MISSING_PERMISSION: `मुझे इसे रद्द करने के लिए ${PERMS.BAN_MEMBERS} परमिशन की ज़रूरत होगी`,
			COMMAND_KICK_NOT_KICKABLE: 'लक्ष्य मेरे लिए किक योग्य नहीं है',
			COMMAND_KICK_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **किक**: ${user.tag} (${user.id})${reason ? `\nवजह: ${reason}` : ''}`,
			COMMAND_MUTE_MUTED: 'लक्ष्य उपयोगकर्ता पहले से ही म्यूट है।',
			COMMAND_MUTE_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **म्यूट**: ${user.tag} (${user.id})${reason ? `\nवजह: ${reason}` : ''}`,
			COMMAND_MUTE_USER_NOT_MUTED: 'यह उपयोगकर्ता म्यूट नहीं है',
			COMMAND_VMUTE_MISSING_PERMISSION: `मुझे अनम्यूट आवाज में सक्षम होने के लिए ${PERMS.MUTE_MEMBERS} अनुमति की आवश्यकता होगी।`,
			COMMAND_VMUTE_USER_NOT_MUTED: 'यह उपयोगकर्ता आवाज म्यूट नहीं है।',
			COMMAND_UNMUTE_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **अनम्यूट**: ${user.tag} (${user.id})${reason ? `\nवजह: ${reason}` : ''}`,
			COMMAND_UNMUTE_MISSING_PERMISSION: `मुझे अनम्यूट करने में सक्षम होने के लिए ${PERMS.MANAGE_ROLES} अनुमति की आवश्यकता होगी।`,
			COMMAND_WARN_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **आगाह**: ${user.tag} (${user.id})${reason ? `\nवजह: ${reason}` : ''}`,
			COMMAND_WARN_DM: (moderator, guild, reason) => `आपको ${moderator} के द्वारा ${guild} में ${reason} रीज़न की वजह से वार्निंग दी गयी है`,

			COMMAND_PRUNE: (amount, total) => `${total} से ${amount} संदेश सफलतापूर्वक हटा दिए गए`,

			COMMAND_REASON_NOT_EXISTS: 'चयनित मोडलॉग मौजूद नहीं है',

			COMMAND_MUTE_CONFIGURE: 'क्या आप चाहते है की में म्यूट रोले को अभी बनाओ और कॉन्फ़िगर करू?',
			COMMAND_MUTE_CONFIGURE_CANCELLED: 'प्रॉम्प्ट निरस्त किया गया, म्यूट रोले सृजन रद्द कर दिया गया है।',

			COMMAND_FILTER_UNDEFINED_WORD: 'आपको मुझे लिखकर देना चाहिए कि आप मुझसे क्या फ़िल्टर करवाना चाहते है',
			COMMAND_FILTER_FILTERED: (filtered) => `यह शब्द ${filtered ? 'already' : 'not'} फ़िल्टर किया गया।`,
			COMMAND_FILTER_ADDED: (word) => `| ✅ | सफलता! ${word} शब्द को फ़िल्टर में जोड़ा गया।`,
			COMMAND_FILTER_REMOVED: (word) => `| ✅ | सफलता! ${word} शब्द को फ़िल्टर से निकाला गया`,
			COMMAND_FILTER_RESET: '| ✅ | सफलता! फ़िल्टर रीसेट कर दिया गया है।',

			COMMAND_LOCKDOWN_OPEN: (channel) => `${channel} चैनल के लिए लॉकडाउन जारी किया गया है।`,
			COMMAND_LOCKDOWN_LOCKING: (channel) => `${channel} चैनल को लॉक कर रहा है ...`,
			COMMAND_LOCKDOWN_LOCK: (channel) => `चैनल ${channel} अब लॉक है`,

			COMMAND_LIST_CHANNELS: (name, id) => `${name} (${id}) के लिए चैनल की सूची`,
			COMMAND_LIST_ROLES: (name, id) => `${name} (${id}) के लिए भूमिकाओं की सूची`,
			COMMAND_LIST_MEMBERS: (name, id) => `रोल ${name} (${id}) के लिए सदस्यों की सूची`,
			COMMAND_LIST_STRIKES: (name) => `चेतावनी ${name ? ` के लिए ${name}` : ''}`,
			COMMAND_LIST_STRIKES_EMPTY: 'चेतावनियों की सूची खाली है।',
			COMMAND_LIST_STRIKES_ALL: (count, list) => `${count} स्ट्राइक हैं हालत: \`${list}\``,
			COMMAND_LIST_STRIKES_EMPTY_FOR: (user) => `${user} के लिए कोई चेतावनी नहीं है`,
			COMMAND_LIST_STRIKES_ENUM: (count) => `${count} स्ट्राइक हैं${count === 1 ? '' : 's'}`,
			COMMAND_LIST_STRIKES_CASE: (number, moderator, reason) => `मामला \`${number}\` मॉडरेटर: **${moderator}**\n\`${reason}\``,
			COMMAND_LIST_ADVERTISEMENT: 'सदस्यों की सूची जो विज्ञापन कर रहे हैं',
			COMMAND_LIST_ADVERTISEMENT_EMPTY: 'किसी के पास अपने गेम में विज्ञापन यूआरएल नहीं है',
			COMMAND_LIST_ROLE_EMPTY: 'इस रोल के कोई सदस्य नहीं है',

			COMMAND_ROLE_HIGHER: 'चयनित सदस्य की तुलना में आपके पास उच्च या समान रोल स्थिति पर है',
			COMMAND_ROLE_HIGHER_SKYRA: 'चयनित सदस्य मेरे मुकाबले उच्च या समान रोल स्थिति पर है',
			COMMAND_USERSELF: 'आप अपने आप से ऐसा क्यों करेंगे?',
			COMMAND_TOSKYRA: 'मुझे लगा तुम्हे मुझसे प्यार है 💔',

			// Commands#overwatch
			COMMAND_PLATFORM_REMOVED: (role) => `आपका गेम प्लेटफॉर्म (**${role}**) हटा दिया गया है।`,
			COMMAND_PLATFORM_UPDATED: (role) => `आपका गेम प्लेटफॉर्म यहां अपडेट किया गया है: **${role}**`,
			COMMAND_REGION_REMOVED: (role) => `आपका गेम क्षेत्र (**${role}**) हटा दिया गया है।`,
			COMMAND_REGION_UPDATED: (role) => `आपका गेम क्षेत्र अपडेट किया गया है: **${role}**`,
			COMMAND_GAMEROLE_UPDATE: (role) => `आपकी गेम की रोल को अपडेट किया गया है: **${role}**`,
			COMMAND_RANK_UPDATE: (rank) => `आपकी रैंक में अपडेट किया गया है: ** ${rank}**`,
			MISSING_ROLE: 'आपके पास यह रोल नहीं है',
			HAS_ROLE: 'आपके पास पहले से ही यह रोल है।',

			// Commands#social
			COMMAND_AUTOROLE_POINTS_REQUIRED: 'आपको अंकों की एक मान्य राशि चाहिए।',
			COMMAND_AUTOROLE_UPDATE_UNCONFIGURED: 'यह रोल एक ऑटोरोले के रूप में कॉन्फ़िगर नहीं है। इसके बजाय ऐड टाइप का उपयोग करें',
			COMMAND_AUTOROLE_UPDATE: (role, points, before) => `अपडेटेड ऑटोरोले: ${role.name} (${role.id}) पॉइंट्स रिक्वायर्ड: ${points} (पहले: ${before})`,
			COMMAND_AUTOROLE_REMOVE: (role, before) => `ऑटोरोल को हटाया गया: ${role.name} (${role.id}), जिसके लिए ${before} अंकों की आवश्यकता है`,
			COMMAND_AUTOROLE_ADD: (role, points) => `नया ऑटोरोल जोड़ा गया: ${role.name} (${role.id}) पॉइंट्स रिक्वायर्ड: ${points}`,
			COMMAND_AUTOROLE_LIST_EMPTY: 'इस सर्वर पर ऑटो-रोल के रूप में कोई रोल नहीं है।',
			COMMAND_AUTOROLE_UNKNOWN_ROLE: (role) => `अज्ञात रोल: ${role}`,

			COMMAND_BALANCE: (user, amount, icon) => `उपयोगकर्ता ${user} में कुल ${amount} ${icon} है`,
			COMMAND_BALANCE_SELF: (amount, icon) => `आपके पास कुल ${amount} ${icon} है`,

			COMMAND_BANNER_LIST_EMPTY: (prefix) => `आपके पास एक उपलब्ध बैनर नहीं है  \`${prefix}बैनर खरीदलिस्ट \` को चेक करे बैनर की सूचि के लिए जो आप खरीद सकते है`,
			COMMAND_BANNER_SET_INPUT_NULL: 'सेट करने के लिए आपको एक बैनर आईडी बतानी होगी।',
			COMMAND_BANNER_SET_NOT_BOUGHT: 'आपके पास यह बैनर नहीं है',
			COMMAND_BANNER_SET: (banner) => `|\`✅\`| **सफलता**। आपने अपना बैनर सेट कर दिया है: __ ${banner} __`,
			COMMAND_BANNER_BUY_INPUT_NULL: 'आपको खरीदने के लिए एक बैनर आईडी बतानी होगी।',
			COMMAND_BANNER_BUY_NOT_EXISTS: (prefix) => `यह बैनर आईडी मौजूद नहीं है कृपया बैनर की एक सूची के लिए \`${prefix}banner buylist\` की जांच करें जो आप खरीद सकते हैं।`,
			COMMAND_BANNER_BUY_BOUGHT: (prefix, banner) => `आपके पास पहले से ही यह बैनर है, आप अपने प्रोफाइल में इसे देखने के लिए \`${prefix}banner set ${banner} \`का उपयोग  कर सकते हैं।`,
			COMMAND_BANNER_BUY_MONEY: (money, cost, icon) => `आपके पास इस बैनर को खरीदने के लिए पर्याप्त पैसा नहीं है आपके पास ${money}${icon} है, बैनर की कॉस्ट ${cost}${icon} है`,
			COMMAND_BANNER_BUY: (banner) => `|\`✅\`| **सफलता**। आपने बैनर खरीदा है: __ ${banner} __`,
			COMMAND_BANNER_BUY_PAYMENT_CANCELLED: '|`❌`| पेमेंट कैंसल कर दी गयी है',
			COMMAND_BANNER_PROMPT: {
				AUTHOR: 'लेखक',
				TITLE: 'शीर्षक',
				PRICE: 'मूल्य'
			},

			COMMAND_C4_SKYRA: 'मुझे खेद है, मुझे पता है कि आप मेरे साथ खेलना चाहते हैं, लेकिन अगर मैं आपके साथ खेलूं तो मैं अन्य लोगों की मदद नहीं कर पाऊंगी! 💔',
			COMMAND_C4_BOT: 'मुझे खेद है, लेकिन मुझे नहीं लगता कि वे जो कर रहे हैं वह करना बंद करना चाहते हैं और मानव के साथ खेलेंगे।',
			COMMAND_C4_SELF: 'आप खुद के खिलाफ खेलने से दुखी हो गए होंगे। दूसरे यूजर के साथ दुबारा कोशिश करे।',
			COMMAND_C4_PROGRESS: 'मुझे खेद है, लेकिन इस चैनल में एक खेल प्रगति पर है, जब यह खत्म होता है तो फिर से प्रयास करें।',
			COMMAND_C4_PROMPT: (challenger, challengee) => `प्रिय ${challengee}, आपको कनेक्ट-फोर मैच में ${challenger} ने चुनौती दी है। उत्तर देने के लिए **yes** के साथ उत्तर दें!`,
			COMMAND_C4_PROMPT_TIMEOUT: 'मुझे खेद है, लेकिन चलेन्जी ने समय पर उत्तर नहीं दिया।',
			COMMAND_C4_PROMPT_DENY: 'मुझे खेद है पर चलेन्जी ने खेलने से इंकार कर दिया',
			COMMAND_C4_START: (player, table) => `चलो खेलें! **${player}**: की बारी\n${table}`,
			COMMAND_C4_GAME_TIMEOUT: '**एक प्रतिक्रिया की कमी (60 सेकंड) के कारण मैच एक ड्रा में संपन्न हुआ**',
			COMMAND_C4_GAME_COLUMN_FULL: 'यह कॉलम भरा हुआ है। कृपया एक और प्रयास करें',
			COMMAND_C4_GAME_WIN: (user, table) => `**${user}** जीत गया!\n${table}`,
			COMMAND_C4_GAME_DRAW: (table) => `यह मैच एक **ड्रॉ** में संपन्न हुआ!\n${table}`,
			COMMAND_C4_GAME_NEXT: (player, table) => `**${player}**: की बारी\n${table}`,

			COMMAND_DAILY_TIME: (time) => `अगली डेलीज़ ${duration(time)} में उपलब्ध हैं`,
			COMMAND_DAILY_TIME_SUCCESS: (amount, icon) => `वाह! आपने ${amount}${icon} अर्जित किया है! अगली डेलीज़: 12 घंटे में`,
			COMMAND_DAILY_GRACE: (remaining) => [
				`क्या आप डेलीज़ का दावा करना चाहते हैं? शेष समय सामान्य 12 घ प्रतीक्षा अवधि तक जोड़ा जाएगा।`,
				`बचा हुआ समय: ${duration(remaining, true)}`
			].join('\n'),
			COMMAND_DAILY_GRACE_ACCEPTED: (amount, icon, remaining) => `${amount}${icon} सफलतापूर्वक दावा किया! अगली डेलीज़: ${duration(remaining)} में`,
			COMMAND_DAILY_GRACE_DENIED: 'समझ गई! जल्दी वापस आना!',

			COMMAND_LEVEL: {
				LEVEL: 'स्तर',
				EXPERIENCE: 'अनुभव',
				NEXT_IN: 'अगले स्तर में'
			},

			COMMAND_MYLEVEL: (points, next) => `आपके पास कुल ${points} अंक हैं। ${next}`,
			COMMAND_MYLEVEL_NEXT: (remaining, next) => `\nअगले रैंक के लिए अंक: **${remaining}** (${next} अंक पर)`,

			COMMAND_PAY_MISSING_MONEY: (needed, has, icon) => `मुझे खेद है, लेकिन आपको ${needed}${icon} की आवश्यकता है और आपके पास ${has}${icon} है`,
			COMMAND_PAY_PROMPT: (user, amount, icon) => `आप ${user}${amount}${icon} का भुगतान करने जा रहे हैं, क्या आप वाकई आगे बढ़ना चाहते हैं?`,
			COMMAND_PAY_PROMPT_ACCEPT: (user, amount, icon) => `भुगतान स्वीकृत, ${amount}${icon} को ${user} के प्रोफ़ाइल पर भेजा गया है।`,
			COMMAND_PAY_PROMPT_DENY: 'भुगतान अस्वीकृत',
			COMMAND_PAY_SELF: 'अगर में इस पर टैक्स लगा दू, तो आप पैसे खो देंगे, इसलिए अपने आप को भुगतान मत करिए',
			COMMAND_SOCIAL_PAY_BOT: 'ओह, खेद है, लेकिन बॉट्स के लिए पैसा बेकार है, मुझे पूरा यकीन है कि इंसान इससे बेहतर फायदा उठाएंगे।',

			COMMAND_PROFILE: {
				GLOBAL_RANK: 'ग्लोबल रैंक',
				CREDITS: 'क्रेडिट',
				REPUTATION: 'प्रतिष्ठा',
				EXPERIENCE: 'अनुभव',
				LEVEL: 'स्तर'
			},

			COMMAND_REMINDME_INPUT: 'आपको मुझे बताना होगा की में आप को क्या याद दिलाओ और कब याद दिलाओ',
			COMMAND_REMINDME_INPUT_PROMPT: 'आपका नया रिमाइंडर कब तक रहना चाहिए?',
			COMMAND_REMINDME_TIME: 'आपका रिमाइंडर कम से कम एक मिनट लंबा होना चाहिए',
			COMMAND_REMINDME_CREATE: (id) => `आईडी \`${id}\` के साथ एक रिमाइंडर बनाया गया है`,
			COMMAND_REMINDME_DELETE_PARAMS: ['मिटाना', 'हटाना'],
			COMMAND_REMINDME_DELETE_INVALID_PARAMETERS: 'पहले बनाए गए रिमाइंडर को हटाने के लिए, आपको आईडी के बाद \'मिटाएँ\' या \'हटाएं \' टाइप करना होगा।',
			COMMAND_REMINDME_DELETE: task => `रिमाइंडर \`${task.id}\` आईड के साथ और **${duration(task.timestamp - Date.now())}** के शेष समय के साथ सफलतापूर्वक हटा दिया गया है।`,
			COMMAND_REMINDME_LIST_PARAMS: ['सूची', 'सब'],
			COMMAND_REMINDME_LIST_EMPTY: 'आपके पास कोई सक्रिय रिमाइंडर नहीं है',
			COMMAND_REMINDME_INVALID_ID: 'मुझे क्षमा करें, लेकिन प्रदान की गई आईडी मान्य नहीं है',
			COMMAND_REMINDME_NOTFOUND: 'मुझे यहाँ कुछ नहीं मिल रहा है रिमाइंडर या तो अस्तित्व में नहीं था या समाप्त हो गया था',

			COMMAND_REPUTATION_TIME: (remaining) => `आप ${duration(remaining)} में एक रेपुटेशन पॉइंट दे सकते है`,
			COMMAND_REPUTATION_USABLE: 'आप एक रेपुटेशन पॉइंट दे सकते है',
			COMMAND_REPUTATION_USER_NOTFOUND: 'आपको रेपुटेशन पॉइंट देने के लिए कोई यूजर स्पेसिफी करना होगा',
			COMMAND_REPUTATION_SELF: 'आप अपने आप को एक रेपुटेशन पॉइंट नहीं दे सकते',
			COMMAND_REPUTATION_BOTS: 'आप बोट्स को रेपुटेशन पॉइंट नहीं दे सकते',
			COMMAND_REPUTATION_GIVE: (user) => `आपने **${user}** के लिए एक रेपुटेशन पॉइंट दिया है!`,

			COMMAND_REPUTATIONS: (points) => `आपके पास कुल ${points} रेपुटेशन पॉइंट हैं`,

			COMMAND_SCOREBOARD_POSITION: (position) => `रैंकिंग में आपका स्थान है: ${position}`,

			COMMAND_SETCOLOR: (color) => `रंग ${color} में बदल गया`,

			COMMAND_SLOTMACHINES_MONEY: (money, icon) => `मुझे खेद है, लेकिन आपकी शर्त का भुगतान करने के लिए आपके पास पर्याप्त पैसा नहीं है! आपका वर्तमान खाता शेष राशि ${money}${icon} है`,
			COMMAND_SLOTMACHINES_WIN: (roll, winnings, icon) => `**आपने रोल किया:**\n${roll}\n**बधाई हो!**\nआप ${winnings}${icon} जीत चुके हैं!`,
			COMMAND_SLOTMACHINES_LOSS: (roll) => `**आपने रोल किया:**\n${roll}\n**मिशन फेल हो गया!**\nहम उन्हें अगली बार देख लेंगे!`,

			COMMAND_SOCIAL_PROFILE_NOTFOUND: 'मुझे माफ करे, लेकिन यह यूजर प्रोफाइल मौजूद नहीं है',
			COMMAND_SOCIAL_PROFILE_BOT: 'मुझे खेद है, लेकिन बॉट्स की __Member Profile__ नहीं है',
			COMMAND_SOCIAL_PROFILE_DELETE: (user, points) => `|\`✅\`| **सफलता** ${user}** के लिए __Member Profile__ को हटा दिया, जिसमें ${points} अंक थे।`,
			COMMAND_SOCIAL_POINTS: 'क्या आप उन अंकों की संख्या बता सकते हैं जिन्हें आप जोड़ना चाहते हैं या निकाल सकते हैं?',
			COMMAND_SOCIAL_UPDATE: (action, amount, user, before, now) => `आपके पास केवल ${action === 'जोड़ना' ? 'जोड़ा गया' : 'हटाया गया'} ${amount} ${amount === 1 ? 'बिंदु' : 'अंक'} __Member Profile__ के लिए ${user} के लिए। पहले: ${before}; अब: ${now}.`,

			COMMAND_SUBSCRIBE_NO_ROLE: 'इस सर्वर में कॉन्फ़िगर घोषित रोल नहीं है',
			COMMAND_SUBSCRIBE_SUCCESS: (role) => `सफलतापूर्वक रोल दिया गया: **${role}**`,
			COMMAND_UNSUBSCRIBE_SUCCESS: (role) => `सफलतापूर्वक रोल हटा दिया गया: **${role}**`,
			COMMAND_SUBSCRIBE_NO_CHANNEL: 'इस सर्वर में कॉन्फ़िगर घोषणा चैनल नहीं है',
			COMMAND_ANNOUNCEMENT: (role) => `${role} **के लिए नई घोषणा**`,

			COMMAND_CONFIGURATION_ABORT: (reason) => `|\`⚙\`| प्रॉम्प्ट सिस्टम रद्द: ${reason === 'TIME' ? 'समय समााप्त।' : 'सफलतापूर्वक निकल गया।'}`,

			// Commands#system
			COMMAND_FEEDBACK: '|`✅`| आपकी प्रतिक्रिया के लिए धन्यवाद ❤! जितनी जल्दी हो सके आपको डीएम में उत्तर मिलेगा।',

			COMMAND_RELOAD: (type, name) => `✅ रीलोडेड ${type}: ${name}`,
			COMMAND_RELOAD_ALL: (type) => `✅ सभी ${type} को रीलोड किया गया`,
			COMMAND_REBOOT: 'रीबूट हो रहा है ...',
			COMMAND_PING: 'पिंग?',
			COMMAND_PINGPONG: (diff, ping) => `पांग!(राउंड ट्रिप ने लिया: ${diff} एमएस। हार्टबीट: ${ping} एमएस।)`,
			COMMAND_INVITE: (url) => [
				`<${url}> स्काईरा को अपने डिस्कॉर्ड गिल्ड से जोड़ने के लिए`,
				'कुछ अनुमतियों को अनचेक करने से डरो मत, स्काईरा आपको बता देगी कि क्या आप अनुमतियों के बिना कमांड चलाने की कोशिश कर रहे हैं।'
			].join('\n'),
			COMMAND_HELP_DM: '📥 | आदेश आपके डीएम में भेज दिए गए हैं।',
			COMMAND_HELP_NODM: '❌ | आपके डीएम डिसेबल्ड है, मैं आपको डीएम में आदेश नहीं भेज सकती',

			COMMAND_CONF_NOKEY: 'आपको एक कुंजी प्रदान करनी होगी',
			COMMAND_CONF_NOVALUE: 'आपको एक मूल्य प्रदान करना होगा',
			COMMAND_CONF_LIST_TITLE: '= सर्वर सेटिंग्स =',
			COMMAND_CONF_SELECTKEY: (keys) => `कृपया, निम्न में से एक कुंजी के बीच चुनें: ${keys}`,
			COMMAND_CONF_ADDED: (key, value) => `कुंजी को \`${value}\` सफलतापूर्वक जोड़ा गया: \`${key}\``,
			COMMAND_CONF_UPDATED: (key, response) => `\`${key}\`: \`${response}\` कुंजी को सफलतापूर्वक अपडेट किया गया`,
			COMMAND_CONF_KEY_NOT_ARRAY: 'यह कुंजी अरे टाइप नहीं है। इसके बजाय \'रीसेट \' क्रिया का उपयोग करें',
			COMMAND_CONF_REMOVE: (key, value) => `कुंजी से मूल्य \`${value}\` को सफलतापूर्वक हटा दिया गया: \`${key}\``,
			COMMAND_CONF_GET: (key, value) => `कुंजी \`${key}\` के लिए मान है: \`${value}\``,
			COMMAND_CONF_RESET: (key, response) => `कुंजी \`${key}\` को \`${response}`` में रीसेट कर दिया गया है`,
			COMMAND_STATS: (STATS, UPTIME, USAGE) => [
				'= आँकड़े =',
				`• यूजर्स      :: ${STATS.USERS}`,
				`• सर्वर्स    :: ${STATS.GUILDS}`,
				`• चैनल्स   :: ${STATS.CHANNELS}`,
				`• Discord.js :: ${STATS.VERSION}`,
				`• Node.js    :: ${STATS.NODE_JS}`,
				'',
				'= सक्रिय रहने की अवधि =',
				`• मेज़बान       :: ${UPTIME.HOST}`,
				`• कुल      :: ${UPTIME.TOTAL}`,
				`• ग्राहक     :: ${UPTIME.CLIENT}`,
				'',
				'= होस्ट उपयोग =',
				`• सीपीयू लोड   :: ${USAGE.CPU_LOAD}`,
				`• RAM +Node  :: ${USAGE.RAM_TOTAL}`,
				`• RAM Usage  :: ${USAGE.RAM_USED}`
			].join('\n'),

			// Commands#tags
			COMMAND_TAGS_NAME_REQUIRED: 'आपको एक टैग नाम बताना होगा',
			COMMAND_TAGS_ADD_EXISTS: (tag) => `टैग '${tag}' पहले से मौजूद है।`,
			COMMAND_TAGS_CONTENT_REQUIRED: 'आपको इस टैग के लिए कुछ कंटेंट बताना होगा',
			COMMAND_TAGS_ADD_ADDED: (name, content) => `सफलतापूर्वक एक नया टैग जोड़ा गया: **${name} ${content}** की एक सामग्री के साथ`,
			COMMAND_TAGS_REMOVE_NOT_EXISTS: (tag) => `टैग '${tag}' मौजूद नहीं है`,
			COMMAND_TAGS_REMOVE_REMOVED: (name) => `**${name}** टैग सफलतापूर्वक हटा दिया गया`,
			COMMAND_TAGS_EDITED: (name, content, old) => `टैग **${name}**, को सफलतापूर्वक एडिट किया गया, जिसमें **${old} ${content}** की सामग्री थी`,
			COMMAND_TAGS_LIST_EMPTY: 'इस सर्वर के लिए टैग सूची खाली है।',

			// Commands#tools
			COMMAND_CALC: (time, output) => `|\`⚙\`| **हिसाब लगाया हुआ** (${time})${output}`,
			COMMAND_CALC_FAILURE: (time, output) => `|\`❌\`| **असफल** (${time})${output}`,

			COMMAND_COLOR: (hex, rgb, hsl) => [
				`HEX: **${hex}**`,
				`RGB: **${rgb}**`,
				`HSL: **${hsl}**`
			].join('\n'),

			COMMAND_CURRENCYLAYER_INPUT: (input) => `${input} या तो मान्य मुद्रा नहीं है या एपीआई द्वारा स्वीकार नहीं किया गया है।`,
			COMMAND_CURRENCYLAYER_ERROR: 'मुझे खेद है, लेकिन एपीआई ने एक बुरा उत्तर दिया।',
			COMMAND_CURRENCYLAYER: (money, input, output, converted) => `**${money}** \`${input}\`' से \`${output}\` बराबर: ${converted}`,

			COMMAND_DEFINE_NOTFOUND: 'मैं इस शब्द के लिए कोई परिभाषा नहीं ढूंढ सकी',
			COMMAND_DEFINE: (input, output) => `\`${input}\` के लिए परिणाम खोजे: \n${output}`,

			COMMAND_EMOJI_CUSTOM: (emoji, id) => [
				`→ \`Emoji\` :: **${emoji}**`,
				'→ `टाइप` :: **कस्टम**',
				`→ \`ID\` :: **${id}**`
			].join('\n'),
			COMMAND_EMOJI_TWEMOJI: (emoji, id) => [
				`→ \`Emoji\` :: \\${emoji}`,
				'→ `टाइप` :: **Twemoji**',
				`→ \`ID\` :: **${id}**`
			].join('\n'),
			COMMAND_EMOJI_INVALID: (emoji) => `'${emoji}' एक मान्य इमोजी नहीं है`,

			COMMAND_GOOGL_LONG: (url) => `**छोटा किया हुआ यूआरएल: [${url}](${url})**`,
			COMMAND_GOOGL_SHORT: (url) => `**विस्तारित यूआरएल: [${url}](${url})**`,

			COMMAND_QUOTE_MESSAGE: 'यह बहुत अजीब है, लेकिन कहे हुए संदेश में कोई सामग्री नहीं है और न ही एक छवि है।',

			COMMAND_ROLES_LIST_EMPTY: 'इस सर्वर में सार्वजनिक रोल के रूप में कोई रोल नहीं है',
			COMMAND_ROLES_LIST_TITLE: (guild) => `${guild} के लिए सार्वजनिक रोल की सूची`,
			COMMAND_ROLES_CLAIM_EXISTENT: (roles) => `आपके पास पहले से ही निम्न रोल्स हैं: \`${roles}\``,
			COMMAND_ROLES_CLAIM_GIVEN: (roles) => `आपकी प्रोफ़ाइल में निम्न रोल्स जोड़ दी गई हैं: \`${roles}\``,
			COMMAND_ROLES_UNCLAIM_UNEXISTENT: (roles) => `आपके पास निम्न रोल्स नहीं है: \`${roles}\``,
			COMMAND_ROLES_UNCLAIM_REMOVED: (roles) => `आपकी प्रोफ़ाइल से निम्न रोल्स को निकाल दिया गया है: \`${roles}\``,
			COMMAND_ROLES_NOT_PUBLIC: (roles) => `निम्न रोल्स सार्वजनिक नहीं हैं: \`${roles}\``,
			COMMAND_ROLES_NOT_FOUND: (roles) => `रोल्स नहीं मिले: \`${roles}\``,

			COMMAND_SERVERINFO_TITLE: (name, id) => `**${name}** के आंकड़े (आईडी: **${id}**)`,
			COMMAND_SERVERINFO_TITLES: {
				CHANNELS: 'चैनल्स',
				MEMBERS: 'सदस्य',
				OTHER: 'अन्य',
				USERS: 'यूजर'
			},
			COMMAND_SERVERINFO_CHANNELS: (text, voice, categories, afkChannel, afkTime) => [
				`• **${text}** टेक्स्ट, **${voice}** आवाज़, **${categories}** श्रेणियां.`,
				`• AFK: ${afkChannel ? `**<#${afkChannel}> ${afkTime / 60}** मिनट के बाद` : '**कोई नहीं**'}`
			].join('\n'),
			COMMAND_SERVERINFO_MEMBERS: (count, owner) => [
				`• **${count}** सदस्य`,
				`• मालिक: **${owner.tag}**`,
				`  (आईडी: **${owner.id}**)`
			].join('\n'),
			COMMAND_SERVERINFO_OTHER: (size, region, createdAt, verificationLevel) => [
				`• रोल्स: **${size}**`,
				`• क्षेत्र: **${region}**`,
				`• पर बनाया गया: **${moment.utc(createdAt).format('D/M/YYYY, HH:mm:ss')}** (UTC - DD/MM/YYYY)`,
				`• जाँच का स्तर: **${this.HUMAN_LEVELS[verificationLevel]}**`
			].join('\n'),
			COMMAND_SERVERINFO_USERS: (online, offline, percentage, newbies) => [
				`• ऑनलाइन/ऑफ़लाइन यूजर्स: **${online}**/**${offline}** (${percentage}% ऑनलाइन यूजर्स)`,
				`• **${newbies}** पिछले 24 घंटों के भीतर नए यूजर्स`
			].join('\n'),

			COMMAND_ROLEINFO_TITLES: { PERMISSIONS: 'अनुमतियाँ' },
			COMMAND_ROLEINFO_DESCRIPTION: (role) => [
				`आईडी: **${role.id}**`,
				`नाम: **${role.name}**`,
				`रंग: **${role.hexColor}**`,
				`फहराया: **${role.hoist ? 'हाँ' : 'नहीं'}**`,
				`पोजीशन: **${role.rawPosition}**`,
				` उल्लेखनीय: **${role.mentionable ? 'हाँ' : 'नहीं'}**`,
				`सदस्यों की संख्या: **${role.members.size}**`
			].join('\n'),
			COMMAND_ROLEINFO_PERMISSIONS: (permissions) => permissions.length > 0 ? permissions.map(key => `+ **${PERMS[key]}**`) : 'अनुमति नहीं दी गई',

			COMMAND_URBAN_NOTFOUND: 'मुझे खेद है, जो शब्द आप खोज रहे हैं उसे अर्बन शब्दकोश में परिभाषित नहीं किया गया है एक और शब्द की कोशिश करें?',
			COMMAND_URBAN_INDEX_NOTFOUND: 'आप एक निचले पृष्ठ नंबर की कोशिश करना चाहेंगे',
			SYSTEM_TEXT_TRUNCATED: (definition, url) => `${definition}... [पढ़ना जारी रखें](${url})`,
			COMMAND_URBAN_DESCRIPTION: (index, pages, definition, example, author) => [
				`→ \`परिभाषा\` :: ${index}/${pages}\n_${definition}`,
				`→ \`उदाहरण\` :: ${example}`,
				`→ \`लेखक\` :: ${author}`
			].join('\n\n'),

			COMMAND_WHOIS_MEMBER: (member) => [
				`${member.nickname ? `aka **${member.nickname}**.\n` : ''}`,
				`\`${member.user.id}\` की एक आईडी के साथ,`,
				`यह यूजर **${member.user.presence.status}**${member.user.presence.game ? `, खेल रहा है: **${member.user.presence.game.name}**` : '.'}`,
				'\n',
				`\n${moment.utc(member.user.createdAt).format('D/MM/YYYY [at] HH:mm:ss')} को डिस्कॉर्ड ज्वाइन करा`,
				`\n${moment.utc(member.joinedAt).format('D/MM/YYYY [at] HH:mm:ss')} को ${member.guild.name} ज्वाइन करा`
			].join(' '),
			COMMAND_WHOIS_MEMBER_ROLES: '→ `रोल्स`',
			COMMAND_WHOIS_USER: (user) => [
				`\`${user.id}\` की एक आईडी के साथ`,
				'\n',
				`${moment.utc(user.createdAt).format('D/MM/YYYY [at] HH:mm:ss')} को डिस्कॉर्ड ज्वाइन करा`
			].join(' '),

			COMMAND_WIKIPEDIA_NOTFOUND: 'मुझे खेद है, मुझे विकिपीडिया में आपके इनपुट से मिलता हुआ कुछ नहीं मिला।',

			COMMAND_YOUTUBE_NOTFOUND: 'मुझे खेद है, मुझे YouTube में आपके इनपुट से मिलता हुआ कुछ नहीं मिला।',
			COMMAND_YOUTUBE_INDEX_NOTFOUND: 'आप छोटे पेज इंडेक्स की कोशिश करना चाहेंगे क्योंकि मैं इसमें कुछ नहीं ढूंढ पा रही हूं।',

			// Commands#weather
			COMMAND_WEATHER_ERROR_ZERO_RESULTS: 'आपके अनुरोध ने कोई परिणाम नहीं दिया।',
			COMMAND_WEATHER_ERROR_REQUEST_DENIED: 'GeoCode API अनुरोध को अस्वीकार कर दिया गया था।',
			COMMAND_WEATHER_ERROR_INVALID_REQUEST: 'अमान्य अनुरोध।',
			COMMAND_WEATHER_ERROR_OVER_QUERY_LIMIT: 'क्वेरी सीमा पार हो गई, कल दुबारा कोशिश करना।',
			COMMAND_WEATHER_ERROR_UNKNOWN: 'अज्ञात एरर',

			// Modlogs
			MODLOG_APPEALED: 'चयनित मॉडरेशन केस को पहले ही अपील कर दिया गया है।',
			MODLOG_TIMED: (remaining) => `यह क्रिया पहले से निर्धारित है और ${duration(remaining)} में समाप्त हो रही है`,
			MODLOG_PENDING_REASON: (prefix, number) => `इस केस का दावा करने के लिए ${prefix}कारण ${number} का उपयोग करें`,

			// Giveaways
			GIVEAWAY_TIME: 'एक गिवअवे कम से कम 1 मिनट तक रहना चाहिए।',
			GIVEAWAY_ENDS_AT: 'खतम होता है:',
			GIVEAWAY_DURATION: (time) => `यह गिवअवे **${duration(time)}** में समाप्त होता है! शामिल होने के लिए 🎉 के साथ इस संदेश पर प्रतिक्रिया दें`,
			GIVEAWAY_TITLE: '🎉 **गिवअवे** 🎉',
			GIVEAWAY_START_DIRECT_MESSAGE: (title, id) => [
				`नमस्कार! मैं आपको अपडेट करुँगी! आपके गिवअवे (**${title}** | आईडी \`${id}\`) समाप्त होने पर, मैं आपको 10 अन्य संभावित विजेताओं की सूची के साथ विजेता भेजूंगी`,
				`गिवअवे रद्द या बंद करने की क्षमता की सुविधा जल्द ही आ रही है!`
			].join('\n'),
			GIVEAWAY_LASTCHANCE: (time) => `**अंतिम अवसर**! बचा हुआ समय: **${duration(time)}** शामिल होने के लिए 🎉 के साथ इस संदेश पर प्रतिक्रिया दें`,
			GIVEAWAY_LASTCHANCE_TITLE: '🎉 **अंतिम गिवअवे अवसर** 🎉',
			GIVEAWAY_ENDED: (winner) => `विजेता: ${winner} (${winner.id})`,
			GIVEAWAY_ENDED_AT: 'समाप्त हुआ:',
			GIVEAWAY_ENDED_TITLE: '🎉 **गिवअवे समाप्त हुआ** 🎉',
			GIVEAWAY_ENDED_MESSAGE: (mention, title) => `बधाई ${mention}! आपने गिवअवे जीत लिया है **${title}**`,
			GIVEAWAY_ENDED_DIRECT_MESSAGE: (title, id, winner, amount, list) => [
				`नमस्कार! आपके द्वारा दिया गया गिवअवे (**${title}** | आईडी \`${id}\`) अभी समाप्त हो गया! विजेता ${winner.tag} (${winner.id}) है`,
				`हालांकि, मैंने एक और ${amount} संभव विजेताओं की गणना की है: ${list}`
			].join('\n'),
			GIVEAWAY_ENDED_DIRECT_MESSAGE_ONLY_WINNER: (title, id, winner) => `नमस्कार! आपके द्वारा दिया गया गिवअवे (**${title}** | आईडी \`${id}\`) अभी समाप्त हो गया! विजेता ${winner.tag} (${winner.id}) है`,
			GIVEAWAY_ENDED_DIRECT_MESSAGE_NO_WINNER: (title, id) => `नमस्कार! आपके द्वारा दिया गया गिवअवे (**${title}** | आईडी \`${id}\`) अभी समाप्त हो गया! लेकिन कोई विजेता नहीं है!`,

			// System only
			SYSTEM_DM_SENT: 'मैंने आपको डीएम में संदेश भेजा है',
			SYSTEM_DM_FAIL: 'मैं आपको डीएम में एक संदेश नहीं भेज सकती, क्या आपने मुझे ब्लॉक कर दिया?',
			SYSTEM_FETCHING: '`खोज कर...`',
			SYSTEM_PROCESSING: '`प्रसंस्करण...`',
			SYSTEM_HIGHEST_ROLE: 'इस भूमिका की पदानुक्रम स्थिति मुझसे अधिक या बराबर है, मैं इसे किसी को भी देने में सक्षम नहीं हूं।',
			SYSTEM_CHANNEL_NOT_POSTABLE: 'मुझे इस चैनल पर संदेश भेजने की अनुमति नहीं है',
			SYSTEM_FETCHBANS_FAIL: `मैं प्रतिबंधों को खोजने में असमर्थ हूँ क्या मेरे पास ${PERMS.BAN_MEMBERS} अनुमति है?`,
			SYSTEM_LOADING: '`लोड हो रहा है... कृपया प्रतीक्षा करें।`',
			SYSTEM_ERROR: 'कुछ हुआ!',
			SYSTEM_MESSAGE_NOT_FOUND: 'मुझे खेद है, लेकिन या तो आपने संदेश आईडी को गलत तरीके से लिखा है, या इसे हटा दिया गया है।',

			LISTIFY_PAGE: (page, pageCount, results) => `पेज ${page} / ${pageCount} | ${results} कुल`,

			COMMAND_SUCCESS: 'आदेश को सफलतापूर्वक पूरा किया गया',

			GUILD_SETTINGS_CHANNELS_MOD: 'इस कमांड को काम करने के लिए एक मॉडेल चैनल की आवश्यकता है',
			GUILD_SETTINGS_ROLES_MUTED: 'इस कमांड को म्यूट के लिए एक कॉन्फ़िगर रोल की आवश्यकता है',
			GUILD_BANS_EMPTY: 'इस सर्वर पर कोई रजिस्टर्ड बैन नहीं है।',
			GUILD_BANS_NOT_FOUND: 'कृपया, एक मान्य यूजर आईडी या टैग लिखें।',
			GUILD_MUTE_NOT_FOUND: 'यह यूजर म्यूटेड नहीं है',
			CHANNEL_NOT_READABLE: `मुझे क्षमा करें, लेकिन मुझे **${PERMS.VIEW_CHANNEL}** अनुमति की आवश्यकता है`,

			USER_NOT_IN_GUILD: 'यह यूजर इस सर्वर में नहीं है',

			EVENTS_GUILDMEMBERADD: 'यूजर शामिल हो गए',
			EVENTS_GUILDMEMBERADD_MUTE: 'म्यूटेड यूजर शामिल हो गए',
			EVENTS_GUILDMEMBERADD_RAID: 'छापे का पता लगाया',
			EVENTS_GUILDMEMBERREMOVE: 'यूजर ने छोड़ दिया',
			EVENTS_GUILDMEMBER_UPDATE_NICKNAME: (previous, current) => `**${previous}** से **${current}** के उपनाम को अपडेट किया गया`,
			EVENTS_GUILDMEMBER_ADDED_NICKNAME: (previous, current) => `एक नया उपनाम जोड़ा गया **${current}**`,
			EVENTS_GUILDMEMBER_REMOVED_NICKNAME: (previous) => `उपनाम **${previous}** हटा दिया गया`,
			EVENTS_GUILDMEMBER_UPDATE_ROLES: (removed, added) => `${removed.length > 0 ? `${removed.length > 1 ? 's' : ''} रोल हटा दिया: ${removed.join(', ')}\n` : ''}${added.length > 0 ? `${added.length > 1 ? 's' : ''} रोल जोड़ा: ${added.join(', ')}` : ''}`,
			EVENTS_MESSAGE_UPDATE: 'संदेश एडिट कर दिया गया',
			EVENTS_MESSAGE_DELETE: 'संदेश हटाये',
			EVENTS_MESSAGE_DELETE_MSG: (msg) => msg.substring(0, 1900),
			EVENTS_COMMAND: (command) => `कमांड इस्तेमाल किया: ${command}`,
			EVENTS_STREAM_START: (member) => `यूजर ** ${member.user.tag} ** अब लाइव है! **${member.presence.game.name}**\n${member.presence.game.url}`,
			EVENTS_STREAM_STOP: (member) => `यूजर **${member.user.tag}** अब लाइव नहीं है!`,
			EVENTS_STARBOARD_SELF: (user) => `प्रिय ${user}, आप अपने खुद के मैसेज स्टार नहीं कर सकते`,
			EVENTS_STARBOARD_BOT: (user) => `प्रिय ${user}, आप बोट के संदेशों को स्टार नहीं कर सकते`,
			EVENTS_STARBOARD_EMPTY: (user) => `प्रिय ${user}, आप रिक्त संदेशों को स्टार नहीं कर सकते।`,

			SETTINGS_DELETE_CHANNELS_DEFAULT: 'हटाए गए सेटिंग्स चैनल :: डिफ़ॉल्ट',
			SETTINGS_DELETE_ROLES_INITIAL: 'हटाए गए सेटिंग रोल्स :: प्रारंभिक',
			SETTINGS_DELETE_ROLES_MUTE: 'हटाए गए सेटिंग रोल्स :: म्यूट',

			PROMPT_CANCEL: 'प्रॉम्प्ट रद्द कर दिया गया है।',
			PROMPT_ARGUMENT: 'पैरामीटर',
			PROMPT_MESSAGE: 'किसी संदेश के लिए एक मान्य संख्यात्मक आईडी लिखें ध्यान रखें कि आपको डेवलपर मोड की आवश्यकता होगी, और संदेश इस चैनल से संबंधित होना चाहिए।',
			PROMPT_USER: 'एक यूजर का उल्लेख करे, आईडी लिखें, या यूज़रनेम का एक हिस्सा।',
			PROMPT_MEMBER: 'इस सर्वर से एक सदस्य का उल्लेख करें, आईडी लिखें, या यूज़रनेम का एक हिस्सा।',
			PROMPT_CHANNEL: 'एक चैनल का उल्लेख करें, अपना आईडी, या उसके नाम का एक हिस्सा लिखें।',
			PROMPT_GUILD: 'किसी सर्वर के लिए एक मान्य संख्यात्मक आईडी लिखें ध्यान रखें कि आपको डेवलपर मोड की आवश्यकता होगी, और मुझे इसमें शामिल होना चाहिए।',
			PROMPT_ROLE: 'एक रोल का उल्लेख करें, अपनी आईडी, या उसके नाम का एक हिस्सा लिखें।',
			PROMPT_BOOLEAN: 'इस संदेश का जवाब `हां` या `ना` में दें।',
			PROMPT_STRING: 'कृपया, इस संदेश का जवाब कुछ तो दें।',
			PROMPT_INTEGER: 'एक पूर्णांक के साथ इस संदेश का जवाब दें।',
			PROMPT_NUMBER: 'एक नंबर के साथ इस संदेश का उत्तर दें।',
			PROMPT_URL: 'एक मान्य यूआरएल के साथ इस संदेश का जवाब दें।',
			PROMPT_ATTACHMENT: 'इस चैनल में एक फ़ाइल अटैच करें या एक वैध अटैचमेंट यूआरएल प्रदान करें।।',

			TYPES_MEMBER_ROLE_UPDATE: 'सदस्य रोल अपडेट',
			TYPES_MEMBER_NICKNAME_UPDATE: 'सदस्य निकनेम अपडेट',

			LISTIFY_INVALID_INDEX: 'अमान्य सूचकांक, एक पूर्णांक की अपेक्षा',
			REQUIRE_USER: 'आपको एक वैध यूजर नाम, टैग, या उल्लेख करना चाहिए।',
			REQUIRE_ROLE: 'आपको एक मान्य रोल नाम या उल्लेख करना चाहिए',

			ERROR_WTF: 'क्या भयानक असफलता! मैं बहुत शर्मिंदा हूं!',
			ERROR_STRING: (mention, message) => `प्रिय ${mention}, ${message}`,

			CONST_USERS: 'यूजर्स'
		};
	}

};
