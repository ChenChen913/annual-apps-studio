# 素材与第三方资源许可说明（ASSETS_LICENSE）

本文件记录 `annual-apps-studio` 随项目分发的**图片、图标、字体**等素材的来源与许可条件。它只覆盖素材，**不构成对项目源代码的授权**；反之，代码仓库的许可也不自动覆盖这里的素材。

> 结论先说：新增的 20 张实拍背景全部为 **CC0 1.0**（可商用、可再分发、无署名义务，但本文件仍逐项署名）；3 张原有默认背景为项目早期素材，已恢复原构图并本地放大到 3840px；10 张设计背景为本项目自行生成；115 个内置图标来自 4 个来源，其中 99 个为 CC0 / MIT / Apache-2.0，16 个为项目原有的品牌官方图稿（版权归各品牌，仅作识别用途，其中 Notepad++ 经典图标原文件为 GPL）。字体为**霞鹜文楷**，SIL OFL 1.1。

---

## 1. 代码许可

仓库目前**没有**附带 `LICENSE` 文件。除非作者另行声明，源代码版权归作者所有（All rights reserved）。

- 本文件列出的素材许可**不能**被解读为「整个项目可自由再分发」。
- 若你 fork 本项目并公开发布，请自行补充代码许可证（如 MIT / Apache-2.0），并保留本文件与素材署名信息。
- 若你只再分发素材，请遵循各素材自身的许可（见下文），不要引用项目代码。

---

## 2. 背景素材

当前背景库共 **66 张**，分为六个族：自然 / 抽象 / 科技 / 极简 / 人物 / 经典。
其中新增 30 张（20 张实拍 + 10 张设计），原有 36 张（3 张项目原有默认背景 + 33 张 CSS/SVG 程序绘制）。

### 2.1 新增实拍背景（20 张，CC0 1.0）

来源：**Wikimedia Commons**。筛选方式为按「CC0 1.0」授权声明检索候选（122 张），再人工按构图、色彩层次、与图标的对比度挑选 20 张。

处理方式：下载长边 3840px 原图 → 转 WebP（质量 82）；另生成长边 720px 的 `-thumb.webp` 供选择器使用。文件位于 `public/backgrounds/`。2026-11-26 第二轮升级把原先的 1800px 版本全部替换，避免 2× 导出时上采样发虚；3 张原始分辨率不足的素材也换成了更高清的同类作品。

CC0 1.0（Public Domain Dedication）允许复制、修改、商用、再分发，且**不要求署名**。下表署名是出于对作者的尊重与可追溯性，不是许可强制要求。

| # | 背景 ID | 名称 | 分类 | 作者 | 原作品 / 来源页 | 许可 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `photo-snowpeak` | 霞光雪峰 | 实拍 · 雪山 | Romain Guy | [Mount Fuji at sunset, March 2025](https://commons.wikimedia.org/wiki/File:Mount_Fuji_at_sunset,_March_2025.jpg)（11650×7767） | CC0 1.0 |
| 2 | `photo-forestfog` | 雾锁林海 | 实拍 · 森林 | Vadim Sherbakov | [Foggy pine (Unsplash)](https://commons.wikimedia.org/wiki/File:Foggy_pine_(Unsplash).jpg) | CC0 1.0 |
| 3 | `photo-birch` | 白桦林径 | 实拍 · 森林 | Romzig | [Edderitz (Oktober 2026)](https://commons.wikimedia.org/wiki/File:Edderitz_(Oktober_2026)_1.jpg) | CC0 1.0 |
| 4 | `photo-goldwoods` | 金秋林间 | 实拍 · 秋景 | lumoplank | [Yamanakako - Yamanaka6753](https://commons.wikimedia.org/wiki/File:Yamanakako_-_Yamanaka6753.jpg) | CC0 1.0 |
| 5 | `photo-reef` | 碧海礁岸 | 实拍 · 海洋 | lumoplank | [Cape Peninsula](https://commons.wikimedia.org/wiki/File:Cape_Peninsula_-_CapePeninsula4327.jpg) | CC0 1.0 |
| 6 | `photo-cliff` | 海岸悬崖 | 实拍 · 海岸 | Gerda Arendt | [El Remo, La Palma](https://commons.wikimedia.org/wiki/File:El_Remo,_La_Palma,_surf_against_black_cliffs.jpg) | CC0 1.0 |
| 7 | `photo-lakeglow` | 湖光山色 | 实拍 · 湖泊 | Johannes Plenio | [Beautiful mountain reflection](https://commons.wikimedia.org/wiki/File:Beautiful_mountain_reflection_(Unsplash).jpg) | CC0 1.0 |
| 8 | `photo-glacierlake` | 冰川湖 | 实拍 · 湖泊 | James Wheeler | [Lake and mountain](https://commons.wikimedia.org/wiki/File:Pexels-james-wheeler-417074.jpg) | CC0 1.0 |
| 9 | `photo-dawnsea` | 海上晨光 | 实拍 · 日出 | paul morris oldskool2016 | [Richly colored sky over calm sea water](https://commons.wikimedia.org/wiki/File:Richly_colored_sky_over_calm_sea_water_(Unsplash).jpg)（4164×2716） | CC0 1.0 |
| 10 | `photo-firecloud` | 火烧云 | 实拍 · 日落 | cindy del valle | [Dramatic golden sunset](https://commons.wikimedia.org/wiki/File:Dramatic_golden_sunset._(Unsplash).jpg) | CC0 1.0 |
| 11 | `photo-duskcloud` | 暮色云霞 | 实拍 · 云层 | Jebulon | [Stormy sunset clouds over Rome, Italy](https://commons.wikimedia.org/wiki/File:Stormy_sunset_clouds_over_Rome,_Italy.jpg)（4030×3056） | CC0 1.0 |
| 12 | `photo-milkyway` | 星河 | 实拍 · 夜空 | W.carter | [Stars and Milky Way over Åbyfjorden](https://commons.wikimedia.org/wiki/File:Stars_and_Milky_Way_over_%C3%85byfjorden_2.jpg) | CC0 1.0 |
| 13 | `photo-dunes` | 沙丘曲线 | 实拍 · 沙漠 | Keith Hardy | [Hiking Through Sand Dunes](https://commons.wikimedia.org/wiki/File:Hiking_Through_Sand_Dunes_(Unsplash).jpg) | CC0 1.0 |
| 14 | `photo-citynight` | 城市夜色 | 实拍 · 城市夜景 | Wilfredor | [Cannon on the ramparts, Quebec City](https://commons.wikimedia.org/wiki/File:Cannon_on_the_ramparts_and_the_Lower_Town_at_night,_Quebec_City.jpg) | CC0 1.0 |
| 15 | `photo-skyline` | 天际线 | 实拍 · 城市夜景 | Mitul Shah | [Gray High-rise Building at Night](https://commons.wikimedia.org/wiki/File:Gray_High-rise_Building_at_Night_373893.jpg) | CC0 1.0 |
| 16 | `photo-aurora` | 极光湖面 | 实拍 · 极光 | Yuliya | [Aurora borealis over water](https://commons.wikimedia.org/wiki/File:PIXNIO-1094468-aurora_borealis.jpg) | CC0 1.0 |
| 17 | `photo-waterfall` | 彩虹瀑布 | 实拍 · 瀑布 | Sorasak Boontohhgraphy | [Iceland (Unsplash)](https://commons.wikimedia.org/wiki/File:Iceland_(Unsplash_8ZAxI5FwjFo).jpg) | CC0 1.0 |
| 18 | `photo-snowroad` | 雪国林道 | 实拍 · 雪景 | Jon Flobrant | [Snow Forest Winter Gäddede](https://commons.wikimedia.org/wiki/File:Snow_Forest_Winter_G%C3%A4ddede_(Unsplash_3BWzjqbMlDk).jpg) | CC0 1.0 |
| 19 | `photo-traffic` | 暮色车流 | 实拍 · 城市光轨 | Pierre Blaché | [Bir-Hakeim bridge at dusk](https://commons.wikimedia.org/wiki/File:Bir-Hakeim_bridge,_Paris_24_June_2021.jpg) | CC0 1.0 |
| 20 | `photo-nightroad` | 夜路光轨 | 实拍 · 光轨 | Jamie Street | [Highway light trains at night](https://commons.wikimedia.org/wiki/File:Highway_light_trains_at_night_(Unsplash).jpg) | CC0 1.0 |

程序化读取位置：`src/data/backgrounds.ts` 的 `PHOTO_LIBRARY`。**新增或替换背景时，必须同步更新该常量与本表**，否则 UI 里的署名信息会与实际素材不一致。

### 2.2 新增设计背景（10 张，本项目生成）

由本项目维护者使用图像生成模型产出，无第三方受版权保护素材作为输入底图，随项目一同发布（`license: 随项目发布`）。

| 背景 ID | 名称 | 族 | 文件 |
| --- | --- | --- | --- |
| `design-mesh` | 极光网格 | 抽象 | `design-mesh.webp` |
| `design-glass` | 液态玻璃 | 抽象 | `design-glass.webp` |
| `design-liquid` | 液态大理石 | 抽象 | `design-liquid.webp` |
| `design-chrome` | 液态铬金 | 抽象 | `design-chrome.webp` |
| `design-stage` | 发布会舞台 | 科技 | `design-stage.webp` |
| `design-prism` | 玻璃棱镜 | 极简 | `design-prism.webp` |
| `design-deepblue` | 深蓝粒子 | 科技 | `design-deepblue.webp` |
| `design-traces` | 光轨曲线 | 科技 | `design-traces.webp` |
| `design-paper` | 米白纸张 | 极简 | `design-paper.webp` |
| `design-shadow` | 米色光影 | 极简 | `design-shadow.webp` |

处理方式：设计背景与实拍统一为长边 3840px WebP（质量 82）+ 720px 缩略图。原「柔光渐变」「数据网格」因画面发糊、缺乏主体已删除，由「极光网格」「发布会舞台」替换；原「磨砂玻璃」升级为液态玻璃主视觉。生成模型的服务条款允许将产出用于商业与再分发；本项目按「随项目发布」处理。若你所在司法辖区对 AI 生成物的版权归属有不同规定，请以当地法律与服务条款为准。

### 2.3 原有素材（36 张）

- **3 张原有默认背景**：`bg_forest.webp`、`bg_bay.webp`、`bg_night.webp`（背景 id：`forest` / `bay` / `night`）。本轮已恢复项目早期的原构图（此前第二轮曾替换为 CC0 实拍，用户要求找回），保留旧 id 以不破坏老项目与草稿引用：
  - `forest`：林间夜灯（项目原有素材，1600×900 原图，本地放大至 3840×2160）
  - `bay`：海湾暮色（项目原有素材，1600×900 原图，本地放大至 3840×2160）
  - `night`：城市夜眺（项目原有素材，1600×900 原图，本地放大至 3840×2160）
  - 三张图的原始 1600×900 文件由维护者保留在工作区备份；仓库内为放大后的 3840px 版本，未做内容重绘。
- **33 张程序绘制背景**：由 `src/data/backgrounds.ts` 内的 CSS 渐变、SVG 图案、噪点纹理在本地生成，不含第三方图像，无额外许可问题。

### 2.4 背景分发注意事项

- CC0 素材虽无署名义务，但**不要**声称对原始照片享有著作权。
- 二次创作（裁切、调色、加文字）后仍建议保留本文件的来源记录，便于追溯。
- 不要从「可免费下载」的图库直接搬运未声明许可的图片；本项目的准入标准是：**能在素材页看到明确的 CC0 / CC BY / 同类开放许可声明**。

---

## 3. 图标素材

内置图标库共 **115 个**（清单维护在 `src/data/icons.ts`，文件位于 `public/icons/`），全部为本地 320px WebP，运行时**不发任何网络请求**。

### 3.1 来源与许可分布

| 来源 | 数量 | 许可 | 说明 |
| --- | --- | --- | --- |
| SVG Logos（经 Iconify 分发） | 55 | **CC0 1.0** | 彩色品牌图标集，可再分发 |
| Dashboard Icons（homarr-labs/dashboard-icons） | 27 | **Apache-2.0**（仓库许可） | 自建服务 / NAS / 系统类 Logo |
| Devicon（经 Iconify 分发） | 17 | **MIT** | 开发工具与技术栈图标 |
| 项目原有内置图标 | 16 | **版权归各品牌，随项目原样保留**；`notepadpp` 为项目早期官方图稿（经典白底，GPL） | 官方应用图稿，仅作识别软件用途 |
| 合计 | **115** | | |

「项目原有内置图标」清单（用于确认分发边界）：
`trae`、`workbuddy`、`hermes`、`deepseek_harness`、`yuanbao`、`doubao_ime`、`typeless`、`typora`、`feishu`、`wechat`、`douyin`、`localsend`、`faststone`、`wetype`、`v2rayn`、`notepadpp`。

这 16 个图标**不适用** CC0 / MIT / Apache-2.0，它们是各软件厂商的商标或官方应用图标。本项目仅在「标识用户安装了哪款软件」的语境下展示，不修改其配色与造型，也不用于暗示背书。其中 `notepadpp` 使用项目早期的 Notepad++ 官方图稿（经典白底版，作者 Don Ho，**GPL**）；该文件单独按 GPL 分发，如再分发请保留其许可声明与来源说明，它不改变本项目其它代码与素材的许可。**若你计划商业发行，请自行评估商标合理使用范围；如无法确认，删除对应图标即可，不影响其它功能。**

### 3.2 商标声明

所有品牌名称与图标均为其各自所有者的商标或注册商标。本项目与这些厂商无关联、未获其背书。图标仅用于在用户自制的「年度软件」海报中标识软件。

### 3.3 在线图标搜索

- 实现位置：`src/lib/onlineIcons.ts`，只调用 **Iconify 公开 API**（`https://api.iconify.design`）。该 API 允许跨域读取（`Access-Control-Allow-Origin: *`），无需密钥。
- 白名单集合：`logos`（CC0 1.0）、`simple-icons`（CC0 1.0）、`devicon`（MIT）、`selfhst`（CC BY 4.0）。
- 只在用户主动点击「在线搜索」并发起搜索时才请求；编辑器其余功能**完全离线可用**。
- 命中结果会先栅格化为 320px WebP data URL 再落库，确保保存后离线仍可显示；不会把远程 URL 直接写进项目文件。
- 若使用 `selfhst` 集合的图标并对外发布，需按 **CC BY 4.0** 署名（本文件的来源表可作为署名位置）。
- **不接入**的来源及原因：
  - `macOSicons.com`：无公开 API，站点条款未授权批量抓取，且为 macOS 社区图标、非 Windows 原生图标。
  - `Windows Icon Archive`（limehawk.github.io）：无公开检索接口，只能人工浏览。
  - 上述站点均未以 iframe 嵌入方式接入。

### 3.4 AI 名录头像与站点图标

- `public/creators/` 另有 **41 张创作者头像 + 7 张信息站图标**，供「名录」模板使用；它们不计入上面的 115 个软件图标库。
- 人物头像来自 Bilibili 公开头像接口、微信公众号公开头像、GitHub、微博、人人都是产品经理作者页及个人官网；站点图标来自各站官网或 Simple Icons（CC0 1.0）。
- 头像与站点图标的版权归各自权利人所有，本项目仅在「推荐与识别创作者 / 信息源」的语境中展示，不修改人物头像，也不暗示其为本项目背书。若再分发或商用，请自行确认授权；无法确认时替换或删除对应文件即可。
- 逐项来源、原始尺寸与核对记录见 `public/creators_sources.json`。

### 3.5 用户上传的图标

- 用户上传的图片（PNG / JPG / WebP / SVG）只保存在**本机 IndexedDB**，随项目文件或草稿导出，不上传到任何服务器。
- 用户需自行确保其上传素材的合法使用权；本项目不对此类素材做许可声明。
- 「保存到我的图标库」是**本地个人库**；「作为项目公共内置图标发布」不在运行时提供——公共库只能通过向 `public/icons/` 增加图标文件、并在 `src/data/icons.ts` 中登记（运行期只读）来扩充。
- 对于许可不明或明确禁止再分发的图标，界面只提供「仅本次使用」，不会静默加入任何可再分发的集合。

---

## 4. 字体

| 字体 | 文件 | 许可 |
| --- | --- | --- |
| 霞鹜文楷 LXGW WenKai | `public/fonts/lxgw-regular.woff2`、`lxgw-medium.woff2` | **SIL Open Font License 1.1** |

OFL 1.1 允许嵌入、再分发与商用，要求：不得单独售卖字体文件、修改后不得继续使用保留字体名（Reserved Font Name）。本项目以子集化 WOFF2 形式随站点分发，未修改字形。字体全部本地加载，断网可用。

---

## 5. 第三方代码依赖

运行依赖与开发依赖的许可以其各自仓库的 `LICENSE` 为准（主要为 MIT / Apache-2.0 / ISC 等宽松许可），完整清单见 `package.json` 与 `package-lock.json`。本项目未引入任何需要商业授权或带 copyleft 传染性的依赖。

---

## 6. 发布前检查清单

- [x] 20 张新增实拍背景均为 CC0，已逐项记录作者与来源页
- [x] 10 张设计背景为本项目生成，无第三方底图
- [x] 3 张原有默认背景（`forest` / `bay` / `night`）已恢复项目原构图，旧 id 保留
- [x] 115 个内置图标的来源与许可已分类记录
- [x] 16 个项目原有品牌图标的商标风险已在 3.1 标注（`notepadpp` 的 GPL 经典图标单独说明）
- [x] 字体许可已记录（OFL 1.1）
- [ ] 代码许可证（`LICENSE` 文件）待作者确认后添加
- [x] 在线搜索仅走公开 API，未抓取页面、未使用 iframe

---

## 7. 变更记录

| 日期 | 变更 |
| --- | --- |
| 2026-11-26 | 初版：新增 20 张 CC0 实拍背景、8 张生成背景、114 个内置图标、字体与在线搜索说明 |
| 2026-11-26 | 第二轮：实拍背景全部升级为 3840px（3 张换更高清素材，3 张原有图替换为 CC0）；补 Notepad++ 官方 Logo（GPL，库内 115 个图标）；修正文档中的尺寸与来源记录 |
| 2026-11-26 | 第三轮：恢复 Notepad++ 经典白底图标；恢复 3 张原默认背景并本地放大至 3840px；设计背景扩充为 10 张（新增极光网格、液态玻璃、液态铬金、发布会舞台、玻璃棱镜），删除柔光渐变与数据网格 |
