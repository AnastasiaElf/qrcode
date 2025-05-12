const url_placeholder = "Paste your link here";
const logo_text_placeholder = "Scan Me!";
const logo_image_placeholder = "./images/logo_placeholder.png";
const margin_step = 5;
const logo_margin_step = 2;
const stroke_step = 0.5;
const imageSize = 0.4;

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
        defaultValue: "",
        onSetup: setupLogoTypeInputs,
        onChange: handleLogoTypeChange,
    },
    input_margin: {
        defaultValue: "2",
    },
    input_logo_margin: {
        defaultValue: "1",
    },
    input_error_correction: {
        defaultValue: "Q",
    },
    input_scale: {
        defaultValue: "1",
    },
};

let qrCode;

function getUrlValue() {
    return document.getElementById("input_url").value;
}

function getLogoTypeValue() {
    return document.querySelector('input[name="input_logo_type"]:checked').value;
}

function getLogoTextValue() {
    return document.getElementById("input_logo_text").value;
}

function getLogoImageValue() {
    return document.getElementById("input_logo_image").files[0];
}

function getShapeValue() {
    return document.querySelector('input[name="input_shape"]:checked').value;
}

function getDotStyleValue() {
    return document.querySelector('input[name="input_dot_style"]:checked').value;
}

function getCornerSquareStyleValue() {
    return document.querySelector('input[name="input_corner_square_shape"]:checked').value;
}

function getCornerDotStyleValue() {
    return document.querySelector('input[name="input_corner_dot_shape"]:checked').value;
}

function getMarginValue() {
    return parseInt(document.querySelector('input[name="input_margin"]:checked').value);
}

function getImageMarginValue() {
    return parseInt(document.querySelector('input[name="input_logo_margin"]:checked').value);
}

function getErrorCorrectionLevelValue() {
    return document.querySelector('input[name="input_error_correction"]:checked').value;
}

function getScaleValue() {
    return parseInt(document.querySelector('input[name="input_scale"]:checked').value);
}

function getInputLogoTypeValue() {
    return document.querySelector('input[name="input_logo_type"]:checked').value;
}

function downloadQR(extension) {
    if (!qrCode) return;

    qrCode.download({
        name: `${new Date().toISOString().split("T")[0]}_qrcode.anastasiaelf.com`,
        extension: extension,
    });
}

function updateQR() {
    let url = getUrlValue();
    const logoType = getLogoTypeValue();
    let logoText = getLogoTextValue();
    let logoImage = getLogoImageValue();
    const shape = getShapeValue();
    const dotStyle = getDotStyleValue();
    const cornerSquareStyle = getCornerSquareStyleValue();
    const cornerDotStyle = getCornerDotStyleValue();
    const margin = getMarginValue();
    const imageMargin = getImageMarginValue();
    const errorCorrectionLevel = getErrorCorrectionLevelValue();
    const scale = getScaleValue();

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
        margin: margin * margin_step,
        scale: scale,
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
            margin: imageMargin * logo_margin_step,
            imageSize: imageSize,
        },
        qrOptions: {
            errorCorrectionLevel: errorCorrectionLevel,
        },
    });

    updateSizeNumber();
    updateSVGStroke();
}

function updateSizeNumber() {
    const sizeElem = document.getElementById("qr_size");
    sizeElem.innerHTML = qrCode._size;
}

function getTextLogoImage(text) {
    const fontSize = 200;
    const lineHeight = fontSize * 1.2;
    const padding = 10;
    const fontFamily = "Quicksand";
    const fontWeight = "600";
    const fillColor = "#000000";

    const lines = text.split("\n");

    // Measure max line width using temp canvas
    const measureCanvas = document.createElement("canvas");
    const measureCtx = measureCanvas.getContext("2d");
    measureCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const maxLineWidth = Math.max(...lines.map((line) => measureCtx.measureText(line).width));

    const textHeight = lines.length * lineHeight;
    const canvasWidth = maxLineWidth + padding * 2;
    const canvasHeight = textHeight + padding * 2;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = fillColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const centerX = canvasWidth / 2;

    const blockStartY = (canvasHeight - textHeight) / 2;

    lines.forEach((line, index) => {
        const y = blockStartY + index * lineHeight + lineHeight / 2;
        ctx.fillText(line, centerX, y);
    });

    return canvas.toDataURL("image/png");
}

function getLogoImage(url) {
    return URL.createObjectURL(url);
}

function updateLogoInputVisibility(selected) {
    const textInput = document.getElementById("input_logo_text");
    const imageInput = document.getElementById("input_logo_image");

    switch (selected) {
        case "text":
            textInput.style.display = "block";
            imageInput.style.display = "none";
            break;
        case "image":
            textInput.style.display = "none";
            imageInput.style.display = "block";
            break;
        default:
            textInput.style.display = "none";
            imageInput.style.display = "none";
            break;
    }
}

function handleLogoTypeChange() {
    const selected = getInputLogoTypeValue();
    updateLogoInputVisibility(selected);
    updateQR();
}

function updateSVGStroke() {
    const scale = getScaleValue();
    document.documentElement.style.setProperty("--elf-svg-stroke-width", `${stroke_step * scale}px`);
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
        if (params.onSetup) params.onSetup(params);
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
        if (params.onSetup) params.onSetup(params);
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
    const scale = radioConfig.input_scale.defaultValue;

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
        scale,
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
        scale,
    } = getInitialValues();

    let logo = null;

    if (logoType) {
        logo = logoType === "image" ? logoImage : getTextLogoImage(logoText);
    }

    qrCode = new QRCodeStyling({
        type: "svg",
        data: url,
        shape: shape,
        margin: margin * margin_step,
        scale: scale,
        strokeWidth: 0.5,
        mergePaths: false,
        backgroundOptions: {
            color: null,
        },
        dotsOptions: {
            type: dotStyle,
            roundSize: true,
        },
        cornersSquareOptions: {
            type: cornerSquareStyle,
        },
        cornersDotOptions: {
            type: cornerDotStyle,
        },
        image: logo,
        imageOptions: {
            margin: imageMargin * logo_margin_step,
            imageSize: imageSize,
        },
        qrOptions: {
            errorCorrectionLevel: errorCorrectionLevel,
        },
        emptyPixelsColor: "#ffffff",
    });

    qrCode.append(document.getElementById("qrcode"));

    updateSizeNumber();
    updateSVGStroke();
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
