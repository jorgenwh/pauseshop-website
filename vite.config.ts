import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";

// vite plugins
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import Fonts from "unplugin-fonts/vite";
// @ts-ignore
import imagemin from "unplugin-imagemin/vite";
import { compression } from "vite-plugin-compression2";
import Inspect from "vite-plugin-inspect";

export default defineConfig({
    plugins: [
        react(),
        Inspect(),
        compression(),
        imagemin(),
        tailwindcss(),
        Fonts(),
        AutoImport({
            imports: ["react", "react-router"],
            dts: "./auto-imports.d.ts",
            eslintrc: { filepath: "./eslint.config.js" },
            dirs: ["./src/components/ui"],
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            // Mock API endpoints
            '/api/analyze/stream': {
                target: 'http://localhost:5173',
                changeOrigin: true,
                configure: (proxy, _options) => {
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        // This is a workaround to handle the POST request
                        let body = '';
                        req.on('data', chunk => {
                            body += chunk;
                        });
                        
                        req.on('end', () => {
                            // Mock response with SSE format
                            res.writeHead(200, {
                                'Content-Type': 'text/event-stream',
                                'Cache-Control': 'no-cache',
                                'Connection': 'keep-alive',
                            });
                            
                            // Send mock products with delays to simulate streaming
                            setTimeout(() => {
                                res.write(`data: ${JSON.stringify({
                                    name: "Nike Air Max",
                                    iconCategory: "shoe",
                                    category: "FOOTWEAR",
                                    brand: "Nike",
                                    primaryColor: "White",
                                    secondaryColors: ["Red", "Black"],
                                    features: ["Running", "Cushioned", "Breathable"],
                                    targetGender: "UNISEX",
                                    searchTerms: "Nike Air Max white running shoes",
                                    confidence: 0.92
                                })}\n\n`);
                            }, 1000);
                            
                            setTimeout(() => {
                                res.write(`data: ${JSON.stringify({
                                    name: "Adidas Track Pants",
                                    iconCategory: "pants",
                                    category: "CLOTHING",
                                    brand: "Adidas",
                                    primaryColor: "Black",
                                    secondaryColors: ["White"],
                                    features: ["Athletic", "Comfortable", "Elastic Waist"],
                                    targetGender: "MALE",
                                    searchTerms: "Adidas black track pants men",
                                    confidence: 0.85
                                })}\n\n`);
                            }, 2000);
                            
                            setTimeout(() => {
                                res.write(`data: ${JSON.stringify({
                                    name: "Ray-Ban Sunglasses",
                                    iconCategory: "sunglasses",
                                    category: "ACCESSORIES",
                                    brand: "Ray-Ban",
                                    primaryColor: "Black",
                                    secondaryColors: ["Gold"],
                                    features: ["UV Protection", "Polarized", "Classic Design"],
                                    targetGender: "UNISEX",
                                    searchTerms: "Ray-Ban classic black sunglasses",
                                    confidence: 0.78
                                })}\n\n`);
                                
                                // Send completion event
                                res.write(`data: ${JSON.stringify({
                                    totalProducts: 3,
                                    processingTime: 2.5
                                })}\n\n`);
                                
                                res.end();
                            }, 3000);
                        });
                    });
                    
                    // Don't actually send the request to the target
                    return false;
                }
            }
        }
    }
});
