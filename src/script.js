var content = $("body > div.container > div > div");
var table = $("table", content);
var hasHTML = false;

// File extension to Bootstrap icon map
var iconMap = {
    zip: "bi bi-file-zip-fill",
    rar: "bi bi-file-zip-fill",
    "7z": "bi bi-file-zip-fill",
    tar: "bi bi-file-zip-fill",
    gz: "bi bi-file-zip-fill",

    jpg: "bi bi-file-image",
    jpeg: "bi bi-file-image",
    png: "bi bi-file-image",
    gif: "bi bi-file-image",
    bmp: "bi bi-file-image",
    svg: "bi bi-file-image",
    webp: "bi bi-file-image",

    mp3: "bi bi-file-music",
    wav: "bi bi-file-music",
    ogg: "bi bi-file-music",
    flac: "bi bi-file-music",
    aac: "bi bi-file-music",

    mp4: "bi bi-file-play",
    mkv: "bi bi-file-play",
    avi: "bi bi-file-play",
    mov: "bi bi-file-play",
    wmv: "bi bi-file-play",
    webm: "bi bi-file-play",

    pdf: "bi bi-file-pdf",
    doc: "bi bi-file-word",
    docx: "bi bi-file-word",
    xls: "bi bi-file-excel",
    xlsx: "bi bi-file-excel",
    ppt: "bi bi-file-ppt",
    pptx: "bi bi-file-ppt",

    txt: "bi bi-filetype-text",
    md: "bi bi-filetype-md",
    csv: "bi bi-filetype-csv",

    html: "bi bi-file-code",
    css: "bi bi-file-code",
    js: "bi bi-file-code",
    ts: "bi bi-file-code",
    json: "bi bi-filetype-json",
    xml: "bi bi-filetype-xml",
    yaml: "bi bi-filetype-yml",
    yml: "bi bi-filetype-yml",

    exe: "bi bi-file-binary",
    dll: "bi bi-file-binary",
    bin: "bi bi-file-binary",

    iso: "bi bi-disc",
    img: "bi bi-disc",

    apk: "bi bi-android",
    deb: "bi bi-file-binary",
    rpm: "bi bi-file-binary",
    dmg: "bi bi-file-binary",
};

function replaceHTML() {
    var hasHeader = false;
    var headerData = undefined;
    var footerData = undefined;
    $('a[href="HEADER.html" i],a[href="FOOTER.html" i]').each(function (i, el) {
        hasHTML = true;

        var filename = $(el).attr("href");
        $.get(filename, function (data) {
            if (filename.toLowerCase() === "header.html") {
                headerData = data;
            } else if (filename.toLowerCase() === "footer.html") {
                footerData = data;
            }

            if (headerData !== undefined && footerData !== undefined) {
                document.open();
                document.write(headerData);
                document.write(table.wrap("<div>").parent().html());
                document.write(footerData);
                document.close();
            }
        });
    });
}

function showReadme() {
    $('a[href="README.md" i],a[href="README" i],a[href="README.txt" i]').each(
        function (i, el) {
            var filename = $(el).attr("href");

            $.get(filename, function (data) {
                var e = $('<div id="README"></div>');
                e.append("<hr>");

                if (filename.toLowerCase() === "readme.md") {
                    var converter = new showdown.Converter();
                    converter.setFlavor("github");
                    var div = $("<div>");
                    div.html(converter.makeHtml(data));
                    e.append(div);
                } else {
                    var pre = $("<pre>");
                    pre.text(data);
                    e.append(pre);
                }

                content.append(e);
            });

            return false;
        }
    );
}

function replaceBreadcrumbs() {
    // Remove the default nginx indexing
    document.querySelectorAll("#breadcrumb")[0]?.nextSibling?.nodeType ===
        Node.TEXT_NODE &&
        (document.querySelectorAll("#breadcrumb")[0].nextSibling.textContent =
            "");

    // Get the breadcrumb container
    const breadcrumbContainer = document.getElementById("breadcrumb");

    // Check if the breadcrumb container exists
    if (!breadcrumbContainer) {
        console.error("Breadcrumb container not found.");
        return;
    }

    const urlPath = window.location.pathname;

    const bits = urlPath.split("/").filter((bit) => bit.trim() !== ""); // Remove empty bits

    let breadcrumbHTML = "";
    let path = "";

    // Add a "Home" link as the first breadcrumb
    breadcrumbHTML += `
        <li class="breadcrumb-item">
            <a href="/">Home</a>
        </li>
    `;

    // Iterate through the bits and create breadcrumb items
    bits.forEach((bit, index) => {
        path += `/${bit}`; // Build the path incrementally

        // Check if this is the last bit (current page)
        if (index === bits.length - 1) {
            breadcrumbHTML += `
                <li class="breadcrumb-item active" aria-current="page">
                    ${bit}
                </li>
            `;
        } else {
            breadcrumbHTML += `
                <li class="breadcrumb-item">
                    <a href="${path}">${bit}</a>
                </li>
            `;
        }
    });

    // Add the breadcrumb HTML to the container
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

function fixTable() {
    var table = $("#list");

    table.removeAttr("cellpadding");
    table.removeAttr("cellspacing");
    table.addClass([
        "table",
        "table-dark",
        "table-sm",
        "table-hover",
        "text-nowrap",
        "table-striped",
        "table-borderless",
    ]);

    var header = $("tr", table)[0];
    header.remove();
    var thead = $("<thead>");
    thead.addClass(["thead-dark"]);
    thead.append(header);
    table.prepend(thead);
    $(header).prepend($('<th class="col-auto"></th>'));
    $("th:gt(1)", header).addClass(["col-auto", "d-none", "d-md-table-cell"]);

    $('a[href^="../"]', table).closest("tr").remove();

    $("tbody tr", table).each(function () {
        var icon = $("<td></td>");
        icon.addClass(["col-auto"]);
        var filename = $("td:first a", this).attr("href").replace(/\?.*$/, "");

        // Determine file extension
        var ext = filename.split(".").pop().toLowerCase();
        var iconName = filename.endsWith("/")
            ? "bi bi-folder-fill"
            : iconMap[ext] || "bi bi-file-earmark";

        icon.append($('<i class="' + iconName + '" aria-hidden="true"></i>'));

        $(this).prepend(icon);

        $("td:gt(1)", this).addClass(["col-auto", "d-none", "d-md-table-cell"]);
        $("td:eq(1)", this).addClass(["col"]);
    });
}

$(function () {
    try {
        if (!hasHTML) {
            replaceBreadcrumbs();
            fixTable();
            showReadme();
        }
    } finally {
        $("#mainContent").show();
    }
});
