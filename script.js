const default_size = 2000;
const default_margin_percent = 3;
const default_logo_margin_percent = 2;
const url_placeholder = "Paste your link here";
const logo_text_placeholder = "Scan Me!";
const logo_image_placeholder = "images/logo_placeholder.webp";

let qrCode;

function downloadQR(extension) {
    if (!qrCode) return;

    qrCode.download({
        name: `${new Date().toISOString().split("T")[0]}_qrcode.anastasiaelf.com`,
        extension: extension,
    });
}

function initApp() {
    qrCode = new QRCodeStyling({
        width: default_size,
        height: default_size,
        type: "canvas",
        data: url_placeholder,
        image: logo_image_placeholder,
        margin: (default_margin_percent / 100) * default_size,
        backgroundOptions: {
            color: null,
        },
        dotsOptions: {
            type: "rounded",
        },
        imageOptions: {
            margin: (default_logo_margin_percent / 100) * default_size,
            imageSize: 0.5,
        },
    });

    qrCode.append(document.getElementById("qrcode"));
}

window.addEventListener("DOMContentLoaded", initApp);
