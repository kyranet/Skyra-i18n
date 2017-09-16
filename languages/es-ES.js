// Unfinished. Progress to Line:252

const { Language, util } = require('../index');
const Duration = require('../utils/duration');
const moment = require('moment');

const TIMES = {
    DAY: {
        PLURAL: 'días',
        SING: 'día',
        SHORT_PLURAL: 'ds',
        SHORT_SING: 'd'
    },
    HOUR: {
        PLURAL: 'horas',
        SING: 'hora',
        SHORT_PLURAL: 'hrs',
        SHORT_SING: 'hr'
    },
    MINUTE: {
        PLURAL: 'minutos',
        SING: 'minuto',
        SHORT_PLURAL: 'mins',
        SHORT_SING: 'min'
    },
    SECOND: {
        PLURAL: 'segundos',
        SING: 'segundo',
        SHORT_PLURAL: 'segs',
        SHORT_SING: 'seg'
    }
};

const PERMS = {
    // General
    ADMINISTRATOR: 'Administrador',
    VIEW_AUDIT_LOG: 'Ver el Registro de Autoría',
    MANAGE_GUILD: 'Administrar el Servidor',
    MANAGE_ROLES: 'Administrar Roles',
    MANAGE_CHANNELS: 'Administrar Canales',
    KICK_MEMBERS: 'Expulsar Miembros',
    BAN_MEMBERS: 'Bloquear Miembros',
    CREATE_INSTANT_INVITE: 'Crear Invitación Instantánea',
    CHANGE_NICKNAME: 'Cambiar Apodo',
    MANAGE_NICKNAMES: 'Administrar Apodos',
    MANAGE_EMOJIS: 'Administrar Emojis',
    MANAGE_WEBHOOKS: 'Administrar Webhooks',
    VIEW_CHANNEL: 'Leer Mensajes',
    SEND_MESSAGES: 'Enviar Mensajes',
    SEND_TTS_MESSAGES: 'Enviar Mensajes de TTS',
    MANAGE_MESSAGES: 'Administrar Mensajes',
    EMBED_LINKS: 'Insertar Enlaces',
    ATTACH_FILES: 'Adjuntar Archivos',
    READ_MESSAGE_HISTORY: 'Leer el Historial de Mensajes',
    MENTION_EVERYONE: 'Mencionar a Todos',
    USE_EXTERNAL_EMOJIS: 'Usar Emojis Externos',
    ADD_REACTIONS: 'Añadir Reacciones',
    CONNECT: 'Conectar',
    SPEAK: 'Hablar',
    MUTE_MEMBERS: 'Silenciar Miembros',
    DEAFEN_MEMBERS: 'Ensordecer Miembros',
    MOVE_MEMBERS: 'Mover Miembros',
    USE_VAD: 'Usar la Actividad de Voz'
};

const random = num => Math.round(Math.random() * num);

const EIGHT_BALL = {
    WHEN: ['Pronto™', 'Quizá mañana.', 'Quizá el año que viene...', 'Ahora mismo.', 'En unos cuantos meses.'],
    WHAT: ['Un avión.', '¿Qué? Pregunta de nuevo.', '¡Un regalo!', 'Nada.', 'Un anillo.', 'No lo sé, quizá sea algo.'],
    HOWMUCH: ['Un montón.', 'Un poco.', 'Un poquillo.', 'Pregúnteme mañana.', 'No lo sé, pregúntaselo a un físico.', 'Absolutamente nada.', `Entre ${random(10)} y ${random(1000)}L.`, `${random(10)}e${random(1000)}L.`, '2 o 3 litros, no recuerdo.', '¡Infinito!', '1010 litros.'],
    HOWMANY: ['Un montón.', 'Un poco.', 'Un poquillo.', 'Pregúnteme mañana.', 'No lo sé, pregúntaselo a un físico.', 'Absolutamente nada.', `Entre ${random(10)} y ${random(1000)}.`, `${random(10)}e${random(1000)}.`, '2 o 3, no recuerdo.', '¡Infinito!', '1010.'],
    WHY: ['Probablemente genética.', 'Porque alguien decidió que fuera así.', '¡Por la gloria de Satán, por supuesto!', 'No lo sé, quizás fuese el destino.', 'Porque lo dije yo.', 'No tengo ni idea.', 'Harambe no hizo nada malo.', 'Uhm... pregúntale al dueño del servidor.', 'Pregunta de nuevo.', 'Para llegar al otro lado.', 'Lo dice en la Biblia.'],
    WHO: ['Un humano.', 'Un robot.', 'Un avión.', 'Un pájaro.', 'Una composición de carbono.', 'Un puñado de zeros y unos.', 'No tengo ni idea, ¿es material?', 'Eso no es lógico.'],
    ELSE: ['Probablemente.', 'No.', '¡SÍ!', 'Quizás.']
};

const duration = (time, short) => Duration.duration(time, TIMES, short);

module.exports = class extends Language {

    constructor(...args) {
        super(...args);
        this.PERMISSIONS = PERMS;
        this.EIGHT_BALL = EIGHT_BALL;

        // Gotta check it out of streaming
        this.HUMAN_LEVELS = {
            0: 'None',
            1: 'Low',
            2: 'Medium',
            3: '(╯°□°）╯︵ ┻━┻',
            4: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
        };

        this.language = {
            DEFAULT: (key) => `${key} no ha sido traducido para es-ES todavía.`,
            DEFAULT_LANGUAGE: 'Lenguaje Predeterminado',

            SETTING_GATEWAY_FOLDER_NOTEXISTS: (folder) => `La clave '${folder}' no existe en el esquema de configuración actual.`,
            SETTING_GATEWAY_KEY_NOTEXISTS: (folder, key) => `La clave \`${folder}\`::\`${key}\` no existe en el esquema de configuración actual.`,
            SETTING_GATEWAY_ADD_OR_REMOVE: 'El parámetro de tipo debe ser o \'add\' o \'remove\'.',
            SETTING_GATEWAY_NOT_ARRAY: (folder, key) => `La clave \`${folder}\`::\`${key}\` no acepta múltiples valores.`,
            SETTING_GATEWAY_REQUIRE_VALUE: 'Debes especificar el valor para añadir o remover.',
            SETTING_GATEWAY_ARRAY_ADD_EXISTS: (folder, key, data) => `El valor ${data} para la clave \`${folder}\`::\`${key}\` ya existe.`,
            SETTING_GATEWAY_ARRAY_REMOVE_NOTEXISTS: (folder, key, data) => `El valor ${data} para la clave \`${folder}\`::\`${key}\` ya existe.`,

            RESOLVER_INVALID_PIECE: (name, piece) => `'${name}' debe ser una pieza válida de tipo ${piece}.`,
            RESOLVER_INVALID_MSG: (name) => `'${name}' debe ser una ID de mensaje válida.`,
            RESOLVER_INVALID_USER: (name) => `'${name}' debe ser una mención o una ID de usuario válida.`,
            RESOLVER_INVALID_MEMBER: (name) => `'${name}' debe ser una mención o una ID de usuario válida.`,
            RESOLVER_INVALID_CHANNEL: (name) => `'${name}' debe ser una mención o una ID de un canal válida.`,
            RESOLVER_INVALID_TEXTCHANNEL: (name) => `'${name}' debe ser una mención o una ID de un canal de texto válida.`,
            RESOLVER_INVALID_VOICECHANNEL: (name) => `'${name}' debe ser una mención o una ID de un canal de voz válida.`,
            RESOLVER_INVALID_GUILD: (name) => `'${name}' debe ser una ID de servidor válida.`,
            RESOLVER_INVALID_ROLE: (name) => `'${name}' debe ser una mención o una ID de rol válida.`,
            RESOLVER_INVALID_LITERAL: (name) => `Su opción no coincide con la única posibilidad: '${name}'`,
            RESOLVER_INVALID_BOOL: (name) => `'${name}' debe ser o 'true' o 'false'.`,
            RESOLVER_INVALID_INT: (name) => `'${name}' debe ser un número entero válido.`,
            RESOLVER_INVALID_FLOAT: (name) => `'${name}' debe ser un número válido.`,
            RESOLVER_INVALID_URL: (name) => `'${name}' debe ser un enlace válido.`,
            RESOLVER_INVALID_ATTACHMENT: (name) => `'${name}' debe ser un archivo adjuntado o un enlace válido.`,
            RESOLVER_STRING_SUFFIX: ' carácteres',
            RESOLVER_MINMAX_EXACTLY: (name, min, suffix) => `'${name}' debe ser exactamente ${min}${suffix}.`,
            RESOLVER_MINMAX_BOTH: (name, min, max, suffix) => `'${name}' debe ser entre ${min} y ${max}${suffix}.`,
            RESOLVER_MINMAX_MIN: (name, min, suffix) => `'${name}' debe ser mayor que ${min}${suffix}.`,
            RESOLVER_MINMAX_MAX: (name, max, suffix) => `'${name}' debe ser menor que ${max}${suffix}.`,
            RESOLVER_POSITIVE_AMOUNT: 'Un número positivo mayor que cero es requerido para este argumento.',

            COMMANDMESSAGE_MISSING: 'Faltan uno o más argumentos requeridos al final de su mensaje.',
            COMMANDMESSAGE_MISSING_REQUIRED: (name) => `'${name}' es un argumento requerido.`,
            COMMANDMESSAGE_MISSING_OPTIONALS: (possibles) => `Falta una opción requerida: (${possibles})`,
            COMMANDMESSAGE_NOMATCH: (possibles) => `No coincide con ninguna de las posibilidades: (${possibles})`,

            CONST_MONITOR_INVITELINK: 'Enlace de Invitación',
            CONST_MONITOR_NMS: '[NOMENTIONSPAM]',
            CONST_MONITOR_WORDFILTER: 'Palabra Bloqueada',

            // Monitors
            MONITOR_NOINVITE: (user) => `|\`❌\`| Querido ${user}, las invitaciones instantáneas no están permitidos aquí.`,
            MONITOR_WORDFILTER: (user) => `|\`❌\`| Perdón, ${user}, pero has dicho algo que no está permitido en este servidor.`,
            MONITOR_NMS_MESSAGE: (user) => [
                `El MJOLNIR ha aterrizado y ahora, el usuario ${user.tag} cuya ID es ${user.id} ha sido baneado por spamming de menciones.`,
                '¡No te preocupes! ¡Estoy aquí para ayudarte! 😄'
            ].join('\n'),
            MONITOR_NMS_MODLOG: (threshold, amount) => `[NOMENTIONSPAM] Umbral: ${threshold}. Alcanzado: ${amount}`,
            MONITOR_COMMAND_HANDLER_REPROMPT: (tag, error) => `${tag} | **${error}** | Tienes **30** segundos para responder a este mensaje con un argumento válido. Escribe **"ABORT"** para abortar este mensaje emergente.`,
            MONITOR_COMMAND_HANDLER_ABORTED: 'Abortado',
            MONITOR_SOCIAL_ACHIEVEMENT: '¡Felicidades %MEMBER! ¡Has logrado el rol %ROLE%!',

            // Inhibitors
            INHIBITOR_COOLDOWN: (remaining) => `Acabas de usar este comando. Puedes usarlo de nuevo en ${remaining} segundos.`,
            INHIBITOR_GUILDONLY: 'Este comando está diseñado para funcionar en servidores.',
            INHIBITOR_DISABLED: 'Este comando está desactivado.',
            INHIBITOR_MISSING_BOT_PERMS: (missing) => `Permisos insuficientes, necesito: **${missing.map(perm => PERMS[perm] || perm)}**`,
            INHIBITOR_PERMISSIONS: 'No tienes permiso para usar este comando.',
            INHIBITOR_SPAM: (channel) => `¿Podemos movernos al canal ${channel}, por favor? Este comando puede ser muy molesto y arruinar las conversaciones de otras personas.`,

            // Commands#anime
            COMMAND_ANIME_DESCRIPTION: (entry, context) => [
                `**Título Inglés:** ${entry.english}`,
                `${context.length > 750 ? `${util.splitText(context, 750)}... [continúa leyendo](https://myanimelist.net/anime/${entry.id})` : context}`
            ],
            COMMAND_ANIME_TITLE: (entry) => `${entry.title} (${entry.episodes === 0 ? 'desconocido' : entry.episodes} episodios)`,
            COMMAND_ANIME_STATUS: (entry) => [
                `  ❯  Estado actual: **${entry.status}**`,
                `    • Empezó en: **${entry.start_date}**\n${entry.end_date === '0000-00-00' ? '' : `    • Terminó en: **${entry.end_date}**`}`
            ],
            COMMAND_MANGA_DESCRIPTION: (entry, context) => [
                `**Título Inglés:** ${entry.english}`,
                `${context.length > 750 ? `${util.splitText(context, 750)}... [continúa leyendo](https://myanimelist.net/anime/${entry.id})` : context}`
            ],
            COMMAND_MANGA_TITLE: (entry) => `${entry.title} (${entry.chapters ? 'desconocido' : entry.chapters} capítulos${entry.volumes ? '' : ` y ${entry.volumes} volúmenes`})`,
            COMMAND_MANGA_STATUS: (entry) => [
                `  ❯  Estado actual: **${entry.status}**`,
                `    • Empezó en: **${entry.start_date}**\n${entry.end_date === '0000-00-00' ? '' : `    • Terminó en: **${entry.end_date}**`}`
            ],
            COMMAND_ANIME_TITLES: {
                TYPE: 'Tipo',
                SCORE: 'Puntuación',
                STATUS: 'Estado',
                WATCH_IT: 'Míralo aquí:'
            },

            // Commands#fun
            COMMAND_8BALL: (author, input, output) => `🎱 Pregunta por ${author}: *${input}*\n${output}`,
            COMMAND_8BALL_NOT_QUESTION: 'Eso no parece ser una pregunta.',
            COMMAND_8BALL_QUESTIONS: {
                WHEN: 'cuándo',
                WHAT: 'qué',
                HOW_MUCH: 'cuánto',
                HOW_MANY: 'cuánto',
                WHY: 'por qué',
                WHO: 'quién'
            },
            COMMAND_CATFACT: 'Hecho Gatuno',
            COMMAND_DICE: (sides, rolls, result) => `has lanzado el dado de **${sides}** lados **${rolls}** veces, obtienes: **${result}**`,
            COMMAND_NORRIS: 'Chuck Norris',
            COMMAND_RATE: (user, rate, emoji) => `Uhm, le daría a **${user}** un **${rate}**/100 ${emoji}`,
            COMMAND_RATE_MYSELF: ['Me amo un montón a mí misma 😊', 'a mí misma'],
            COMMAND_RNG: (user, word) => `🕺 *Pito, pito, gorgorito, ¿dónde vas tan bonito, a la era verdadera...?* ${user}, Elijo:${util.codeBlock('', word)}`,
            COMMAND_RNG_MISSING: 'Por favor, introduce al menos dos opciones separadas por una coma.',
            COMMAND_RNG_DUP: (words) => `¿Por qué aceptaría palabras duplicadas? '${words}'.`,
            COMMAND_XKCD_COMICS: (amount) => `Sólo hay ${amount} comics.`,

            // Commands#misc
            COMMAND_UNICODE: (string) => `Ahí tienes tu mensaje convertido:\n${string}`,

            // Commands#moderation
            // ## Utilities
            COMMAND_PERMISSIONS: (username, id) => `Lista de Permisos para ${username} (${id})`,
            COMMAND_RAID_DISABLED: 'El sistema Anti-RAID no está activado en este servidor.',
            COMMAND_RAID_MISSING_KICK: `Como no tengo el permiso ${PERMS.KICK_MEMBERS}, he mantenido el sistema Anti-RAID desactivado.`,
            COMMAND_RAID_LIST: 'Lista de usuarios en la Lista RAID',
            COMMAND_RAID_CLEAR: 'Vaciada la Lista RAID con éxito.',
            COMMAND_RAID_COOL: 'Desactivado el sistema RAID con éxito.',
            COMMAND_FLOW: (amount) => `Una cantidad de ${amount} mensajes fueron enviados durante el último minuto.`,
            COMMAND_TIME_TIMED: 'El caso de moderación seleccionado ya ha sido temporizado.',
            COMMAND_TIME_UNDEFINED_TIME: 'Debes especificar un tiempo.',
            COMMAND_TIME_UNSUPPORTED_TIPE: 'El tipo de acción por el caso de moderación seleccionado no es reversible, por lo tanto, esta acción no está soportada.',
            COMMAND_TIME_NOT_SCHEDULED: 'Esta tarea no está temporizada.',
            COMMAND_TIME_ABORTED: (title) => `Abortada la tarea ${title} con éxito.`,
            COMMAND_TIME_SCHEDULED: (title, user, time) => `✅ Temporizada una acción de tipo **${title}** para el usuario ${user.tag} (${user.id}) con una duración de ${duration(time)}`,

            // ## General
            COMMAND_BAN_NOT_BANNABLE: 'El objetivo no puede ser baneado por mí.',
            COMMAND_BAN_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **BANEADO**: ${user.tag} (${user.id})${reason ? `\nMotivo: ${reason}` : ''}`,
            COMMAND_SOFTBAN_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **EXPULSADO**: ${user.tag} (${user.id})${reason ? `\nMotivo: ${reason}` : ''}`,
            COMMAND_UNBAN_MESSAGE: (user, reason, banReason, log) => `|\`🔨\`| [Case::${log}] **DESBANEADO**: ${user.tag} (${user.id})${reason ? `\nMotivo: ${reason}` : ''}${banReason ? `\nMotivo por el baneo previo: ${banReason}` : ''}`,
            COMMAND_UNBAN_MISSING_PERMISSION: `Necesitaré el permiso ${PERMS.BAN_MEMBERS} para poder ser capaz de des-banearlo.`,
            COMMAND_KICK_NOT_KICKABLE: 'El objetivo no puede ser echado por mí.',
            COMMAND_KICK_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **ECHADO**: ${user.tag} (${user.id})${reason ? `\nMotivo: ${reason}` : ''}`,
            COMMAND_MUTE_MUTED: 'El objetivo ya está silenciado.',
            COMMAND_MUTE_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **SILENCIADO**: ${user.tag} (${user.id})${reason ? `\nMotivo: ${reason}` : ''}`,
            COMMAND_MUTE_USER_NOT_MUTED: 'El objetivo no está silenciado.',
            COMMAND_VMUTE_MISSING_PERMISSION: `Necesitaré el permiso ${PERMS.MUTE_MEMBERS} para poder ser capaz de des-silenciarlo.`,
            COMMAND_VMUTE_USER_NOT_MUTED: 'El objetivo no está silenciado en los canales de voz.',
            COMMAND_UNMUTE_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **DES-SILENCIADO**: ${user.tag} (${user.id})${reason ? `\nMotivo: ${reason}` : ''}`,
            COMMAND_UNMUTE_MISSING_PERMISSION: `Necesitaré el permiso ${PERMS.MANAGE_ROLES} para poder ser capaz de des-silenciarlo en los canales de voz.`,
            COMMAND_WARN_MESSAGE: (user, reason, log) => `|\`🔨\`| [Case::${log}] **ALERTADO**: ${user.tag} (${user.id})${reason ? `\nMotivo: ${reason}` : ''}`,
            COMMAND_WARN_DM: (moderator, guild, reason) => `Has sido alertado por ${moderator} en el servidor ${guild} por el siguiente motivo: ${reason}`,

            COMMAND_PRUNE: (amount, total) => `Borrados ${amount} mensajes de ${total} con éxito.`,

            COMMAND_REASON_NOT_EXISTS: 'El caso de moderación seleccionado no parece existir.',

            COMMAND_MUTE_CONFIGURE: '¿Quieres que cree y configure el rol de silenciados ahora?',
            COMMAND_MUTE_CONFIGURE_CANCELLED: 'Mensaje emergente abortado, la creación del rol de silenciados ha sido cancelada.',

            COMMAND_FILTER_UNDEFINED_WORD: 'Debes escribir la palabra que deseas filtrar.',
            COMMAND_FILTER_FILTERED: (filtered) => `Esta palabra ${filtered ? 'ya estaba' : 'no está'} filtrada.`,
            COMMAND_FILTER_ADDED: (word) => `✅ | ¡Éxito! Añadido la palabra ${word} al filtro.`,
            COMMAND_FILTER_REMOVED: (word) => `✅ | ¡Éxito! Removido la palabra ${word} del filtro.`,
            COMMAND_FILTER_RESET: '✅ | ¡Éxito! El filtro ha sido reiniciado.',

            COMMAND_LOCKDOWN_OPEN: (channel) => `The lockdown for the channel ${channel} has been released.`,
            COMMAND_LOCKDOWN_LOCKING: (channel) => `Locking the channel ${channel}...`,
            COMMAND_LOCKDOWN_LOCK: (channel) => `The channel ${channel} is now locked.`,

            COMMAND_LIST_CHANNELS: (name, id) => `List of channels for ${name} (${id})`,
            COMMAND_LIST_ROLES: (name, id) => `List of roles for ${name} (${id})`,
            COMMAND_LIST_MEMBERS: (name, id) => `List of members for the role ${name} (${id})`,
            COMMAND_LIST_INVITES: (name, id) => `List of invite links for ${name} (${id})`,
            COMMAND_LIST_STRIKES: (name) => `List of warnings${name ? ` for ${name}` : ''}`,
            COMMAND_LIST_STRIKES_EMPTY: 'The list of warnings is empty.',
            COMMAND_LIST_STRIKES_ALL: (count, list) => `There are ${count} strikes. Cases: \`${list}\``,
            COMMAND_LIST_STRIKES_EMPTY_FOR: (user) => `There is no warning for the user ${user}`,
            COMMAND_LIST_STRIKES_ENUM: (count) => `There are ${count} strike${count === 1 ? '' : 's'}`,
            COMMAND_LIST_STRIKES_CASE: (number, moderator, reason) => `Case \`${number}\`. Moderator: **${moderator}**\n\`${reason}\``,
            COMMAND_LIST_ADVERTISEMENT: 'List of members advertising.',
            COMMAND_LIST_ADVERTISEMENT_EMPTY: 'Nobody has an advertising url in its playing game.',
            COMMAND_LIST_ROLE_EMPTY: 'This role has no members.',

            COMMAND_ROLE_HIGHER: 'The selected member has higher or equal role position than you.',
            COMMAND_USERSELF: 'Why would you do that to yourself?',
            COMMAND_TOSKYRA: 'Eww... I thought you loved me! 💔',

            // Commands#overwatch
            COMMAND_PLATFORM_REMOVED: (role) => `Your game platform (**${role}**) has been removed.`,
            COMMAND_PLATFORM_UPDATED: (role) => `Your game platform has been updated to: **${role}**`,
            COMMAND_REGION_REMOVED: (role) => `Your game region (**${role}**) has been removed.`,
            COMMAND_REGION_UPDATED: (role) => `Your game region has been updated to: **${role}**`,
            COMMAND_GAMEROLE_UPDATE: (role) => `Your game role has been updated to: **${role}**`,
            COMMAND_RANK_UPDATE: (rank) => `Your rank has been updated to: **${rank}**`,
            MISSING_ROLE: 'You do not have this role.',
            HAS_ROLE: 'You already have this role.',

            // Commands#social
            COMMAND_AUTOROLE_POINTS_REQUIRED: 'You must input a valid amount of points.',
            COMMAND_AUTOROLE_UPDATE_UNCONFIGURED: 'This role is not configured as an autorole. Use the add type instead.',
            COMMAND_AUTOROLE_UPDATE: (role, points, before) => `Updated autorole: ${role.name} (${role.id}). Points required: ${points} (before: ${before})`,
            COMMAND_AUTOROLE_REMOVE: (role, before) => `Removed the autorole: ${role.name} (${role.id}), which required ${before} points.`,
            COMMAND_AUTOROLE_ADD: (role, points) => `Added new autorole: ${role.name} (${role.id}). Points required: ${points}`,
            COMMAND_AUTOROLE_LIST_EMPTY: 'There is no role configured as an autorole in this server.',
            COMMAND_AUTOROLE_UNKNOWN_ROLE: (role) => `Unknown role: ${role}`,

            COMMAND_BALANCE: (user, amount, icon) => `The user ${user} has a total of ${amount}${icon}`,
            COMMAND_BALANCE_SELF: (amount, icon) => `You have a total of ${amount}${icon}`,

            COMMAND_BANNER_LIST_EMPTY: (prefix) => `You do not have an available banner. Check \`${prefix}banner buylist\` for a list of banners you can buy.`,
            COMMAND_BANNER_SET_INPUT_NULL: 'You must specify a banner id to set.',
            COMMAND_BANNER_SET_NOT_BOUGHT: 'You do not have this banner.',
            COMMAND_BANNER_SET: (banner) => `|\`✅\`| **Success**. You have set your banner to: __${banner}__`,
            COMMAND_BANNER_BUY_INPUT_NULL: 'You must specify a banner id to buy.',
            COMMAND_BANNER_BUY_NOT_EXISTS: (prefix) => `This banner id does not exist. Please check \`${prefix}banner buylist\` for a list of banners you can buy.`,
            COMMAND_BANNER_BUY_BOUGHT: (prefix, banner) => `You already have this banner, you may want to use \`${prefix}banner set ${banner}\` to make it visible in your profile.`,
            COMMAND_BANNER_BUY_MONEY: (money, cost, icon) => `You do not have enough money to buy this banner. You have ${money}${icon}, the banner costs ${cost}${icon}`,
            COMMAND_BANNER_BUY: (banner) => `|\`✅\`| **Success**. You have bought the banner: __${banner}__`,
            COMMAND_BANNER_BUY_PAYMENT_CANCELLED: '|`❌`| The payment has been cancelled.',
            COMMAND_BANNER_PROMPT: {
                AUTHOR: 'Author',
                TITLE: 'Title',
                PRICE: 'Price'
            },

            COMMAND_C4_SKYRA: 'I am sorry, I know you want to play with me, but if I do, I will not be able to help other people! 💔',
            COMMAND_C4_BOT: 'I am sorry, but I do not think they would like to stop doing what they are doing and play with humans.',
            COMMAND_C4_PROGRESS: 'I am sorry, but there is a game in progress in this channel, try again when it finishes.',
            COMMAND_C4_PROMPT: (challenger, challengee) => `Dear ${challengee}, you have been challenged by ${challenger} in a Connect-Four math. Reply with **yes** to accept!`,
            COMMAND_C4_PROMPT_TIMEOUT: 'I am sorry, but the challengee did not reply on time.',
            COMMAND_C4_PROMPT_DENY: 'I am sorry, but the challengee refused to play.',
            COMMAND_C4_START: (player, table) => `Let's play! Turn for: **${player}**.\n${table}`,
            COMMAND_C4_GAME_TIMEOUT: '**The match concluded in a draw due to lack of a response (60 seconds)**',
            COMMAND_C4_GAME_COLUMN_FULL: 'This column is full. Please try another.',
            COMMAND_C4_GAME_WIN: (user, table) => `**${user}** won!\n${table}`,
            COMMAND_C4_GAME_DRAW: (table) => `This match concluded in a **draw**!\n${table}`,
            COMMAND_C4_GAME_NEXT: (player, table) => `Turn for: **${player}**.\n${table}`,

            COMMAND_DAILY_TIME: (time) => `Next dailies are available in ${duration(time)}`,
            COMMAND_DAILY_TIME_SUCCESS: (amount, icon) => `Yay! You earned ${amount}${icon}! Next dailies in: 12 hours.`,
            COMMAND_DAILY_GRACE: (remaining) => [
                `Would you like to claim the dailies early? The remaining time will be added up to a normal 12h wait period.`,
                `Remaining time: ${duration(remaining, true)}`
            ].join('\n'),
            COMMAND_DAILY_GRACE_ACCEPTED: (amount, icon, remaining) => `Successfully claimed ${amount}${icon}! Next dailies in: ${duration(remaining)}`,
            COMMAND_DAILY_GRACE_DENIED: 'Got it! Come back soon!',

            COMMAND_LEVEL: {
                LEVEL: 'Level',
                EXPERIENCE: 'Experience',
                NEXT_IN: 'Next level in'
            },

            COMMAND_MYLEVEL: (points, next) => `You have a total of ${points} points.${next}`,
            COMMAND_MYLEVEL_NEXT: (remaining, next) => `\nPoints for next rank: **${remaining}** (at ${next} points).`,

            COMMAND_PAY_MISSING_MONEY: (needed, has, icon) => `I am sorry, but you need ${needed}${icon} and you have ${has}${icon}`,
            COMMAND_PAY_PROMPT: (user, amount, icon) => `You are about to pay ${user} ${amount}${icon}, are you sure you want to proceed?`,
            COMMAND_PAY_PROMPT_ACCEPT: (user, amount, icon) => `Payment accepted, ${amount}${icon} has been sent to ${user}'s profile.`,
            COMMAND_PAY_PROMPT_DENY: 'Payment denied.',
            COMMAND_PAY_SELF: 'If I taxed this, you would lose money, therefore, do not try to pay yourself.',
            COMMAND_SOCIAL_PAY_BOT: 'Oh, sorry, but money is meaningless for bots, I am pretty sure a human would take advantage of it better.',

            COMMAND_PROFILE: {
                GLOBAL_RANK: 'Global Rank',
                CREDITS: 'Credits',
                REPUTATION: 'Reputation',
                EXPERIENCE: 'Experience',
                LEVEL: 'Level'
            },

            COMMAND_REMINDME_INPUT: 'You must tell me what do you want me to remind you and when.',
            COMMAND_REMINDME_TIME: 'Your reminder must be at least one minute long.',
            COMMAND_REMINDME_CREATE: (id) => `A reminder with ID \`${id}\` has been created.`,

            COMMAND_REPUTATION_TIME: (remaining) => `You can give a reputation point in ${duration(remaining)}`,
            COMMAND_REPUTATION_USABLE: 'You can give a reputation point now.',
            COMMAND_REPUTATION_USER_NOTFOUND: 'You must mention a user to give a reputation point.',
            COMMAND_REPUTATION_SELF: 'You cannot give a reputation point to yourself.',
            COMMAND_REPUTATION_BOTS: 'You cannot give a reputation point to bots.',
            COMMAND_REPUTATION_GIVE: (user) => `You have given a reputation point to **${user}**!`,

            COMMAND_REPUTATIONS: (points) => `You have a total of ${points} reputation points.`,

            COMMAND_SCOREBOARD_POSITION: (position) => `Your placing position is: ${position}`,

            COMMAND_SETCOLOR: (color) => `Color changed to ${color}`,

            COMMAND_SLOTMACHINES_MONEY: (money, icon) => `I am sorry, but you do not have enough money to pay your bet! Your current account balance is ${money}${icon}`,
            COMMAND_SLOTMACHINES_WIN: (roll, winnings, icon) => `**You rolled:**\n${roll}\n**Congratulations!**\nYou won ${winnings}${icon}!`,
            COMMAND_SLOTMACHINES_LOSS: (roll) => `**You rolled:**\n${roll}\n**Mission failed!**\nWe'll get em next time!`,

            COMMAND_SOCIAL_PROFILE_NOTFOUND: 'I am sorry, but this user profile does not exist.',
            COMMAND_SOCIAL_PROFILE_BOT: 'I am sorry, but Bots do not have a __Member Profile__.',
            COMMAND_SOCIAL_PROFILE_DELETE: (user, points) => `|\`✅\`| **Success**. Deleted the __Member Profile__ for **${user}**, which had ${points}`,
            COMMAND_SOCIAL_POINTS: 'May you specify the amount of points you want to add or remove?',
            COMMAND_SOCIAL_UPDATE: (action, amount, user, before, now) => `You have just ${action === 'add' ? 'added' : 'removed'} ${amount} ${amount === 1 ? 'point' : 'points'} to the __Member Profile__ for ${user}. Before: ${before}; Now: ${now}.`,

            COMMAND_SUBSCRIBE_NO_ROLE: 'This server does not have a configured announcement role.',
            COMMAND_SUBSCRIBE_SUCCESS: (role) => `Successfully granted the role: **${role}**`,
            COMMAND_UNSUBSCRIBE_SUCCESS: (role) => `Successfully removed the role: **${role}***`,
            COMMAND_SUBSCRIBE_NO_CHANNEL: 'This server does not have a configured announcement channel.',
            COMMAND_ANNOUNCEMENT: (role) => `**New announcement for** ${role}:`,

            COMMAND_CONFIGURATION_ABORT: (reason) => `|\`⚙\`| Prompt System Cancelled: ${reason === 'TIME' ? 'Timed out.' : 'Successfully exited.'}`,

            // Commands#system
            COMMAND_FEEDBACK: '|`✅`| Thanks for your feedback ❤! You will get a response in DMs as soon as possible.',

            COMMAND_RELOAD: (type, name) => `✅ Reloaded ${type}: ${name}`,
            COMMAND_RELOAD_ALL: (type) => `✅ Reloaded all ${type}.`,
            COMMAND_REBOOT: 'Rebooting...',
            COMMAND_PING: 'Ping?',
            COMMAND_PINGPONG: (diff, ping) => `Pong! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`,
            COMMAND_INVITE: (url) => [
                `To add Skyra to your discord guild: <${url}>`,
                'Don\'t be afraid to uncheck some permissions, Skyra will let you know if you\'re trying to run a command without permissions.'
            ],
            COMMAND_HELP_DM: '📥 | Commands have been sent to your DMs.',
            COMMAND_HELP_NODM: '❌ | You have DMs disabled, I couldn\'t send you the commands in DMs.',

            COMMAND_CONF_SELECTKEY: (keys) => `Please, choose between one of the following keys: ${keys}`,
            COMMAND_CONF_ADDED: (folder, key, value) => `Successfully added the value \`${value}\` to the key: \`${folder}\`::\`${key}\``,
            COMMAND_CONF_UPDATED: (folder, key, response) => `Successfully updated the key \`${folder}\`::\`${key}\`: \`${response}\``,
            COMMAND_CONF_KEY_NOT_ARRAY: 'This key is not array type. Use the action \'reset\' instead.',
            COMMAND_CONF_REMOVE: (folder, key, value) => `Successfully removed the value \`${value}\` from the key: \`${folder}\`::\`${key}\``,
            COMMAND_CONF_GET: (folder, key, value) => `The value for the key \`${folder}\`::\`${key}\` is: \`${value}\``,
            COMMAND_CONF_RESET: (folder, key, response) => `The key \`${folder}\`::\`${key}\` has been reset to: \`${response}\``,
            COMMAND_STATS: (STATS, UPTIME, USAGE) => [
                '= STATISTICS =',
                `• Users      :: ${STATS.USERS}`,
                `• Servers    :: ${STATS.GUILDS}`,
                `• Channels   :: ${STATS.CHANNELS}`,
                `• Discord.js :: ${STATS.VERSION}`,
                `• Node.js    :: ${STATS.NODE_JS}`,
                '',
                '= UPTIME =',
                `• Host       :: ${UPTIME.HOST}`,
                `• Total      :: ${UPTIME.TOTAL}`,
                `• Client     :: ${UPTIME.CLIENT}`,
                '',
                '= HOST USAGE =',
                `• CPU Load   :: ${USAGE.CPU_LOAD}`,
                `• RAM +Node  :: ${USAGE.RAM_TOTAL}`,
                `• RAM Usage  :: ${USAGE.RAM_USED}`
            ].join('\n'),

            // Commands#tags
            COMMAND_TAGS_NAME_REQUIRED: 'You must specify a tag name.',
            COMMAND_TAGS_ADD_EXISTS: (tag) => `The tag '${tag}' already exists.`,
            COMMAND_TAGS_CONTENT_REQUIRED: 'You must provide a content for this tag.',
            COMMAND_TAGS_ADD_ADDED: (name, content) => `Successfully added a new tag: **${name}** with a content of **${content}**.`,
            COMMAND_TAGS_REMOVE_NOT_EXISTS: (tag) => `The tag '${tag}' does not exist.`,
            COMMAND_TAGS_REMOVE_REMOVED: (name) => `Successfully removed the tag **${name}**.`,
            COMMAND_TAGS_EDITED: (name, content, old) => `Successfully edited the tag **${name}** which had a content of **${old}** to **${content}**.`,
            COMMAND_TAGS_LIST_EMPTY: 'The tag list for this server is empty.',

            // Commands#tools
            COMMAND_CALC: (time, output) => `|\`⚙\`| **Calculated** (${time}μs)${output}`,
            COMMAND_CALC_FAILURE: (time, output) => `|\`❌\`| **Failed** (${time}μs)${output}`,

            COMMAND_COLOR: (hex, rgb, hsl) => [
                `HEX: **${hex}**`,
                `RGB: **${rgb}**`,
                `HSL: **${hsl}**`
            ].join('\n'),

            COMMAND_CURRENCYLAYER_INPUT: (input) => `${input} is either not a valid currency or is not accepted by the API.`,
            COMMAND_CURRENCYLAYER_ERROR: 'I am sorry, but the API returned a bad response.',
            COMMAND_CURRENCYLAYER: (money, input, output, converted) => `**${money}** from \`${input}\` to \`${output}\` equals to:${converted}`,

            COMMAND_DEFINE_NOTFOUND: 'I could not find a definition for this word.',
            COMMAND_DEFINE: (input, output) => `Search results for \`${input}\`:\n${output}`,

            COMMAND_EMOJI_CUSTOM: (emoji, id) => [
                `→ \`Emoji\` :: **${emoji}**`,
                '→ `Type` :: **Custom**',
                `→ \`ID\` :: **${id}**`
            ].join('\n'),
            COMMAND_EMOJI_TWEMOJI: (emoji, id) => [
                `→ \`Emoji\` :: \\${emoji}`,
                '→ `Type` :: **Twemoji**',
                `→ \`ID\` :: **${id}**`
            ].join('\n'),
            COMMAND_EMOJI_INVALID: (emoji) => `'${emoji}' is not a valid emoji.`,

            COMMAND_GOOGL_LONG: (url) => `**Shortened URL: [${url}](${url})**`,
            COMMAND_GOOGL_SHORT: (url) => `**Expanded URL: [${url}](${url})**`,

            COMMAND_QUOTE_MESSAGE: 'It is very weird, but said message does not have a content nor a image.',

            COMMAND_ROLES_LIST_EMPTY: 'This server does not have a role listed as a public role.',
            COMMAND_ROLES_LIST_TITLE: (guild) => `List of Public Roles for ${guild}`,
            COMMAND_ROLES_CLAIM_EXISTENT: (roles) => `You already have the following roles: \`${roles}\``,
            COMMAND_ROLES_CLAIM_GIVEN: (roles) => `The following roles have been added to your profile: \`${roles}\``,
            COMMAND_ROLES_UNCLAIM_UNEXISTENT: (roles) => `You do not have the following roles: \`${roles}\``,
            COMMAND_ROLES_UNCLAIM_REMOVED: (roles) => `The following roles have been removed from your profile: \`${roles}\``,
            COMMAND_ROLES_NOT_PUBLIC: (roles) => `The following roles are not public: \`${roles}\``,
            COMMAND_ROLES_NOT_FOUND: (roles) => `Roles not found: \`${roles}\``,

            COMMAND_SERVERINFO_TITLE: (name, id) => `Statistics for **${name}** (ID: **${id}**)`,
            COMMAND_SERVERINFO_TITLES: {
                CHANNELS: 'Channels',
                MEMBERS: 'Members',
                OTHER: 'Other',
                USERS: 'Users'
            },
            COMMAND_SERVERINFO_CHANNELS: (text, voice, categories, afkChannel, afkTime) => [
                `• **${text}** Text, **${voice}** Voice, **${categories}** categories.`,
                `• AFK: ${afkChannel ? `**<#${afkChannel}>** after **${afkTime / 60}**min` : '**None.**'}`
            ].join('\n'),
            COMMAND_SERVERINFO_MEMBERS: (count, owner) => [
                `• **${count}** members`,
                `• Owner: **${owner.tag}**`,
                `  (ID: **${owner.id}**)`
            ].join('\n'),
            COMMAND_SERVERINFO_OTHER: (size, region, createdAt, verificationLevel) => [
                `• Roles: **${size}**`,
                `• Region: **${region}**`,
                `• Created at: **${moment.utc(createdAt).format('D/M/YYYY, HH:mm:ss')}** (UTC - DD/MM/YYYY)`,
                `• Verification Level: **${this.HUMAN_LEVELS[verificationLevel]}**`
            ].join('\n'),
            COMMAND_SERVERINFO_USERS: (online, offline, percentage, newbies) => [
                `• Online/Offline users: **${online}**/**${offline}** (${percentage}% users online)`,
                `• **${newbies}** new users within the last 24h.`
            ].join('\n'),

            COMMAND_URBAN_NOTFOUND: 'I am sorry, the word you are looking for does not seem to be defined in UrbanDictionary. Try another word?',
            COMMAND_URBAN_INDEX_NOTFOUND: 'You may want to try a lower page number.',
            SYSTEM_TEXT_TRUNCATED: (definition, url) => `${definition}... [continue reading](${url})`,
            COMMAND_URBAN_DESCRIPTION: (index, pages, definition, example, author) => [
                `→ \`Definition\` :: ${index}/${pages}\n_${definition}`,
                `→ \`Example\` :: ${example}`,
                `→ \`Author\` :: ${author}`
            ].join('\n\n'),

            COMMAND_WHOIS_MEMBER: (member) => [
                `${member.nickname ? `aka **${member.nickname}**.\n` : ''}`,
                `With an ID of \`${member.user.id}\`,`,
                `this user is **${member.user.presence.status}**${member.user.presence.game ? `, playing: **${member.user.presence.game.name}**` : '.'}`,
                '\n',
                `\nJoined Discord on ${moment.utc(member.user.createdAt).format('D/MM/YYYY [at] HH:mm:ss')}`,
                `\nJoined ${member.guild.name} on ${moment.utc(member.joinedAt).format('D/MM/YYYY [at] HH:mm:ss')}`
            ].join(' '),
            COMMAND_WHOIS_MEMBER_ROLES: '→ `Roles`',
            COMMAND_WHOIS_USER: (user) => [
                `With an ID of \`${user.id}\``,
                '\n',
                `Joined Discord at ${moment.utc(user.createdAt).format('D/MM/YYYY [at] HH:mm:ss')}`
            ].join(' '),

            COMMAND_WIKIPEDIA_NOTFOUND: 'I am sorry, I could not find something that could match your input in Wikipedia.',

            COMMAND_YOUTUBE_NOTFOUND: 'I am sorry, I could not find something that could match your input in YouTube.',
            COMMAND_YOUTUBE_INDEX_NOTFOUND: 'You may want to try a lower page number. Because I am unable to find something at this index.',

            // Commands#weather
            COMMAND_WEATHER_ERROR_ZERO_RESULTS: 'Your request returned no results.',
            COMMAND_WEATHER_ERROR_REQUEST_DENIED: 'The GeoCode API Request was denied.',
            COMMAND_WEATHER_ERROR_INVALID_REQUEST: 'Invalid request.',
            COMMAND_WEATHER_ERROR_OVER_QUERY_LIMIT: 'Query Limit Exceeded. Try again tomorrow.',
            COMMAND_WEATHER_ERROR_UNKNOWN: 'Unknown error.',

            // Modlogs
            MODLOG_APPEALED: 'The selected moderation case has already been appealed.',
            MODLOG_TIMED: (remaining) => `This action is already scheduled and ending in ${duration(remaining)}`,
            MODLOG_PENDING_REASON: (prefix, number) => `Use ${prefix}reason ${number} to claim this case.`,

            // System only
            SYSTEM_DM_SENT: 'I have sent you the message in DMs.',
            SYSTEM_DM_FAIL: 'I cannot send you a message in DMs, did you block me?',
            SYSTEM_FETCHING: '`Fetching...`',
            SYSTEM_PROCESSING: '`Processing...`',
            SYSTEM_HIGHEST_ROLE: 'This role\'s hierarchy position is higher or equal than me, I am not able to grant it to anyone.',
            SYSTEM_CHANNEL_NOT_POSTABLE: 'I am not allowed to send messages to this channel.',
            SYSTEM_FETCHBANS_FAIL: `Failed to fetch bans. Do I have the ${PERMS.BAN_MEMBERS} permission?`,
            SYSTEM_LOADING: '`Loading... please wait.`',
            SYSTEM_ERROR: 'Something happened!',
            SYSTEM_MESSAGE_NOT_FOUND: 'I am sorry, but either you wrote the message ID incorrectly, or it got deleted.',

            LISTIFY_PAGE: (page, pageCount, results) => `Page ${page} / ${pageCount} | ${results} Total`,

            COMMAND_SUCCESS: 'Successfully executed the command.',

            GUILD_SETTINGS_CHANNELS_MOD: 'This command requires a modlog channel to work.',
            GUILD_SETTINGS_ROLES_MUTED: 'This command requires a configured role for mutes.',
            GUILD_BANS_EMPTY: 'There are no bans registered in this server.',
            GUILD_BANS_NOT_FOUND: 'Please, write a valid user ID or tag.',
            GUILD_MUTE_NOT_FOUND: 'This user is not muted.',
            CHANNEL_NOT_READABLE: `I am sorry, but I need the permission **${PERMS.VIEW_CHANNEL}**`,

            USER_NOT_IN_GUILD: 'This user is not in this server.',

            EVENTS_GUILDMEMBERADD: 'User Joined',
            EVENTS_GUILDMEMBERADD_MUTE: 'Muted User joined',
            EVENTS_GUILDMEMBERADD_RAID: 'Raid Detected',
            EVENTS_GUILDMEMBERREMOVE: 'User left',
            EVENTS_GUILDMEMBER_UPDATE_NICKNAME: (previous, current) => `Updated the nickname from **${previous}** to **${current}**`,
            EVENTS_GUILDMEMBER_ADDED_NICKNAME: (previous, current) => `Added a new nickname **${current}**`,
            EVENTS_GUILDMEMBER_REMOVED_NICKNAME: (previous) => `Removed the nickname **${previous}**`,
            EVENTS_GUILDMEMBER_UPDATE_ROLES: (removed, added) => `${removed.length > 0 ? `Removed the role${removed.length > 1 ? 's' : ''}: ${removed.join(', ')}\n` : ''}${added.length > 0 ? `Added the role${added.length > 1 ? 's' : ''}: ${added.join(', ')}` : ''}`,
            EVENTS_MESSAGE_UPDATE: 'Message Edited',
            EVENTS_MESSAGE_UPDATE_MSG: (old, msg) => `Previous: ${old.substring(0, 950)}\nNew: ${msg.substring(0, 950)}`,
            EVENTS_MESSAGE_DELETE: 'Message Deleted',
            EVENTS_MESSAGE_DELETE_MSG: (msg) => msg.substring(0, 1900),
            EVENTS_COMMAND: (command) => `Command Used: ${command}`,
            EVENTS_STREAM_START: (member) => `The user **${member.user.tag}** is now live! **${member.presence.game.name}**\n${member.presence.game.url}`,
            EVENTS_STREAM_STOP: (member) => `The user **${member.user.tag}** is not longer live!`,

            SETTINGS_DELETE_CHANNELS_DEFAULT: 'Removed Settings Channels::default',
            SETTINGS_DELETE_ROLES_INITIAL: 'Removed Setting Roles::initial',
            SETTINGS_DELETE_ROLES_MUTE: 'Removed Setting Roles::mute',

            TYPES_MEMBER_ROLE_UPDATE: 'Member Role Update',
            TYPES_MEMBER_NICKNAME_UPDATE: 'Member Nickname Update',

            LISTIFY_INVALID_INDEX: 'Invalid index, expected an integer.',
            REQUIRE_USER: 'You must input a valid username, tag, or mention.',
            REQUIRE_ROLE: 'You must input a valid role name or mention',

            ERROR_WTF: 'What a Terrible Failure! I am very sorry!',
            ERROR_STRING: (mention, message) => `Dear ${mention}, ${message}`,

            CONST_USERS: 'Users'
        };
    }

};
