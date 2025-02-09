const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5080;
const HOST = process.env.HOSTNAME || "127.0.0.1";
const TEST_DIR = process.env.TEST_DIR || path.join(__dirname, "node_modules"); // Use node_modules cuz why not

app.set("view engine", "ejs");

app.use("/.index/theme/", express.static(path.join(__dirname, "dist")));

app.use("/", (req, res, next) => {
    const requestPath = req.path;
    const resolvedPath = path.join(TEST_DIR, requestPath);

    // Prevent directory traversal attacks
    if (!resolvedPath.startsWith(TEST_DIR)) {
        return res.status(403).send("Access Denied");
    }

    // Check if it's a file and serve it
    fs.stat(resolvedPath, (err, stats) => {
        if (err) {
            if (err.code === "ENOENT") return next(); // File/Dir doesn't exist, proceed to 404
            console.error(err);
            return res.status(500).send("Server Error");
        }

        if (stats.isFile()) {
            return res.sendFile(resolvedPath);
        }

        // If it's a directory, list contents
        fs.readdir(resolvedPath, { withFileTypes: true }, (err, files) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error reading directory");
            }

            const fileList = files.map((file) => ({
                name: file.name + (file.isDirectory() ? "/" : ""),
                size: file.isDirectory()
                    ? "-"
                    : `${
                          fs.statSync(path.join(resolvedPath, file.name)).size
                      } B`,
                date: new Date(
                    fs.statSync(path.join(resolvedPath, file.name)).mtime
                )
                    .toISOString()
                    .split("T")[0],
            }));

            const header = fs.readFileSync(
                path.join(__dirname, "dist/header.html"),
                "utf8"
            );
            const footer = fs.readFileSync(
                path.join(__dirname, "dist/footer.html"),
                "utf8"
            );

            res.render(path.join(__dirname, "src/index"), {
                path: req.path,
                files: fileList,
                header,
                footer,
            });
        });
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).send("404 - Not Found");
});

app.listen(PORT, HOST, () => {
    console.log(`Listening on http://${HOST}:${PORT}!`);
    console.log(`Test directory = ${TEST_DIR}`);
});
