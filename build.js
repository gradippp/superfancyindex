const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const babel = require("@babel/core");
const CleanCSS = require("clean-css");

const DIST_DIR = path.join(__dirname, "dist");
const SRC_DIR = path.join(__dirname, "src");

// Ensure dist/ exists
if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Build file generation
if (!fs.existsSync("build.json")) {
    fs.copyFileSync("build.json.example", "build.json");
    console.log(
        "build.json not found. Copied build.json.example to build.json."
    );
} else {
    console.log("build.json already exists.");
}

const buildCfg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "build.json"), "utf-8")
);

// Function to render EJS and save as HTML
const renderAndSave = (srcFile, distFile) => {
    const filePath = path.join(SRC_DIR, srcFile);
    const outputPath = path.join(DIST_DIR, distFile);
    const content = fs.readFileSync(filePath, "utf8");
    const rendered = ejs.render(content, { config: buildCfg });
    fs.writeFileSync(outputPath, rendered, "utf8");
    console.log(`Rendered: ${distFile}`);
};

// Render header and footer
renderAndSave("header.ejs", "header.html");
renderAndSave("footer.ejs", "footer.html");

// Copy and minify CSS and JS files
const copyAndMinifyFiles = (srcDir, destDir) => {
    const files = fs.readdirSync(srcDir);
    files.forEach((file) => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);
        const ext = path.extname(file);

        if (ext === ".css" || ext === ".js") {
            // Copy original file
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied: ${file}`);

            // Read file content
            const content = fs.readFileSync(srcPath, "utf8");

            // Minify content
            let minifiedContent;
            let minExt = ".min" + ext;

            if (ext === ".css") {
                minifiedContent = new CleanCSS().minify(content).styles;
            } else if (ext === ".js") {
                const babelResult = babel.transformSync(content, {
                    presets: ["@babel/preset-env"],
                    minified: true,
                    comments: false,
                });
                minifiedContent = babelResult.code;
            }

            // Save minified file
            const minFilePath = path.join(destDir, file.replace(ext, minExt));
            fs.writeFileSync(minFilePath, minifiedContent, "utf8");
            console.log(`Minified: ${file} → ${path.basename(minFilePath)}`);
        }
    });
};

// Copy and minify files directly into dist/
copyAndMinifyFiles(SRC_DIR, DIST_DIR);

console.log("Build process completed!");
