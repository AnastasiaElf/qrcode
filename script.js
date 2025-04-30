const default_size = 2000;
const url_placeholder = "Paste your link here";
const logo_text_placeholder = '"Scan Me!"';
const logo_image_placeholder = "images/logo_placeholder.webp";

const textConfig = {
    input_url: {
        defaultValue: "",
        placeholder: url_placeholder,
    },
};

const textareaConfig = {
    input_logo_text: {
        defaultValue: "",
        placeholder: logo_text_placeholder,
    },
};

const radioConfig = {
    input_shape: {
        defaultValue: "square",
    },
    input_dot_style: {
        defaultValue: "rounded",
    },
    input_corner_square_shape: {
        defaultValue: "rounded",
    },
    input_corner_dot_shape: {
        defaultValue: "rounded",
    },
    input_logo_type: {
        defaultValue: "text",
        onSetup: setupLogoTypeInputs,
        onChange: handleLogoTypeChange,
    },
};

const numberConfig = {
    input_margin: {
        defaultValue: 3,
        step: 1,
        min: 0,
        max: 10,
        placeholder: "No margin",
    },
    input_logo_margin: {
        defaultValue: 2,
        step: 1,
        min: 0,
        max: 5,
        placeholder: "No margin",
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
    let margin = parseInt(document.getElementById("input_margin").value);
    let imageMargin = parseInt(document.getElementById("input_logo_margin").value);

    if (!url) url = url_placeholder;
    if (!logo_text) logo_text = logo_text_placeholder;
    if (!margin) margin = 0;
    if (!imageMargin) imageMargin = 0;

    qrCode.update({
        data: url,
        shape: shape,
        margin: (margin / 100) * default_size,
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
            margin: (imageMargin / 100) * default_size,
            imageSize: 0.5,
        },
    });
}

function updateLogoInputVisibility(selected) {
    const textInput = document.getElementById("input_logo_text");
    const imageInput = document.getElementById("input_logo_image");

    switch (selected) {
        case "no_logo":
            textInput.style.display = "none";
            imageInput.style.display = "none";
            break;
        case "text":
            textInput.style.display = "block";
            imageInput.style.display = "none";
            break;
        case "image":
            textInput.style.display = "none";
            imageInput.style.display = "block";
            break;
        default:
            break;
    }
}

function handleLogoTypeChange() {
    const selected = document.querySelector('input[name="input_logo_type"]:checked').value;
    updateLogoInputVisibility(selected);
    updateQR();
}

function setupLogoTypeInputs() {
    updateLogoInputVisibility(radioConfig.input_logo_type.defaultValue);
}

function setupTextInputs(config) {
    for (const key in config) {
        const elem = document.getElementById(key);
        if (!elem) continue;

        const params = config[key];
        if (params.placeholder) elem.placeholder = params.placeholder;
        elem.value = params.defaultValue;
        elem.oninput = config.onChange || updateQR;
        if (params.onSetup) onSetup(params);
    }
}

function setupTextareaInputs(config) {
    for (const key in config) {
        const elem = document.getElementById(key);
        if (!elem) continue;

        const params = config[key];
        if (params.placeholder) elem.placeholder = params.placeholder;
        elem.value = params.defaultValue;
        elem.oninput = config.onChange || updateQR;
        if (params.onSetup) onSetup(params);
    }
}

function setupRadioInputs(config) {
    for (const key in config) {
        const radios = document.querySelectorAll(`input[name="${key}"]`);
        const params = config[key];
        radios.forEach((radio) => {
            if (radio.value === params.defaultValue) {
                radio.checked = true;
            }
            radio.onchange = params.onChange || updateQR;
        });
        if (params.onSetup) params.onSetup();
    }
}

function setupNumberInputs(config) {
    for (const key in config) {
        const elem = document.getElementById(key);
        if (!elem || elem.type !== "number") continue;

        const params = config[key];
        if ("min" in params) elem.min = params.min;
        if ("max" in params) elem.max = params.max;
        if ("step" in params) elem.step = params.step;
        if ("placeholder" in params) elem.placeholder = params.placeholder;
        if ("defaultValue" in params) elem.value = params.defaultValue;

        elem.oninput =
            config.onChange ||
            (() => {
                let value = parseInt(elem.value);
                if (value && (value < params.min || value > params.max)) {
                    // TODO: error message
                } else {
                    updateQR();
                }
            });
        if (params.onSetup) params.onSetup(elem, params);
    }
}

function setupAdvancedParamsCollapse() {
    document.querySelector(".advanced-params-toggle").addEventListener("click", (e) => {
        e.target.classList.toggle("active");
        const content = e.target.nextElementSibling;
        content.style.maxHeight = content.style.maxHeight ? "" : content.scrollHeight + "px";
    });
}

function getInitialValues() {
    const url = textConfig.input_url.defaultValue || url_placeholder;
    const logo_text = textareaConfig.input_logo_text.defaultValue || logo_text_placeholder;
    const shape = radioConfig.input_shape.defaultValue;
    const dotStyle = radioConfig.input_dot_style.defaultValue;
    const cornerSquareStyle = radioConfig.input_corner_square_shape.defaultValue;
    const cornerDotStyle = radioConfig.input_corner_dot_shape.defaultValue;
    const margin = numberConfig.input_margin.defaultValue;
    const imageMargin = numberConfig.input_logo_margin.defaultValue;

    return { url, logo_text, shape, dotStyle, cornerSquareStyle, cornerDotStyle, margin, imageMargin };
}

function initQRCode() {
    const { url, logo_text, shape, dotStyle, cornerSquareStyle, cornerDotStyle, margin, imageMargin } =
        getInitialValues();

    qrCode = new QRCodeStyling({
        width: default_size,
        height: default_size,
        type: "svg",
        data: url,
        shape: shape,
        margin: (margin / 100) * default_size,
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
        image: logo_image_placeholder,
        imageOptions: {
            margin: (imageMargin / 100) * default_size,
            imageSize: 0.5,
        },
    });

    qrCode.append(document.getElementById("qrcode"));
}

function initApp() {
    setupTextInputs(textConfig);
    setupTextareaInputs(textareaConfig);
    setupRadioInputs(radioConfig);
    setupNumberInputs(numberConfig);
    setupAdvancedParamsCollapse();
    initQRCode();
}

window.addEventListener("DOMContentLoaded", initApp);
