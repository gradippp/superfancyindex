var content = $("body > div.container > div > div");
var table = $("table", content);
var hasHTML = false;

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
    var h1 = document.querySelector("h1");
    if (h1 && h1.textContent.trim() === window.location.pathname) {
        h1.remove();
    }

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
        "table-light",
        "table-sm",
        "table-hover",
        "text-nowrap",
        "table-striped",
        "table-borderless",
    ]);

    var header = $("tr", table)[0];
    header.remove();
    var thead = $("<thead>");
    thead.addClass(["thead-dark", "table-dark"]);
    thead.append(header);
    table.prepend(thead);
    $(header).prepend($('<th class="col-auto"></th>'));
    $("th:gt(1)", header).addClass(["col-auto", "d-none", "d-md-table-cell"]);

    $('a[href^="../"]', table).closest("tr").remove();

    $("tbody tr", table).each(function () {
        var icon = $("<td></td>");
        icon.addClass(["col-auto"]);
        var filename = $("td:first a", this).attr("href").replace(/\?.*$/, "");

        var iconName = filename.endsWith("/")
            ? "bi bi-folder-fill"
            : "bi bi-file-earmark-text";

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
