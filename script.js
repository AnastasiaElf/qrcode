const default_size = 2000;
const default_margin_percent = 3;
const default_logo_margin_percent = 2;
const url_placeholder = "Paste your link here";
const logo_text_placeholder = '"Scan Me!"';
const logo_image_placeholder = "images/logo_placeholder.webp";

const textConfig = {
    input_url: {
        default: "",
        placeholder: url_placeholder,
    },
};

const textareaConfig = {
    input_logo_text: {
        default: "",
        placeholder: logo_text_placeholder,
    },
};

const radioConfig = {
    input_shape: {
        default: "square",
    },
    input_dot_style: {
        default: "rounded",
    },
    input_corner_square_shape: {
        default: "rounded",
    },
    input_corner_dot_shape: {
        default: "rounded",
    },
};

let qrCode;

function downloadQR(extension) {
    if (!qrCode) return;

    qrCode.download({
        name: `${new Date().toISOString().split("T")[0]}_qrcode.anastasiaelf.com`,
        extension: extension,
    });
}

function updateQR() {
    let url = document.getElementById("input_url").value;
    let logo_text = document.getElementById("input_logo_text").value;
    const shape = document.querySelector('input[name="input_shape"]:checked').value;
    const dotStyle = document.querySelector('input[name="input_dot_style"]:checked').value;
    const cornerSquareStyle = document.querySelector('input[name="input_corner_square_shape"]:checked').value;
    const cornerDotStyle = document.querySelector('input[name="input_corner_dot_shape"]:checked').value;

    if (!url) url = url_placeholder;
    if (!logo_text) logo_text = logo_text_placeholder;

    qrCode.update({
        data: url,
        shape: shape,
        dotsOptions: {
            type: dotStyle,
        },
        cornersSquareOptions: {
            type: cornerSquareStyle,
        },
        cornersDotOptions: {
            type: cornerDotStyle,
        },
    });
}

function setupTextInputs(config) {
    for (const key in config) {
        const elem = document.getElementById(key);
        if (!elem) continue;

        const params = config[key];
        if (params.placeholder) elem.placeholder = params.placeholder;
        elem.value = params.default;
        elem.oninput = updateQR;
    }
}

function setupTextareaInputs(config) {
    for (const key in config) {
        const elem = document.getElementById(key);
        if (!elem) continue;

        const params = config[key];
        if (params.placeholder) elem.placeholder = params.placeholder;
        elem.value = params.default;
        elem.oninput = updateQR;
    }
}

function setupRadioInputs(config) {
    for (const key in config) {
        const radios = document.querySelectorAll(`input[name="${key}"]`);
        radios.forEach((radio) => {
            if (radio.value === config[key].default) {
                radio.checked = true;
            }
            radio.onchange = updateQR;
        });
    }
}

function getInitialValues() {
    const url = textConfig.input_url.default || url_placeholder;
    const logo_text = textareaConfig.input_logo_text.default || logo_text_placeholder;
    const shape = radioConfig.input_shape.default;
    const dotStyle = radioConfig.input_dot_style.default;
    const cornerSquareStyle = radioConfig.input_corner_square_shape.default;
    const cornerDotStyle = radioConfig.input_corner_dot_shape.default;

    return { url, logo_text, shape, dotStyle, cornerSquareStyle, cornerDotStyle };
}

function initQRCode() {
    const { url, logo_text, shape, dotStyle, cornerSquareStyle, cornerDotStyle } = getInitialValues();

    qrCode = new QRCodeStyling({
        width: default_size,
        height: default_size,
        type: "svg",
        data: url,
        shape: shape,
        image: logo_image_placeholder,
        margin: (default_margin_percent / 100) * default_size,
        backgroundOptions: {
            color: null,
        },
        dotsOptions: {
            type: dotStyle,
        },
        cornersSquareOptions: {
            type: cornerSquareStyle,
        },
        cornersDotOptions: {
            type: cornerDotStyle,
        },
        imageOptions: {
            margin: (default_logo_margin_percent / 100) * default_size,
            imageSize: 0.5,
        },
    });

    qrCode.append(document.getElementById("qrcode"));
}

function initApp() {
    setupTextInputs(textConfig);
    setupTextareaInputs(textareaConfig);
    setupRadioInputs(radioConfig);
    initQRCode();
}

window.addEventListener("DOMContentLoaded", initApp);
