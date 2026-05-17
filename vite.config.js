import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.svg", "robots.txt", "sitemap.xml"],
			manifest: {
				name: "БЕБ Тренажер - Підготовка до іспиту",
				short_name: "БЕБ Тест",
				description:
					"Інтерактивний тренажер для підготовки до тестування в Бюро економічної безпеки України.",
				theme_color: "#ffffff",
				background_color: "#ffffff",
				display: "standalone",
				icons: [
					{
						src: "favicon.svg",
						sizes: "512x512",
						type: "image/svg+xml",
						purpose: "any maskable",
					},
				],
			},
		}),
	],
});
