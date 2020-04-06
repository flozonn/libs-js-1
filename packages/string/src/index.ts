export const camelcase = (...args) => args.map(a => Array.isArray(a) ? camelcase(...a) : (!a ? '' : ((/_/.test(a) ? camelcase(a.split(/_/)) : `${a.substr(0, 1).toUpperCase()}${a.substr(1)}`)))).join('');
export const underscorecase = (...args) => args.map(a => Array.isArray(a) ? underscorecase(...a) : a.replace(/[.\s]+/g, '_')).join('_');
export const label = (v, {i18nPrefix}) => i18nPrefix ? require('i18next').default.t([`${i18nPrefix}_${v}_label`, v]) : v;
export const digitize = v => v < 10 ? `0${v}` : `${v}`;
export const datetimify = t => {
    const d = new Date(parseInt(t));
    return `${digitize(d.getDate())}/${digitize(d.getMonth() + 1)}/${d.getFullYear()} @ ${digitize(d.getHours())}:${digitize(d.getMinutes())}`;
};
export const titlize = (def, item) => {
    switch (def.type) {
        case 'person_full':
            return `${(item.lastName || '').toUpperCase()} ${item.firstName}${item.phone ? ` - F. : ${item.phone}` : ''}${item['mobilePhone'] ? ` - M. : ${item['mobilePhone']}` : ''}${item.email ? ` (${item.email})` : ''}`;
        case 'organization_full':
            return `${item.name}${item.phone ? ` - T. : ${item.phone}` : ''}${item.fax ? ` - F. : ${item.fax}` : ''}${item.email ? ` (${item.email})` : ''}`;
        case 'person':
            return `${(item.lastName || '').toUpperCase()} ${item.firstName}${item.email ? ` (${item.email})` : ''}`;
        case 'organization':
            return `${item.name}${item.email ? ` (${item.email})` : ''}`;
        case 'person_short':
            return `${(item.lastName || '').toUpperCase()} ${item.firstName}`;
        case 'organization_short':
            return `${item.name}`;
        case 'title':
            return (item.title ? ('string' === typeof item.title ? item.title : item.title[require('i18next').default.language]) : undefined) || item.name || item.id;
        case 'named_location':
            if (item.street && item.city && item.zipCode && item.country) return `${item.name || item.type} - ${item.street} - ${item.zipCode} ${item.city} ${item.country}`;
            if (item.city && item.zipCode && item.country) return `${item.name || item.type} - ${item.zipCode} ${item.city} ${item.country}`;
            if (item.zipCode && item.country) return `${item.name || item.type} - ${item.zipCode} ${item.country}`;
            if (item.country) return `${item.name || item.type} - ${item.country}`;
            return item.name || item.type;
        case 'named_surface':
            return (item.width && item.height) ? `${label(item.name || item.type, def)} (${item.width.unit === item.height.unit ? `${Math.round(item.width.value * item.height.value * 100) / 100}${item.width.unit}² - ` : ''}${item.width.value}${item.width.unit} x ${item.height.value}${item.height.unit})` : item.name;
        case 'named_surface_short':
            return (item.width && item.height) ? `${label(item.name || item.type, def)}${item.width.unit === item.height.unit ? ` - ${Math.round(item.width.value * item.height.value * 100) / 100}${item.width.unit}²` : ''}` : item.name;
        case 'named_interval':
            return `${label(item.name || item.type, def)} - ${item.heightInterval[0]}...${item.heightInterval[1]} cm`;
        case 'named_interval_short':
            return `${label(item.name || item.type, def)} - ${item.heightInterval[0]}...${item.heightInterval[1]} cm`;
        case 'typed_name':
            return `${label(item.type, def).toUpperCase()} - ${item.name}`;
        default:
            return item.name || item.type || item.id;
    }
};
export const replaceVars = (text: string, props: {[key: string]: any}): string => {
    let xx;
    // noinspection RegExpRedundantEscape
    while ((xx = /\{\{([^}]+)}}/.exec(text)) !== null) {
        let a = xx[1];
        let mode: any = undefined;
        if (/^json:/.test(a)) {
            a = a.substr(5);
            mode = 'json';
        }
        let v = props[a] || '';
        if ('json' === mode) v = JSON.stringify(v);
        text = text.replace(xx[0], v);
    }
    return text;
};