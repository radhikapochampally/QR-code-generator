(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const state = {
    mode: "text",
    qr: null,
    payload: "",
    logoDataUrl: null,
  };

  const panes = {
    text: $("pane-text"),
    link: $("pane-link"),
    image: $("pane-image"),
    wifi: $("pane-wifi"),
    email: $("pane-email"),
    sms: $("pane-sms"),
    custom: $("pane-custom"),
  };

  const els = {
    modeSelector: $("modeSelector"),
    modeBadge: $("modeBadge"),

    textPayload: $("textPayload"),
    linkInput: $("linkInput"),
    imageFile: $("imageFile"),
    imageUrl: $("imageUrl"),
    wifiPayload: $("wifiPayload"),
    emailTo: $("emailTo"),
    emailSubject: $("emailSubject"),
    emailBody: $("emailBody"),
    smsNumber: $("smsNumber"),
    smsMessage: $("smsMessage"),
    customPayload: $("customPayload"),

    dotShape: $("dotShape"),
    cornerShape: $("cornerShape"),
    dotColor: $("dotColor"),
    bgColor: $("bgColor"),
    qrSize: $("qrSize"),
    qrSizeValue: $("qrSizeValue"),
    tiltX: $("tiltX"),
    tiltXValue: $("tiltXValue"),
    tiltY: $("tiltY"),
    tiltYValue: $("tiltYValue"),
    shadowDepth: $("shadowDepth"),
    shadowDepthValue: $("shadowDepthValue"),

    logoUpload: $("logoUpload"),
    logoSize: $("logoSize"),
    logoSizeValue: $("logoSizeValue"),
    logoRadius: $("logoRadius"),
    logoRadiusValue: $("logoRadiusValue"),
    logoMargin: $("logoMargin"),
    logoMarginValue: $("logoMarginValue"),
    logoOpacity: $("logoOpacity"),
    logoOpacityValue: $("logoOpacityValue"),
    hideDots: $("hideDots"),
    clearLogoBtn: $("clearLogoBtn"),

    qrcodeContainer: $("qrcode"),
    qrShell: $("qrShell"),
    downloadHint: $("downloadHint"),
    customizationArea: $("customizationArea"),
    charCount: $("charCount"),
    renderSize: $("renderSize"),
    logoState: $("logoState"),

    generateBtn: $("generateBtn"),
    regenBtn: $("regenBtn"),
    clearBtn: $("clearBtn"),
    downloadBtn: $("downloadBtn"),
    copyPayloadBtn: $("copyPayloadBtn"),
  };

  function buildImageOptions() {
    const sizeCoeff = Math.min(Number(els.logoSize.value) / 100, 0.45); // safer max [web:58][web:128]
    const margin = Number(els.logoMargin.value) || 0;
    const radius = Number(els.logoRadius.value) || 0;
    const hideBackgroundDots = els.hideDots.value === "true";

    return {
      crossOrigin: "anonymous",
      margin,
      imageSize: sizeCoeff,
      borderRadius: radius,
      hideBackgroundDots,
    };
  }

  function createQrInstance() {
    if (!window.QRCodeStyling || !els.qrcodeContainer) return;

    const size = Number(els.qrSize.value) || 300;

    state.qr = new QRCodeStyling({
      width: size,
      height: size,
      data: "QR Studio",
      type: "canvas",
      image: null,
      dotsOptions: {
        color: els.dotColor.value || "#111827",
        type: els.dotShape.value || "square",
      },
      cornersSquareOptions: {
        type: els.cornerShape.value || "square",
        color: els.dotColor.value || "#111827",
      },
      backgroundOptions: {
        color: els.bgColor.value || "#f9fafb",
      },
      imageOptions: buildImageOptions(),
    });

    state.qr.append(els.qrcodeContainer);
  }

  function switchMode(mode) {
    state.mode = mode;

    els.modeSelector.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });

    els.modeBadge.textContent =
      mode.charAt(0).toUpperCase() + mode.slice(1) + " mode";

    Object.values(panes).forEach((p) => p.classList.remove("active"));
    panes[mode].classList.add("active");
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  async function buildPayload() {
    const m = state.mode;

    if (m === "text") {
      const v = els.textPayload.value.trim();
      return v || "QR Studio text example";
    }

    if (m === "link") {
      const raw = els.linkInput.value.trim();
      if (!raw) return "https://perplexity.ai";
      return /^https?:\/\//i.test(raw) ? raw : "https://" + raw;
    }

    if (m === "image") {
      if (els.imageFile.files[0]) {
        return await readFileAsDataURL(els.imageFile.files[0]);
      }
      const url = els.imageUrl.value.trim();
      return url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&q=75";
    }

    if (m === "wifi") {
      const v = els.wifiPayload.value.trim();
      return v || "WIFI:T:WPA;S:SmartHire;P:smarthire@2026;H:false;;";
    }

    if (m === "email") {
      const to = els.emailTo.value.trim() || "hello@example.com";
      const subject = encodeURIComponent(els.emailSubject.value.trim() || "QR Studio");
      const body = encodeURIComponent(els.emailBody.value.trim() || "Sent from QR Studio");
      return `mailto:${to}?subject=${subject}&body=${body}`;
    }

    if (m === "sms") {
      const num = els.smsNumber.value.trim() || "+919876543210";
      const msg = encodeURIComponent(els.smsMessage.value.trim() || "Hi from QR Studio");
      return `SMSTO:${num}:${msg}`;
    }

    if (m === "custom") {
      const v = els.customPayload.value.trim();
      return v || "otpauth://totp/Example:demo@example.com?secret=ABCDEF123456&issuer=Example";
    }

    return "QR Studio";
  }

  function applyStyling() {
    if (!state.qr) return;

    const size = Number(els.qrSize.value) || 300;

    state.qr.update({
      width: size,
      height: size,
      dotsOptions: {
        color: els.dotColor.value || "#111827",
        type: els.dotShape.value || "square",
      },
      cornersSquareOptions: {
        type: els.cornerShape.value || "square",
        color: els.dotColor.value || "#111827",
      },
      backgroundOptions: {
        color: els.bgColor.value || "#f9fafb",
      },
      image: state.logoDataUrl || null,
      imageOptions: buildImageOptions(),
    });

    els.qrShell.style.setProperty("--tilt-x", `${els.tiltX.value}deg`);
    els.qrShell.style.setProperty("--tilt-y", `${els.tiltY.value}deg`);
    els.qrShell.style.boxShadow = `0 ${els.shadowDepth.value}px ${
      Number(els.shadowDepth.value) * 2
    }px rgba(15,23,42,0.95)`;

    els.qrSizeValue.textContent = size;
    els.tiltXValue.textContent = els.tiltX.value;
    els.tiltYValue.textContent = els.tiltY.value;
    els.shadowDepthValue.textContent = els.shadowDepth.value;
    els.logoSizeValue.textContent = els.logoSize.value;
    els.logoRadiusValue.textContent = els.logoRadius.value;
    els.logoMarginValue.textContent = els.logoMargin.value;
    els.logoOpacityValue.textContent = els.logoOpacity.value;
  }

  function randomizeStyle() {
    const dotTypes = ["square", "dots", "rounded", "extra-rounded"];
    const cornerTypes = ["square", "dot", "extra-rounded"];
    const random = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    els.dotShape.value =
      dotTypes[Math.floor(Math.random() * dotTypes.length)];
    els.cornerShape.value =
      cornerTypes[Math.floor(Math.random() * cornerTypes.length)];

    const colors = ["#22c55e", "#4ade80", "#38bdf8", "#a855f7", "#f97316"];
    els.dotColor.value = colors[Math.floor(Math.random() * colors.length)];

    els.qrSize.value = random(260, 340);
    els.tiltX.value = random(-10, 10);
    els.tiltY.value = random(-10, 10);
    els.shadowDepth.value = random(18, 32);

    els.logoSize.value = random(18, 30);
    els.logoRadius.value = random(4, 16);
    els.logoMargin.value = random(2, 10);
    els.logoOpacity.value = random(70, 100);
  }

  async function generateQR(reusePayload = false) {
    if (!state.qr) createQrInstance();
    if (!state.qr) return;

    let data = state.payload;
    if (!reusePayload) {
      data = await buildPayload();
      state.payload = data;
    }

    state.qr.update({ data });
    applyStyling();

    els.customizationArea.classList.remove("hidden");
    els.downloadHint.textContent = reusePayload
      ? "New styling applied. Download or tweak further."
      : "Tweak styling and export your QR.";
    els.charCount.textContent = `${data.length} chars`;
    els.renderSize.textContent = `${els.qrSize.value}px`;
    els.logoState.textContent = state.logoDataUrl ? "Custom logo" : "No logo";
  }

  async function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) {
      state.logoDataUrl = null;
      els.logoState.textContent = "No logo";
      applyStyling();
      return;
    }
    try {
      state.logoDataUrl = await readFileAsDataURL(file);
      els.logoState.textContent = "Custom logo";
      applyStyling();
    } catch {
      state.logoDataUrl = null;
      els.logoState.textContent = "Logo failed";
    }
  }

  function clearLogo() {
    state.logoDataUrl = null;
    els.logoUpload.value = "";
    els.logoState.textContent = "No logo";
    applyStyling();
  }

  async function downloadQR() {
    if (!state.qr) return;
    const blob = await state.qr.getRawData("png"); // [web:58][web:128]
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-studio-${state.mode}-${Date.now()}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 800);
  }

  async function copyPayload() {
    if (!state.payload || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(state.payload);
      els.copyPayloadBtn.textContent = "Copied";
      setTimeout(() => (els.copyPayloadBtn.textContent = "Copy payload"), 900);
    } catch {
      els.copyPayloadBtn.textContent = "Copy failed";
      setTimeout(() => (els.copyPayloadBtn.textContent = "Copy payload"), 900);
    }
  }

  function clearAll() {
    state.payload = "";
    state.logoDataUrl = null;
    state.qr = null;

    els.qrcodeContainer.innerHTML = "";

    [
      els.textPayload,
      els.linkInput,
      els.imageUrl,
      els.wifiPayload,
      els.emailTo,
      els.emailSubject,
      els.emailBody,
      els.smsNumber,
      els.smsMessage,
      els.customPayload,
    ].forEach((el) => {
      if (el) el.value = "";
    });

    if (els.imageFile) els.imageFile.value = "";
    els.logoUpload.value = "";

    els.customizationArea.classList.add("hidden");
    els.downloadHint.textContent =
      'Enter payload and click “Generate QR” to render it here.';
    els.charCount.textContent = "0 chars";
    els.renderSize.textContent = "—";
    els.logoState.textContent = "No logo";
  }

  function wireBgShapeToggle() {
    const wrapper = document.querySelector(".bg-shape-selector");
    if (!wrapper) return;
    const buttons = wrapper.querySelectorAll(".bg-shape-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const shape = btn.dataset.shape;
        if (!shape || shape === "none") {
          els.qrShell.removeAttribute("data-bgshape");
        } else {
          els.qrShell.setAttribute("data-bgshape", shape);
        }
      });
    });
  }

  function wireEvents() {
    els.modeSelector.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-mode]");
      if (!btn) return;
      switchMode(btn.dataset.mode);
    });

    els.generateBtn.addEventListener("click", () => generateQR(false));
    els.regenBtn.addEventListener("click", () => {
      if (!state.payload) {
        generateQR(false);
      } else {
        randomizeStyle();
        generateQR(true);
      }
    });
    els.clearBtn.addEventListener("click", clearAll);
    els.logoUpload.addEventListener("change", handleLogoUpload);
    els.clearLogoBtn.addEventListener("click", clearLogo);
    els.downloadBtn.addEventListener("click", downloadQR);
    els.copyPayloadBtn.addEventListener("click", copyPayload);

    [
      "dotShape",
      "cornerShape",
      "dotColor",
      "bgColor",
      "qrSize",
      "tiltX",
      "tiltY",
      "shadowDepth",
      "logoSize",
      "logoRadius",
      "logoMargin",
      "logoOpacity",
      "hideDots",
    ].forEach((id) => {
      const el = els[id];
      const evt =
        id === "dotShape" || id === "cornerShape" || id === "hideDots"
          ? "change"
          : "input";
      el.addEventListener(evt, () => {
        if (!state.qr) return;
        applyStyling();
      });
    });
  }

  function init() {
    Object.values(panes).forEach((p) => p.classList.remove("active"));
    panes.text.classList.add("active");
    els.customizationArea.classList.add("hidden");
    wireEvents();
    wireBgShapeToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();