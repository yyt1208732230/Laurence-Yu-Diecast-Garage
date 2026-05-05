# Laurence Diecast Collection - Automation Instructions

> 中文：本文档提炼自 `index.html` 与 `cars.json`，用于后续自动化更新、数据录入、页面优化与部署检查。  
> English: This document is derived from `index.html` and `cars.json` for future automated updates, data entry, page optimization, and deployment checks.

## 1. Project Overview / 项目概览

中文：
- 这是一个纯静态单页 diecast 私人收藏网页，核心文件为 `index.html` 与 `cars.json`。
- `index.html` 同时包含 HTML、CSS、JavaScript 逻辑；页面运行时通过 `fetch('cars.json')` 加载车辆数据。
- `index_v2.html` 是基于同一数据结构与交互逻辑的 V2 视觉版本，风格规则见 `design.md` 与 `instructionv2.md`。
- 静态资源主要位于 `images/`，包括模型照片、真车照片、首页背景、横幅、精选页装饰图、BMW 历史图等。
- 站点可部署到 GitHub Pages 或任意静态托管服务；根目录存在 `CNAME`，表示已配置自定义域名。

English:
- This is a static single-page private diecast collection website. The core files are `index.html` and `cars.json`.
- `index.html` contains the HTML, CSS, and JavaScript. Runtime data is loaded through `fetch('cars.json')`.
- `index_v2.html` is the V2 visual version using the same data structure and interaction logic; its style rules are documented in `design.md` and `instructionv2.md`.
- Static assets are mainly stored in `images/`, including model photos, real-car photos, home background, banner, picks decorations, and BMW history images.
- The site can be deployed to GitHub Pages or any static host. The root `CNAME` indicates a custom domain is configured.

## 2. Runtime Dependencies / 运行依赖

中文：
- 外部字体：Google Fonts，包含 `Inter`、`Playfair Display`、`IBM Plex Sans`、`Cormorant Garamond`。
- 下拉筛选组件：Tom Select CSS 与 JS，当前 CSS 来自 jsDelivr：`tom-select@2.2.2`。
- 页面必须通过 HTTP 静态服务访问，直接双击打开本地 HTML 时，浏览器可能因 CORS 或 file 协议限制阻止 `fetch('cars.json')`。

English:
- External fonts: Google Fonts, including `Inter`, `Playfair Display`, `IBM Plex Sans`, and `Cormorant Garamond`.
- Select/filter component: Tom Select CSS and JS, with CSS currently loaded from jsDelivr: `tom-select@2.2.2`.
- The page should be served through an HTTP static server. Opening the HTML file directly may block `fetch('cars.json')` due to browser CORS or `file://` restrictions.

## 3. Main Page Structure / 主页面结构

中文：
- `#home`：首页入口，显示背景图 `images/home-bg.jpg`、标题、简介与三个入口按钮。
- `#app`：主应用区域，包含顶部横幅、控制栏、分页、BMW 时间线视图、精选视图、普通画廊视图与页脚。
- `#gallery`：普通卡片网格，用于 BMW Garage、Hotwheels、Show All 等页面。
- `#timeline-view`：BMW History 页面使用的时间线/年代陈列区域。
- `#picks-view`：My Picks 页面使用的精选分区区域。
- `#modal`：历史系列卡片点击后打开的详情弹窗。

English:
- `#home`: Landing entry screen with `images/home-bg.jpg`, title, intro copy, and three entry buttons.
- `#app`: Main application area with banner, controls, pagination, BMW timeline view, picks view, gallery view, and footer.
- `#gallery`: Standard card grid for BMW Garage, Hotwheels, Show All, and similar tabs.
- `#timeline-view`: BMW History timeline/decade display.
- `#picks-view`: My Picks curated section display.
- `#modal`: Detail modal opened from BMW history series cards.

## 4. Navigation And Views / 导航与视图

中文：
- 导航按钮由 `data-filter` 决定当前页面：
  - `BMW_TIMELINE`：BMW History / 宝马史陈列。
  - `BMW`：Bimmer Garage / 宝马库。
  - `Hotwheels`：Hotwheels / 风火轮系列。
  - `PICKS`：My Picks / 个人推荐。
  - `all`：Show All in Gallery / 全部展示。
- 首页按钮行为：
  - BMW 入口进入 `BMW`，不是 `BMW_TIMELINE`。
  - Hotwheels 入口进入 `Hotwheels`。
  - Curated 入口进入 `PICKS`。
- 点击品牌/logo 返回首页。
- 移动端导航使用 `nav-toggle` 展开/收起，点击导航外部会关闭菜单。

English:
- Navigation buttons use `data-filter` to determine the active page:
  - `BMW_TIMELINE`: BMW History.
  - `BMW`: Bimmer Garage.
  - `Hotwheels`: Hotwheels.
  - `PICKS`: My Picks.
  - `all`: Show All in Gallery.
- Home entry buttons:
  - BMW enters `BMW`, not `BMW_TIMELINE`.
  - Hotwheels enters `Hotwheels`.
  - Curated enters `PICKS`.
- Clicking the brand/logo returns to the home screen.
- Mobile navigation uses `nav-toggle`; clicking outside the menu closes it.

## 5. Core State And Config / 核心状态与配置

中文：
- `ITEMS_PER_PAGE = 20`：普通画廊每页 20 台车。
- `currentLang = 'en'`：默认语言为英文。
- `currentCategory = 'BMW'`：进入主应用后的默认分类状态。
- `carData`：从 `cars.json` 加载的完整数据数组。
- `bmwFilters`：BMW Garage 的筛选状态，包含 `series`、`color`、`decade`。
- `flipAllCards`：是否批量翻转所有普通画廊卡片。
- `carData` 加载后按 `cars.json` 数组倒序展示；新追加在 JSON 末尾的车辆会优先出现在画廊前面。
- 每次切换导航时，会重置搜索、筛选与页码，但不再随机打乱车辆顺序。

English:
- `ITEMS_PER_PAGE = 20`: Standard gallery shows 20 cars per page.
- `currentLang = 'en'`: Default language is English.
- `currentCategory = 'BMW'`: Default category state after entering the app.
- `carData`: Full array loaded from `cars.json`.
- `bmwFilters`: BMW Garage filter state with `series`, `color`, and `decade`.
- `flipAllCards`: Whether all standard gallery cards are flipped.
- `carData` is displayed in reverse `cars.json` array order; vehicles appended to the end of JSON appear first in galleries.
- On every nav switch, search, filters, and pagination are reset, but vehicle order is no longer randomized.

## 6. Language Rules / 语言规则

中文：
- 页面支持英文与中文切换，语言按钮为 `#lang-en` 与 `#lang-cn`。
- 静态文本通过元素上的 `data-en` 与 `data-cn` 切换。
- 动态文本根据 `currentLang` 选择字段：
  - 颜色：英文使用 `color`，中文使用 `color_cn`。
  - 描述：英文优先 `description_en`，中文优先 `description_cn`。
- 自动化更新中文内容时，必须保持文件为 UTF-8，并避免产生乱码或损坏引号。

English:
- The page supports English and Chinese through `#lang-en` and `#lang-cn`.
- Static text switches through `data-en` and `data-cn` attributes.
- Dynamic text uses `currentLang`:
  - Color: English uses `color`; Chinese uses `color_cn`.
  - Description: English prefers `description_en`; Chinese prefers `description_cn`.
- When automated updates modify Chinese text, files must remain UTF-8 and quotes must not be corrupted.

## 7. Filtering Logic / 筛选逻辑

中文：
- 所有视图首先排除 `visible === false` 的项目。
- BMW Garage 与 BMW History 不依赖 `category === 'BMW'`，而是严格使用 `carBrand === 'BMW'`。
- Hotwheels 页面不依赖 `category === 'Hotwheels'`，而是使用 `modelBrand === 'Hot Wheels'`。
- 其他未来栏目使用兜底逻辑：`category === currentCategory`。
- `all` 页面显示所有 `visible !== false` 的项目，并提供按 `category` 筛选。
- 非 BMW、非 all 的普通栏目提供按 `tags` 筛选。
- 搜索会匹配以下字段组合的小写文本：`modelName`、`carBrand`、`modelBrand`、`description_en`、`description_cn`、`tags`、`seriesNum`。

English:
- All views first exclude items where `visible === false`.
- BMW Garage and BMW History do not rely on `category === 'BMW'`; they strictly use `carBrand === 'BMW'`.
- The Hotwheels page does not rely on `category === 'Hotwheels'`; it uses `modelBrand === 'Hot Wheels'`.
- Other future tabs fall back to `category === currentCategory`.
- The `all` page displays all `visible !== false` items and supports filtering by `category`.
- Non-BMW, non-all standard tabs support filtering by `tags`.
- Search matches lowercase combined text from `modelName`, `carBrand`, `modelBrand`, `description_en`, `description_cn`, `tags`, and `seriesNum`.

## 8. BMW Garage Rules / BMW 车库规则

中文：
- 进入 `BMW` 时显示普通画廊，并启用 BMW 专用筛选器。
- BMW 筛选器包括：
  - Series：来源于 BMW 车辆的 `seriesNum`。
  - Color：英文环境来源于 `color`，中文环境来源于 `color_cn`。
  - Decade：从 `tags` 中第一个匹配 `19xx` 或 `20xx` 的年份推导，例如 `1986` -> `1980s`。
- BMW 车辆建议必须包含 `seriesNum`、`color`、`color_cn`，否则筛选、卡片背面和历史页可能缺少信息。
- `Go History` 按钮仅在 BMW Garage 中显示，点击切换到 BMW History。

English:
- Entering `BMW` shows the standard gallery and enables BMW-specific filters.
- BMW filters include:
  - Series: derived from BMW cars' `seriesNum`.
  - Color: derived from `color` in English and `color_cn` in Chinese.
  - Decade: derived from the first `19xx` or `20xx` year found in `tags`, e.g. `1986` -> `1980s`.
- BMW entries should include `seriesNum`, `color`, and `color_cn`; otherwise filters, card backs, and history pages may lack information.
- The `Go History` button appears only in BMW Garage and switches to BMW History.

## 9. BMW History Rules / BMW 历史页规则

中文：
- `BMW_TIMELINE` 页面只展示 `carBrand === 'BMW' && visible !== false` 的车辆。
- 年代分组从 `tags` 中提取第一个四位年份，必须是 `1900-2099` 格式。
- 车辆按 `year -> decade -> seriesNum` 归入对应年代与系列。
- 每个年代区块配置在 `BMW_HISTORY_SECTIONS` 中，包括：
  - `decade`
  - `title_en`
  - `title_cn`
  - `desc_en`
  - `desc_cn`
  - `image`
- 如果某个年代没有任何匹配车辆，该年代区块不会渲染。
- 每个系列卡片确定性选择该系列中的第一台车作为展示图；页面不再使用随机排序或随机代表图。
- 点击历史页的系列卡片会跳转到 `BMW`，并自动设置 `bmwFilters.series` 为该系列。
- `Go, BMW Garage` 按钮仅在 BMW History 中显示。

English:
- The `BMW_TIMELINE` page only displays cars where `carBrand === 'BMW' && visible !== false`.
- Decade grouping extracts the first four-digit year from `tags`; it must match `1900-2099`.
- Cars are grouped by `year -> decade -> seriesNum`.
- Each decade section is configured in `BMW_HISTORY_SECTIONS` with:
  - `decade`
  - `title_en`
  - `title_cn`
  - `desc_en`
  - `desc_cn`
  - `image`
- If a decade has no matching cars, that decade section is not rendered.
- Each series card deterministically uses the first car in that series as its visual representative; the page no longer uses random ordering or random representative cards.
- Clicking a history series card jumps to `BMW` and sets `bmwFilters.series` to that series.
- The `Go, BMW Garage` button appears only in BMW History.

## 10. My Picks Rules / 精选页规则

中文：
- `PICKS` 页面隐藏控制栏、筛选器、计数器、普通画廊和分页。
- `PICKS_TAGS` 定义精选标签映射：
  - `BEST_LOVE` -> `Best Love`
  - `MY_FAV` -> `My favour`
  - `CUTE` -> `Cute cars`
  - `ART` -> `Art`
  - `HIDDEN` -> `Hidden gem`
- `PICKS_SECTIONS` 定义精选页每个分区的标题、描述、装饰图、比例与布局方向。
- 精选页车辆筛选使用精确标签匹配：把 `tags` 按英文分号 `;` 切开并 trim 后，必须完全等于对应标签。
- 要让一台车出现在精选页，必须在 `cars.json` 的 `tags` 中加入上述标签之一，大小写和拼写必须完全一致。
- 精选页卡片不打开弹窗，`openModal` 中也有双重保护。

English:
- The `PICKS` page hides controls, filters, counters, standard gallery, and pagination.
- `PICKS_TAGS` defines curated tag mappings:
  - `BEST_LOVE` -> `Best Love`
  - `MY_FAV` -> `My favour`
  - `CUTE` -> `Cute cars`
  - `ART` -> `Art`
  - `HIDDEN` -> `Hidden gem`
- `PICKS_SECTIONS` defines each curated section's title, description, decoration image, aspect ratio, and layout direction.
- Picks filtering uses exact tag matching: `tags` is split by the English semicolon `;`, trimmed, and compared exactly.
- To include a car in My Picks, add one of the above tags to `cars.json`; spelling and capitalization must match exactly.
- Picks cards do not open the modal; `openModal` also contains a double-safety check.

## 11. Gallery Card Rules / 普通画廊卡片规则

中文：
- 普通画廊卡片有正反两面。
- 正面使用：
  - `modelName`
  - `imagePath`
  - 前 3 个 `tags`
  - 根据语言生成的简短描述
- 背面使用：
  - `realCarImage`，若为空则回退到 `imagePath`
  - `carBrand`
  - `modelBrand`
  - `color` 或 `color_cn`
  - `seriesNum`
  - 前 4 个 `tags`
  - `realCarUrl`，若存在则标题和图标可跳转外部链接
- 单击卡片会翻转；点击背面链接不会触发翻转。
- `Flip All Cards` 按钮可批量翻转当前画廊卡片；在 Picks 与 BMW History 中隐藏。
- 图片加载失败时回退到 `images/placeholder.jpg` 或模型图。
- 如果 `note` 存在且不是 `none`，普通画廊卡片正面右上角会显示角标，例如 `New!`、`Unpacked`。

English:
- Standard gallery cards have front and back faces.
- The front uses:
  - `modelName`
  - `imagePath`
  - First 3 `tags`
  - Language-dependent short description
- The back uses:
  - `realCarImage`, falling back to `imagePath` if empty
  - `carBrand`
  - `modelBrand`
  - `color` or `color_cn`
  - `seriesNum`
  - First 4 `tags`
  - `realCarUrl`; if present, the title and icon link externally
- Clicking a card flips it; clicking back-side links does not trigger flipping.
- `Flip All Cards` flips all current gallery cards; it is hidden in Picks and BMW History.
- Failed image loads fall back to `images/placeholder.jpg` or the model image.
- If `note` exists and is not `none`, the standard gallery card shows it as a front-corner badge, e.g. `New!` or `Unpacked`.

## 12. Data Schema For `cars.json` / `cars.json` 数据结构

中文：
`cars.json` 必须是一个 JSON 数组。每个对象代表一台收藏车。推荐字段如下：

```json
{
  "id": "n278",
  "visible": true,
  "category": "BMW",
  "modelBrand": "MINI GT",
  "carBrand": "BMW",
  "modelName": "BMW M3 Example",
  "seriesNum": "E30",
  "price": "-",
  "tags": "E30;1986;Red;1/64;My favour",
  "color": "Red",
  "color_cn": "红色",
  "description_en": "",
  "description_cn": "",
  "imagePath": "images/new2026/example-model.webp",
  "realCarImage": "images/new2026/example-real.webp",
  "realCarUrl": "https://example.com",
  "note": "none"
}
```

English:
`cars.json` must be a JSON array. Each object represents one collectible car. Recommended fields:

```json
{
  "id": "n278",
  "visible": true,
  "category": "BMW",
  "modelBrand": "MINI GT",
  "carBrand": "BMW",
  "modelName": "BMW M3 Example",
  "seriesNum": "E30",
  "price": "-",
  "tags": "E30;1986;Red;1/64;My favour",
  "color": "Red",
  "color_cn": "Red",
  "description_en": "",
  "description_cn": "",
  "imagePath": "images/new2026/example-model.webp",
  "realCarImage": "images/new2026/example-real.webp",
  "realCarUrl": "https://example.com",
  "note": "none"
}
```

## 13. Field Rules / 字段规则

中文：
- `id`：必须唯一。建议按类别使用前缀，例如 `n278`、`hw278`、`mb278`、`ar278`。当前数据中存在重复 id 的风险，自动化新增前应扫描去重。
- `visible`：布尔值。`false` 表示隐藏；缺失或 `true` 都会显示。
- `category`：用于 all 页面分类筛选和未来栏目兜底。常见值包括 `BMW`、`Hotwheels`、`Majorette`、`OZ Wheels`、`Chinese Cars`、`MGA`、`Matchbox`。
- `modelBrand`：模型品牌，例如 `Hot Wheels`、`MINI GT`、`TOMICA`、`Schuco`。Hotwheels 页面依赖精确值 `Hot Wheels`。
- `carBrand`：真实车品牌或车系品牌。BMW 页面依赖精确值 `BMW`。
- `modelName`：展示标题，应尽量完整、可搜索。
- `seriesNum`：BMW 强烈建议填写，用于 BMW Series 筛选与历史页系列分组。非 BMW 可省略。
- `price`：当前页面基本未使用，但可保留用于未来展示。未知时使用 `-` 或 `--`。
- `tags`：英文分号 `;` 分隔的字符串，不要用中文分号 `；`。用于标签筛选、年代识别、精选页、卡片 tag 展示。
- `color`：英文颜色名，用于 BMW 英文颜色筛选与卡片背面。
- `color_cn`：中文颜色名，用于中文颜色筛选与卡片背面。
- `description_en` / `description_cn`：可为空；卡片与弹窗会显示对应语言描述。
- `imagePath`：模型图路径，建议相对根目录，例如 `images/new2026/IMG_0001.webp`。
- `realCarImage`：真车图路径；为空时背面使用 `imagePath`。
- `realCarUrl`：外部资料链接；为空时隐藏/不显示外链按钮。
- `note`：卡片角标字段。默认值为 `none`；非 `none` 值会显示在普通画廊卡片角落，例如 `New!`、`Unpacked`。自动化新增车辆时，应先把旧的 `new` / `New!` 归一为 `none`，再把本次新增车辆设为 `New!`。

English:
- `id`: Must be unique. Prefixes such as `n278`, `hw278`, `mb278`, and `ar278` are recommended. Current data may contain duplicate ids, so automation should scan for duplicates before adding.
- `visible`: Boolean. `false` hides the item; missing or `true` displays it.
- `category`: Used by all-page category filtering and future tab fallback. Common values include `BMW`, `Hotwheels`, `Majorette`, `OZ Wheels`, `Chinese Cars`, `MGA`, and `Matchbox`.
- `modelBrand`: Model maker, e.g. `Hot Wheels`, `MINI GT`, `TOMICA`, `Schuco`. The Hotwheels page depends on exact value `Hot Wheels`.
- `carBrand`: Real car brand or marque. BMW pages depend on exact value `BMW`.
- `modelName`: Display title; should be complete and searchable.
- `seriesNum`: Strongly recommended for BMW; used by Series filters and history grouping. Non-BMW entries may omit it.
- `price`: Mostly unused by the current UI, but can be retained for future display. Use `-` or `--` if unknown.
- `tags`: English semicolon `;` separated string. Do not use Chinese semicolons `；`. Used for tag filters, year detection, picks, and card tag display.
- `color`: English color name for BMW English color filtering and card backs.
- `color_cn`: Chinese color name for Chinese color filtering and card backs.
- `description_en` / `description_cn`: Can be empty; cards and modal use the active language.
- `imagePath`: Model image path relative to site root, e.g. `images/new2026/IMG_0001.webp`.
- `realCarImage`: Real-car image path; if empty, card back falls back to `imagePath`.
- `realCarUrl`: External reference link; if empty, external link controls are hidden.
- `note`: Card badge field. Default is `none`; non-`none` values appear on standard gallery card corners, e.g. `New!` or `Unpacked`. Automation should normalize old `new` / `New!` values to `none` before setting newly added cars to `New!`.

## 14. Tag Rules / 标签规则

中文：
- 标签必须使用英文分号 `;` 分隔，例如 `E30;1986;Red;1/64;My favour`。
- 自动化新增时建议标签顺序：
  1. BMW 系列或主题，例如 `E30`、`F1`、`Concept`。
  2. 年份，例如 `1986`。
  3. 颜色，例如 `Red`。
  4. 比例，例如 `1/64`、`1/43`。
  5. 特殊标签，例如 `My favour`、`Cute cars`、`Hidden gem`。
- BMW 年代筛选和历史页只读取 `tags` 中第一个四位年份。
- 精选页标签必须精确匹配 `Best Love`、`My favour`、`Cute cars`、`Art`、`Hidden gem`。
- 避免在同一个标签中混用多个含义；例如不要写 `Red/Premium/1986` 作为一个标签，因为年份与颜色筛选不会按子片段理解。

English:
- Tags must be separated by English semicolons `;`, e.g. `E30;1986;Red;1/64;My favour`.
- Recommended tag order for automation:
  1. BMW series or theme, e.g. `E30`, `F1`, `Concept`.
  2. Year, e.g. `1986`.
  3. Color, e.g. `Red`.
  4. Scale, e.g. `1/64`, `1/43`.
  5. Special tags, e.g. `My favour`, `Cute cars`, `Hidden gem`.
- BMW decade filters and history view only read the first four-digit year in `tags`.
- Picks tags must exactly match `Best Love`, `My favour`, `Cute cars`, `Art`, or `Hidden gem`.
- Avoid mixing multiple meanings inside one tag; do not write `Red/Premium/1986` as one tag, because year and color logic will not treat its subparts as separate tags.

## 15. Image And Asset Rules / 图片与资源规则

中文：
- 所有路径应使用相对站点根目录的路径，例如 `images/new2026/file.webp`。
- 模型图建议使用 `imagePath`，真车图使用 `realCarImage`。
- 如果没有真车图，`realCarImage` 可以设为空字符串，背面会自动回退到模型图。
- 常用资源：
  - `images/logo.png`
  - `images/home-bg.jpg`
  - `images/banner.jpg`
  - `images/placeholder.jpg`
  - `images/picks/...`
  - `images/history/...`
  - `images/diecast/...`
  - `images/hotwheels/...`
  - `images/new2026/...`
- 自动化新增图片后必须确认文件真实存在，并注意大小写，因为静态托管环境通常区分大小写。

English:
- All paths should be relative to the site root, e.g. `images/new2026/file.webp`.
- Model photos should use `imagePath`; real-car photos should use `realCarImage`.
- If no real-car image is available, set `realCarImage` to an empty string; the card back will fall back to the model image.
- Common assets:
  - `images/logo.png`
  - `images/home-bg.jpg`
  - `images/banner.jpg`
  - `images/placeholder.jpg`
  - `images/picks/...`
  - `images/history/...`
  - `images/diecast/...`
  - `images/hotwheels/...`
  - `images/new2026/...`
- After automation adds images, confirm that files exist and that path casing is correct, since static hosts are often case-sensitive.

## 16. JSON Update Workflow / JSON 新增与更新流程

中文：
1. 备份当前 `cars.json`。
2. 使用 UTF-8 读取与写入，不要用会破坏中文字符的编码。
3. 解析 `cars.json` 为数组；如果解析失败，先修复 JSON，不要继续追加。
4. 扫描所有 `id`，生成不重复的新 id。
5. 为每台新车补齐必要字段。
6. BMW 车辆必须确认 `carBrand: "BMW"`，并建议填写 `seriesNum`、`color`、`color_cn`、年份 tag。
7. Hotwheels 页面车辆如果要显示在 Hotwheels 栏目，必须确认 `modelBrand: "Hot Wheels"`。
8. 标签使用英文分号 `;`，并 trim 每个标签。
9. 校验图片路径存在。
10. 将所有既有车辆的缺失/空白/`new`/`New!` note 归一为 `none`。
11. 新增车辆的 `note` 设置为 `New!`。
12. 写回格式化 JSON，并保留数组结构。
13. 运行 JSON 解析校验。
14. 本地启动静态服务器，确认页面没有 Data Load Error。

English:
1. Back up the current `cars.json`.
2. Read and write using UTF-8; do not use encodings that corrupt Chinese characters.
3. Parse `cars.json` as an array; if parsing fails, fix the JSON before appending anything.
4. Scan all `id` values and generate a unique new id.
5. Fill all necessary fields for each new car.
6. For BMW entries, confirm `carBrand: "BMW"` and preferably include `seriesNum`, `color`, `color_cn`, and a year tag.
7. For entries that should appear in the Hotwheels page, confirm `modelBrand: "Hot Wheels"`.
8. Use English semicolons `;` in `tags` and trim each tag.
9. Validate image paths.
10. Normalize missing/blank/`new`/`New!` note values on existing cars to `none`.
11. Set newly added cars' `note` to `New!`.
12. Write back formatted JSON while preserving the array structure.
13. Run JSON parsing validation.
14. Start a local static server and confirm the page has no Data Load Error.

## 17. Validation Rules / 校验规则

中文：
- `cars.json` 必须能被标准 JSON 解析器解析。
- `cars.json` 顶层必须是数组。
- 所有 `id` 应唯一。
- 所有可见车辆应至少包含 `id`、`visible`、`category`、`modelBrand`、`carBrand`、`modelName`、`tags`、`imagePath`、`realCarImage`、`realCarUrl`。
- 所有车辆应包含 `note`；默认值为 `none`。
- BMW 可见车辆应包含 `seriesNum`、`color`、`color_cn`，并建议在 `tags` 中包含年份。
- `imagePath` 不应为空；如果图片缺失，页面会使用 placeholder，但自动化应视为需要修复。
- 所有路径不应以 `/` 开头，除非明确改造为绝对路径部署。
- 所有外链应以 `http://` 或 `https://` 开头，空字符串允许。

English:
- `cars.json` must parse with a standard JSON parser.
- The top-level `cars.json` value must be an array.
- All `id` values should be unique.
- Every visible car should include at least `id`, `visible`, `category`, `modelBrand`, `carBrand`, `modelName`, `tags`, `imagePath`, `realCarImage`, and `realCarUrl`.
- Every car should include `note`; the default value is `none`.
- Visible BMW cars should include `seriesNum`, `color`, `color_cn`, and preferably a year in `tags`.
- `imagePath` should not be empty; although the UI can fall back to a placeholder, automation should treat missing images as issues.
- Paths should not start with `/` unless the deployment has intentionally moved to absolute paths.
- External links should start with `http://` or `https://`; empty strings are allowed.

## 18. Current Data Quality Notes / 当前数据质量注意事项

中文：
- 当前 `cars.json` 存在标准 JSON 解析失败的迹象，主要表现为部分中文字段乱码且字符串引号被破坏。
- 当前 `index.html` 内也存在多处中文文本乱码，说明曾经发生过编码问题。
- 自动化任务在继续新增或优化前，应优先修复编码与 JSON 合法性。
- 当前数据中可见到重复 id 的风险，例如早期 Hot Wheels 项中出现重复 `hw62`；新增前必须扫描全量 id。
- 不要依赖浏览器容错；`fetch(...).json()` 使用严格 JSON，解析失败会显示 `Data Load Error`。

English:
- The current `cars.json` shows signs of failing standard JSON parsing, mainly due to corrupted Chinese fields and broken string quotes.
- `index.html` also contains multiple corrupted Chinese text fragments, indicating a prior encoding issue.
- Before further additions or optimizations, automation should prioritize fixing encoding and JSON validity.
- The current data appears to have duplicate-id risk, such as duplicate `hw62` in early Hot Wheels entries; always scan all ids before adding new data.
- Do not rely on browser tolerance; `fetch(...).json()` uses strict JSON and failures show `Data Load Error`.

## 19. UI Optimization Rules / 页面优化规则

中文：
- 保持现有 BMW-like light visual system，不要无故重写整体风格。
- 保留 CSS 变量体系，如 `--bg`、`--panel`、`--text`、`--m1`、`--m2`、`--m3`、`--shadow`。
- 保持响应式布局：桌面、平板、手机均需要检查导航、筛选器、卡片、分页、精选页与历史页。
- 画廊卡片依赖 3D flip 结构，修改卡片 HTML/CSS 时要同时检查正反面。
- 历史页与精选页复用了 `picks-section`、`picks-row`、`picks-grid` 等布局类；修改时要确认两个页面都正常。
- 图片应使用 `loading="lazy"` 与 `decoding="async"`，保持当前懒加载策略。
- 保持图片失败回退逻辑，避免单张坏图破坏整个页面。

English:
- Preserve the current BMW-like light visual system; do not rewrite the whole style without a clear reason.
- Keep the CSS variable system, including `--bg`, `--panel`, `--text`, `--m1`, `--m2`, `--m3`, and `--shadow`.
- Maintain responsive layout; verify navigation, filters, cards, pagination, picks, and history on desktop, tablet, and mobile.
- Gallery cards depend on the 3D flip structure; when changing card HTML/CSS, check both front and back faces.
- BMW History and My Picks reuse classes such as `picks-section`, `picks-row`, and `picks-grid`; changes must be tested on both pages.
- Images should keep `loading="lazy"` and `decoding="async"`.
- Preserve image fallback logic so a broken image does not break the whole page.

## 20. Deployment Rules / 部署规则

中文：
- 部署文件至少包括：`index.html`、`cars.json`、`CNAME`、`images/`。
- 外部 CDN 与 Google Fonts 需要网络可访问；如需离线部署，应改为本地资源。
- GitHub Pages 或静态托管部署后，应访问正式 URL 检查：
  - 首页是否加载背景图。
  - `cars.json` 是否返回 200。
  - 页面是否无 `Data Load Error`。
  - BMW、Hotwheels、Picks、All 页面是否可切换。
  - 图片是否没有大面积 404。
  - 中文/英文切换是否正常。
- 若使用自定义域名，保留并正确配置 `CNAME`。

English:
- Deployment must include at least `index.html`, `cars.json`, `CNAME`, and `images/`.
- External CDN and Google Fonts require network access; for offline deployment, convert them to local assets.
- After deploying to GitHub Pages or another static host, check the live URL for:
  - Home background image loading.
  - `cars.json` returning 200.
  - No `Data Load Error`.
  - BMW, Hotwheels, Picks, and All tabs switching correctly.
  - No widespread image 404s.
  - Chinese/English switching working.
- If using a custom domain, keep and correctly configure `CNAME`.

## 21. Recommended Automation Checklist / 推荐自动化检查清单

中文：
- 读取文件前确认工作目录是项目根目录。
- 对 `cars.json` 运行 JSON parse。
- 对 `id` 运行唯一性检查。
- 对 `tags` 检查是否使用英文分号。
- 对 BMW 车辆检查 `seriesNum`、年份 tag、`color`、`color_cn`。
- 对 Hotwheels 页面车辆检查 `modelBrand === "Hot Wheels"`。
- 对精选标签检查是否完全匹配既有标签。
- 对所有图片路径运行存在性检查。
- 对所有外链运行格式检查。
- 启动本地静态服务器后进行浏览器 smoke test。
- 更新完成后不要无关重排整个 `index.html` 或 `cars.json`，尽量保持 diff 清晰。

English:
- Confirm the working directory is the project root before reading files.
- Run JSON parsing on `cars.json`.
- Check `id` uniqueness.
- Check that `tags` use English semicolons.
- For BMW cars, check `seriesNum`, year tag, `color`, and `color_cn`.
- For Hotwheels page entries, check `modelBrand === "Hot Wheels"`.
- Check curated tags for exact matches.
- Verify all image paths exist.
- Validate external link format.
- Start a local static server and run a browser smoke test.
- After updates, avoid unrelated reformatting of the entire `index.html` or `cars.json`; keep diffs readable.
