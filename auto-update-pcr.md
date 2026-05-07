# Daily Diecast Auto Update PCR

> Purpose: define the daily automated process for detecting raw vehicle photos, researching matching diecast models, converting images, updating `cars.json`, writing `auto-update.log`, and creating a local git commit.
>
> 用途：定义每日自动检测原始车辆图片、联网识别车模、转换图片、更新 `cars.json`、写入 `auto-update.log`、并创建本地 git commit 的流程。

## 1. Scope And Source Of Truth

The automation must run from the project root:

```text
E:\Git Projects\Laurence Yu Diecast Garage
```

Before making any change, the automation must read:

- `instruction.md` as the highest-level site/data rulebook.
- `index.html` to confirm current runtime behavior, especially `fetch('cars.json')`, BMW filtering, Hot Wheels filtering, Picks tags, pagination, and image fallback rules.
- `cars.json` to confirm existing data schema, existing brand text, existing car-brand text, current ids, and JSON validity.

Do not continue if `cars.json` cannot be parsed as a valid JSON array.

## 2. Inputs, Outputs, And Files

Input directory:

```text
E:\Git Projects\Laurence Yu Diecast Garage\images\auto-update-raw
```

Output directory:

```text
E:\Git Projects\Laurence Yu Diecast Garage\images\auto-update-webp
```

Log file:

```text
auto-update.log
```

Files that may be changed by the daily automation:

- `cars.json`
- `auto-update.log`
- New or replaced `.webp` images inside `\images\auto-update-raw`
- New or replaced `.webp` images inside `images\auto-update-webp`

Files that must not be changed by the daily automation unless explicitly requested:

- `index.html`
- `instruction.md`
- Existing manually curated images outside `images\auto-update-webp`
- `CNAME`

## 3. Raw Image Naming Contract

Every raw image intended for automation must use this filename format:

```text
[BBBB]_NNNN_A.xxx
```

Meaning:

- `[BBBB]`: rough model-brand token, such as `[hw]`, `[hotwheels]`, `[matchbox]`, `[Matchbox]`, `[arbox]`, `[autocult]`, `[DCM]`, or `[x]`.
- `NNNN`: user-provided raw vehicle id. One raw id means one collectible vehicle.
- `A`: image role.
  - `a`: required main model image for `imagePath`.
  - `r`: optional real-car image for `realCarImage`.
  - Any other letter, such as `b`, `c`, `x`: reference image used only to improve model identification.
- `.xxx`: any readable image extension, such as `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`, `.HEIC`.

Grouping rule:

- Group all files by the same `NNNN`.
- A group must contain at least one `a` image.
- If a group has no `a` image, skip it and write `SKIPPED` with reason `MISSING_MAIN_IMAGE`.
- If multiple `a` images exist for the same raw id, use the newest file as the main image and treat the others as references.

## 4. Log State Machine

`auto-update.log` may be empty. Empty log means no prior completion state is known.

Recommended log line format:

```text
YYYY-MM-DDTHH:mm:ssZ | RAW_ID=NNNN | TOKEN=bbbb | STATUS=COMPLETED | CAR_ID=hw250505 | MODEL="..." | NOTES="..."
```

Statuses:

- `COMPLETED`: high-confidence entry was written with `visible: true`; future daily runs must skip this raw id.
- `DRAFT_WRITTEN`: low-confidence entry was written with `visible: false`; future daily runs must skip this raw id until the user manually reviews it.
- `SKIPPED`: input was invalid or unusable, such as bad filename, missing main image, unreadable image, or image too large after conversion. Future runs may retry only if raw files changed.
- `FAILED`: a required step failed, such as network search, image conversion, JSON validation, or git operation. Future runs may retry.

Special failure reasons to use in `NOTES`:

- `FAILED_JSON_PARSE`
- `BAD_FILENAME`
- `MISSING_MAIN_IMAGE`
- `IMAGE_DECODE_FAILED`
- `WEBP_TOO_LARGE`
- `FAILED_IDENTIFICATION`
- `FAILED_REAL_CAR_SEARCH`
- `FAILED_JSON_VALIDATE`
- `FAILED_GIT_COMMIT`

Skip rule:

- If the latest log entry for a raw id is `COMPLETED` or `DRAFT_WRITTEN`, do not process that raw id again.
- If the latest log entry is `FAILED` or `SKIPPED`, the automation may retry when matching raw files are still present.

## 5. Daily Execution Procedure

1. Confirm working directory is the project root.
2. Read `instruction.md`.
3. Inspect `index.html` for current data-loading and filtering rules.
4. Parse `cars.json` as UTF-8 JSON.
5. Confirm `cars.json` top-level value is an array.
6. Scan existing ids, `modelBrand` values, `carBrand` values, `category` values, and common tags.
7. Read `auto-update.log` if it exists; treat a missing or empty log as no completed raw ids.
8. Scan `images\auto-update-raw` for image files.
9. Parse filenames and group files by raw id.
10. Skip groups whose latest log status is `COMPLETED` or `DRAFT_WRITTEN`.
11. Validate each group has a main `a` image.
12. Convert all readable group images to `.webp` into `images\auto-update-webp`.
13. Confirm every output `.webp` is readable and smaller than 1 MB.
14. Use the main image, reference images, and brand token to research the most likely model product online.
15. Generate one `cars.json` entry per raw id.
16. Validate generated fields against the BMW or non-BMW rules below.
17. Normalize existing `note` values of `new`, `New!`, empty, or missing to `none`.
18. Set each generated entry's `note` to `New!`.
19. Append generated entries to the end of the `cars.json` array.
20. Re-parse the written `cars.json`.
21. Run data validation: id uniqueness, required fields, image paths, semicolon tags, URL format.
22. Run a local smoke test if possible: serve the site and verify no `Data Load Error`.
23. Write one log entry per raw id.
24. Stage only `cars.json`, `auto-update.log`, and this run's `.webp` outputs.
25. Create one local git commit for all successful and draft entries from the daily run.
26. Do not push.

If any hard gate fails before writing `cars.json`, stop without modifying `cars.json`.

## 6. Image Conversion Rules

Allowed image sources:

- User-provided images from `images\auto-update-raw`.
- Real-car images downloaded from web research.

Disallowed image sources:

- AI-generated images.
- Placeholder images used as if they were confirmed real/model photos.

Output rules:

- Convert every used image to `.webp`.
- Store outputs under `images\auto-update-webp`.
- Use lowercase role letters in output filenames.
- Preserve the brand token and raw id in the output name.

Recommended output naming:

```text
images\auto-update-webp\[bbbb]_NNNN_a.webp
images\auto-update-webp\[bbbb]_NNNN_r.webp
images\auto-update-webp\[bbbb]_NNNN_b.webp
```

Quality gates:

- The output image must decode successfully.
- The output file must be smaller than 1 MB.
- If the first conversion exceeds 1 MB, recompress or resize until it is below 1 MB while keeping the vehicle recognizable.
- If the image cannot be made readable and below 1 MB, skip the vehicle and log `SKIPPED` with `WEBP_TOO_LARGE` or `IMAGE_DECODE_FAILED`.

## 7. Brand Token Mapping

Always prefer existing exact text from `cars.json`.

Known mappings:

| Raw token | Preferred `modelBrand` | Preferred category/id prefix |
| --- | --- | --- |
| `[hw]` | `Hot Wheels` | `Hotwheels` / `hw` |
| `[hotwheels]` | `Hot Wheels` | `Hotwheels` / `hw` |
| `[matchbox]` | `Matchbox` | `Matchbox` / `mb` |
| `[Matchbox]` | `Matchbox` | `Matchbox` / `mb` |
| `[arbox]` | `Almost Real` | BMW if carBrand is BMW, otherwise `Almost Real` / `ar` |
| `[autocult]` | `AutoCult` | BMW if carBrand is BMW, otherwise `AutoCult` / `ac` |
| `[DCM]` | `DCM` | BMW if carBrand is BMW, otherwise `DCM` / `dcm` |
| `[x]` | Research required | infer model brand from image/web results |

If a token is unknown:

1. Search existing `modelBrand` values in `cars.json` for a close match.
2. If no match exists, create a clean title-cased model brand from the token.
3. Record the new mapping in the log `NOTES`.

If the token is `[x]`:

1. Treat the model brand as unknown, not literally `X`.
2. Use image search and visible packaging/logo details to infer the model brand.
3. Prefer an existing `cars.json` `modelBrand` value if the researched brand already exists.
4. If the brand still cannot be identified, write a low-confidence draft only when the vehicle itself is identified; otherwise log `FAILED_IDENTIFICATION`.

## 8. Research And Confidence Rules

Use one or more raw images plus the rough brand token to identify the diecast model.

Research should prioritize:

- Model brand and product line.
- Real vehicle manufacturer.
- Full model name.
- Livery, color, year, special edition, chase/treasure status, race number, driver name, or set name.
- Scale, such as `1/64`, `1/43`, `1/72`.
- Product price with currency/unit, if available.
- For BMW: chassis/series code and earliest real-world production year for that real vehicle series.
- Real-car reference URL for history/story/detail page.
- Real-car image matching the same real model, and preferably the same color, when no user-provided `r` image exists.

Confidence policy:

- High confidence: model brand, real car brand, model name, and visible appearance all align. Write `visible: true` and log `COMPLETED`.
- Low confidence: a likely match exists but one or more fields need user review. Write a complete entry with `visible: false` and log `DRAFT_WRITTEN`.
- No reliable identification: do not write to `cars.json`; log `FAILED` with `FAILED_IDENTIFICATION`.

## 9. `cars.json` Entry Rules

All entries must include:

```json
{
  "id": "",
  "visible": true,
  "category": "",
  "modelBrand": "",
  "carBrand": "",
  "modelName": "",
  "price": "-",
  "tags": "",
  "color": "",
  "color_cn": "",
  "description_en": "",
  "description_cn": "",
  "imagePath": "",
  "realCarImage": "",
  "realCarUrl": "",
  "note": "New!"
}
```

Use UTF-8 and valid JSON only. Do not hand-edit JSON with string concatenation. Use a JSON parser/writer.

### BMW Entries

BMW detection:

- If the real vehicle brand is BMW, set `carBrand` to exactly `BMW`.

Required values:

```json
{
  "visible": true,
  "category": "BMW",
  "carBrand": "BMW",
  "description_en": "",
  "description_cn": ""
}
```

Field rules:

- `id`: use `n{RAW_ID}`. If it already exists, use `n{RAW_ID}_2`, then `n{RAW_ID}_3`, and so on.
- `modelBrand`: use existing `cars.json` text when possible, such as `Almost Real`.
- `modelName`: full researched diecast/vehicle model name.
- `seriesNum`: researched BMW series/chassis code, such as `E30`, `G82`, `F1`, `Concept`, `Type102`.
- `price`: researched market price plus currency/unit. If unknown, use `-`.
- `tags`: `seriesNum;earliest real-world production year;basic color;scale`.
- `color`: basic English color, such as `Red`, `Blue`, `White`, `Black`, `Silver`, `Grey`, `Green`, `Yellow`, `Pink`, `Orange`, `Brown`, `Purple`.
- `color_cn`: Chinese color equivalent, such as `红色`, `蓝色`, `白色`, `黑色`, `银色`, `灰色`, `绿色`, `黄色`, `粉色`, `橙色`, `棕色`, `紫色`.
- `imagePath`: relative path to converted main image, e.g. `images/auto-update-webp/[arbox]_2655_a.webp`.
- `realCarImage`: converted user `r` image if present; otherwise download or capture a real-car image from a searched page when the exact real vehicle model can be confirmed. Prefer same color. If exact real-car confirmation is not possible, fall back to the model image path according to the current page behavior.
- `realCarUrl`: same real model history/story/detail link.
- `note`: for newly added entries, set `New!`. Before adding new entries, normalize all existing `note` values of `new` or `New!` to `none`.

### Non-BMW Entries

Required values:

```json
{
  "visible": true,
  "description_en": "",
  "description_cn": ""
}
```

Field rules:

- `id`: use brand prefix plus raw id, such as `hw{RAW_ID}`, `mb{RAW_ID}`, `ar{RAW_ID}`. If it already exists, append `_2`, then `_3`, and so on.
- `modelBrand`: use existing `cars.json` text when possible.
- `carBrand`: use existing `cars.json` brand text when possible. Examples: `HongQi`, `HW Originals`, `Porsche`, `Ford`, `Toyota`.
- `category`: use the matching model-brand category. For Hot Wheels, use exactly `Hotwheels`.
- `modelName`: full researched model name.
- `price`: researched market price plus currency/unit. If unknown, use `--`.
- `tags`: for Hot Wheels, include series/status such as `Mainline/Silver/Premium`, `Treasure Hunt`, or `Super Treasure Hunt`; then add `basic color;scale` when known.
- `color`: basic English color.
- `color_cn`: Chinese color equivalent.
- `imagePath`: relative path to converted main image.
- `realCarImage`: converted user `r` image if present; otherwise download or capture a real-car image from a searched page when the exact real vehicle model can be confirmed. Prefer same color. If exact real-car confirmation is not possible, fall back to the model image path according to the current page behavior.
- `realCarUrl`: real model reference link when confidently identified; otherwise an empty string.
- `note`: for newly added entries, set `New!`. Before adding new entries, normalize all existing `note` values of `new` or `New!` to `none`.

## 10. Validation Checklist

Run all applicable checks before committing:

- `cars.json` parses successfully as a JSON array.
- Every new `id` is unique across the entire file.
- Every new visible or draft entry has required fields.
- Every entry has `note`; existing entries use `none`, and entries added in the current run use `New!`.
- BMW entries have `category: "BMW"`, `carBrand: "BMW"`, `seriesNum`, `color`, `color_cn`, and a four-digit year in `tags`.
- Hot Wheels entries that should appear in the Hotwheels tab have `modelBrand: "Hot Wheels"`.
- `tags` uses English semicolons `;`, not Chinese semicolons.
- `imagePath` and `realCarImage` paths, when non-empty, exist and use relative paths without a leading slash.
- `realCarUrl`, when non-empty, starts with `http://` or `https://`.
- Every `.webp` output is readable and smaller than 1 MB.
- No generated image is used.
- A local site smoke test shows no `Data Load Error`.

## 11. Git Commit Rules

Commit only after all validations pass.

Stage only:

- `cars.json`
- `auto-update.log`
- Newly created or updated files in `images\auto-update-webp`

Do not stage:

- Raw images in `images\auto-update-raw`
- `index.html`
- unrelated user changes
- unrelated image files

Commit strategy:

- Create one daily summary commit for all successful and draft entries.
- Do not push.

Recommended commit message:

```text
Auto update diecast inventory YYYY-MM-DD
```

If git commit fails:

- Leave working tree changes intact.
- Log `FAILED` with `FAILED_GIT_COMMIT`.
- Do not retry destructive git commands.

## 12. Human Review Notes

After each automated run, review:

- Any `DRAFT_WRITTEN` entries with `visible: false`.
- Any new model-brand mapping created from an unknown token.
- Any BMW `seriesNum` or earliest production year inferred from web research.
- Any real-car image downloaded from the web.
- The git diff before pushing.

Manual approval is recommended before changing draft entries from `visible: false` to `visible: true`.
