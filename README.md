# 梦途 Dreamways

此去北疆博客里的一个小网页，线上地址：<https://ciqubeijiang.github.io/Dream/>

本项目基于 [lapsea/Dreamways](https://github.com/lapsea/Dreamways)（MIT License）改造，感谢原作者。

## 构建

```bash
npm install
npm run dev     # 本地预览
npm run build   # 输出到 docs/
```

内容都在 `src/content/config.ts`，素材在 `public/`。

## 部署

GitHub Pages 设置为 `main` 分支的 `/docs` 文件夹。改完内容后重新 `npm run build`，把 `docs/` 一起提交即可。
