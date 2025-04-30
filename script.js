const default_size = 2000;
const url_placeholder = "Paste your link here";
const logo_text_placeholder = "Scan Me!";
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
    input_margin: {
        defaultValue: "3",
    },
    input_logo_margin: {
        defaultValue: "2",
    },
    input_error_correction: {
        defaultValue: "Q",
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
    const logoType = document.querySelector('input[name="input_logo_type"]:checked').value;
    let logoText = document.getElementById("input_logo_text").value;
    let logoImage = document.getElementById("input_logo_image").files[0];
    const shape = document.querySelector('input[name="input_shape"]:checked').value;
    const dotStyle = document.querySelector('input[name="input_dot_style"]:checked').value;
    const cornerSquareStyle = document.querySelector('input[name="input_corner_square_shape"]:checked').value;
    const cornerDotStyle = document.querySelector('input[name="input_corner_dot_shape"]:checked').value;
    const margin = parseInt(document.querySelector('input[name="input_margin"]:checked').value);
    const imageMargin = parseInt(document.querySelector('input[name="input_logo_margin"]:checked').value);
    const errorCorrectionLevel = document.querySelector('input[name="input_error_correction"]:checked').value;

    if (!url) url = url_placeholder;

    let logo = null;

    switch (logoType) {
        case "image":
            logo = logoImage ? getLogoImage(logoImage) : logo_image_placeholder;
            break;

        case "text":
            logo = getTextLogoImage(logoText || logo_text_placeholder);
            break;

        default:
            break;
    }

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
        image: logo,
        imageOptions: {
            margin: (imageMargin / 100) * default_size,
            imageSize: 0.5,
        },
        qrOptions: {
            errorCorrectionLevel: errorCorrectionLevel,
        },
    });
}

function getTextLogoImage(text) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const fontSize = 200;

    ctx.font = `${fontSize}px Quicksand`;

    // Split text into lines based on the new line character
    const lines = text.split("\n");
    const lineHeight = fontSize * 1.2; // Line spacing
    const maxLineWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));

    const textHeight = lineHeight * lines.length; // Total height for all lines

    // Create SVG with the calculated size
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", maxLineWidth + 10); // Add padding
    svg.setAttribute("height", textHeight + 10); // Add padding
    svg.setAttribute("viewBox", `0 0 ${maxLineWidth + 10} ${textHeight + 10}`);

    // Calculate starting Y position to center the text vertically
    const startY = (textHeight + 10) / 2 - textHeight / 2;

    // Create text elements for each line
    lines.forEach((line, index) => {
        const textElem = document.createElementNS(svgNS, "text");
        textElem.setAttribute("x", "50%");
        textElem.setAttribute("y", startY + lineHeight * index + fontSize); // Adjust vertical positioning
        textElem.setAttribute("font-family", "Quicksand");
        textElem.setAttribute("text-anchor", "middle");
        textElem.setAttribute("font-size", fontSize);
        textElem.setAttribute("font-weight", "600");
        textElem.setAttribute("fill", "#000");
        textElem.textContent = line;

        // Append text element to SVG
        svg.appendChild(textElem);
    });

    return "data:image/svg+xml;base64," + btoa(new XMLSerializer().serializeToString(svg));
}

function getLogoImage(url) {
    return URL.createObjectURL(url);
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

function setupFileInputs() {
    document.querySelectorAll('input[type="file"]').forEach((el) => el.addEventListener("change", updateQR));
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
    const logoType = radioConfig.input_logo_type.defaultValue;
    const logoText = textareaConfig.input_logo_text.defaultValue || logo_text_placeholder;
    const logoImage = logo_image_placeholder;
    const shape = radioConfig.input_shape.defaultValue;
    const dotStyle = radioConfig.input_dot_style.defaultValue;
    const cornerSquareStyle = radioConfig.input_corner_square_shape.defaultValue;
    const cornerDotStyle = radioConfig.input_corner_dot_shape.defaultValue;
    const margin = radioConfig.input_margin.defaultValue;
    const imageMargin = radioConfig.input_logo_margin.defaultValue;
    const errorCorrectionLevel = radioConfig.input_error_correction.defaultValue;

    return {
        url,
        logoType,
        logoText,
        logoImage,
        shape,
        dotStyle,
        cornerSquareStyle,
        cornerDotStyle,
        margin,
        imageMargin,
        errorCorrectionLevel,
    };
}

function initQRCode() {
    const {
        url,
        logoType,
        logoText,
        logoImage,
        shape,
        dotStyle,
        cornerSquareStyle,
        cornerDotStyle,
        margin,
        imageMargin,
        errorCorrectionLevel,
    } = getInitialValues();

    let logo = null;

    if (logoType) {
        logo = logoType === "image" ? logoImage : getTextLogoImage(logoText);
    }

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
        image: logo,
        imageOptions: {
            margin: (imageMargin / 100) * default_size,
            imageSize: 0.5,
        },
        qrOptions: {
            errorCorrectionLevel: errorCorrectionLevel,
        },
    });

    qrCode.append(document.getElementById("qrcode"));
}

function initApp() {
    setupTextInputs(textConfig);
    setupTextareaInputs(textareaConfig);
    setupRadioInputs(radioConfig);
    setupFileInputs();
    setupAdvancedParamsCollapse();
    initQRCode();
}

window.addEventListener("DOMContentLoaded", initApp);
