/* Standalone BMW dictionary. Set enabled to false to disable the whole feature. */
window.BMWSeriesIndex = (() => {
    const enabled = true;
    const groups = [
        ['1 Series', '1系', 'E81 E82 E87 E88 F20 F21 F40 F52 F70'],
        ['2 Series', '2系', 'F22 F23 F44 F45 F46 U06 G42 F74 F78'],
        ['3 Series', '3系', 'E21 E30 E36 E46 E90 E91 E92 E93 F30 F31 F34 F35 G20 G21 G28 G50'],
        ['4 Series', '4系', 'F32 F33 F36 G22 G23 G26'],
        ['5 Series', '5系', 'E12 E28 E34 E39 E60 E61 F07 F10 F11 F18 G30 G31 G38 G60 G61 G68'],
        ['6 Series', '6系', 'E24 E63 E64 F06 F12 F13 G32'],
        ['7 Series', '7系', 'E23 E32 E38 E65 E66 F01 F02 G11 G12 G70 G73'],
        ['8 Series', '8系', 'E31 G14 G15 G16'],
        ['1M', '1系M', 'E82'],
        ['M1', 'M1', 'E26'],
        ['M2', 'M2', 'F87 G87'],
        ['M3', 'M3', 'E30 E36 E46 E90 E92 E93 F80 F81 G80 G81 G84'],
        ['M4', 'M4', 'F82 F83 G82 G83'],
        ['M5', 'M5', 'E28 E34 E39 E60 E61 F10 F90 G90 G99'],
        ['M6', 'M6', 'E63 E64 F06 F12M F13M'],
        ['M8', 'M8', 'F91 F92 F93'],
        ['X1', 'X1', 'E84 F48 F49 U11'],
        ['X2', 'X2', 'F39 U10'],
        ['X3', 'X3', 'E83 F25 G01 G08 G45 G48'],
        ['X4', 'X4', 'F26 G02'],
        ['X5', 'X5', 'E53 E70 F15 G05 G18 G65'],
        ['X6', 'X6', 'E71 F16 G06'],
        ['X7', 'X7', 'G07 G67'],
        ['X3M', 'X3M', 'F97'],
        ['X4M', 'X4M', 'F98'],
        ['X5M', 'X5M', 'E70 F85 F95'],
        ['X6M', 'X6M', 'E71 F86 F96'],
        ['XM', 'XM', 'G09'],
        ['Z1', 'Z1', 'E30(Z)'],
        ['Z3', 'Z3', 'E36/7 E36/8'],
        ['Z4', 'Z4', 'E85 E86 E89 G29'],
        ['Z8', 'Z8', 'E52'],
        ['i3', 'i3', 'I01 G28 NA0'],
        ['i4', 'i4', 'G26'],
        ['i5', 'i5', 'G60 G61 G68'],
        ['i7', 'i7', 'G70'],
        ['i8', 'i8', 'I12 I15'],
        ['iX', 'iX', 'I20'],
        ['iX1', 'iX1', 'U11 NB5'],
        ['iX2', 'iX2', 'U10'],
        ['iX3', 'iX3', 'G08 NA5'],
        ['iX4', 'iX4', 'NA7'],
        ['iX5', 'iX5', 'G05 G65'],
        ['iX7', 'iX7', 'G67'],
        ['Design&Racing', '设计和赛事', 'Concept Legacy F1 F2 F3 IFE LMR GTP'],
        ['Classic-1', '经典系列-1', 'DIXI 315 326 327 328 335 340 KR6 501 503 507 TYPE100 TYPE102 TYPE118 TYPE120 TYPE600 700'],
        ['Classic-2', '经典系列-2', 'NK-1500 NK-1600 GLAS3000 E3 E9 E10 E20'],
        ['Other', '其他', 'Other']
    ];
    const normalize = value => String(value || '').trim().toUpperCase();
    const knownCodes = new Set(groups.slice(0, -1).flatMap(group => group[2].split(' ').map(normalize)));
    const prefix = '__bmw_index__:';
    const keyFor = car => {
        const code = normalize(car.seriesNum);
        return knownCodes.has(code) ? code : 'OTHER';
    };
    function matches(car, filter) {
        if (!enabled || !filter.startsWith(prefix)) return null;
        return keyFor(car) === filter.slice(prefix.length);
    }
    function buildCounts(cars) {
        const counts = new Map();
        cars.filter(car => car.carBrand === 'BMW' && car.visible !== false).forEach(car => {
            const key = keyFor(car);
            counts.set(key, (counts.get(key) || 0) + 1);
        });
        return counts;
    }
    function render(cars, lang, onSelect) {
        if (!enabled) return null;
        const cn = lang !== 'en';
        const counts = buildCounts(cars);
        const section = document.createElement('section');
        section.className = 'bmw-series-index';
        section.setAttribute('aria-labelledby', 'bmw-series-index-title');
        const title = document.createElement('h3');
        title.id = 'bmw-series-index-title';
        title.textContent = cn ? 'BMW 代号索引' : 'BMW Series Index';
        const hint = document.createElement('p');
        hint.className = 'bmw-series-index-hint';
        hint.textContent = cn
            ? '查阅我的宝马字典。'
            : 'Check the BMW Dictionary';
        const list = document.createElement('ul');
        list.className = 'bmw-series-index-list';
        list.tabIndex = 0;
        list.setAttribute('aria-label', cn ? 'BMW 代号列表，可滚动' : 'BMW series codes, scrollable list');
        groups.forEach(([en, zh, codes]) => {
            const row = document.createElement('li');
            const heading = document.createElement('h4');
            heading.textContent = cn ? zh : en;
            const items = document.createElement('div');
            items.className = 'bmw-series-index-codes';
            codes.split(' ').forEach(code => {
                const count = counts.get(normalize(code)) || 0;
                const label = code === 'Other' && cn ? '其他' : code;
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = `${label} (${count})`;
                button.disabled = count === 0;
                button.setAttribute('aria-label', cn ? `${label}，${count} 辆在库` : `${label}, ${count} cars in garage`);
                button.addEventListener('click', () => onSelect(prefix + normalize(code), label));
                items.appendChild(button);
            });
            row.append(heading, items);
            list.appendChild(row);
        });
        section.append(title, hint, list);
        return section;
    }
    return { enabled, render, matches, buildCounts };
})();
