"use strict";
const $ = (selector) => document.querySelector(selector);
const dialog = $("#work-dialog");
const dialogBody = $("#dialog-body");
let lastTrigger = null;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function picture(src, alt, lazy = true) {
  const img = element("img");
  img.src = src;
  img.alt = alt;
  if (lazy) img.loading = "lazy";
  return img;
}
function showDialog(title, trigger) {
  lastTrigger = trigger;
  $("#dialog-title").textContent = title;
  dialog.showModal();
  document.body.classList.add("modal-open");
  dialog.scrollTop = 0;
}
function safeLink(value) {
  try {
    const parsed = new URL(value, document.baseURI);
    if (parsed.protocol === "file:" && /^page-on-site\/[a-zA-Z0-9/_-]+\.html$/.test(value)) return parsed.href;
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : null;
  } catch { return null; }
}
function openWork(work, trigger, isReel = false) {
  dialogBody.replaceChildren();
  if (isReel && work.video) {
    const video = element("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = work.video;
    video.poster = work.image;
    video.append(element("p", "", "동영상을 재생할 수 없습니다."));
    dialogBody.append(video);
  } else {
    const images = work.images?.length ? work.images : [work.image].filter(Boolean);
    images.forEach((src, i) => dialogBody.append(picture(src, `${work.title} ${i + 1}`, false)));
    if (isReel) dialogBody.append(element("p", "contact-note", "영상이 아직 등록되지 않았습니다."));
  }
  dialogBody.append(element("p", "", work.description));
  const url = work.url && safeLink(work.url);
  if (url) {
    const link = element("a", "project-link", "프로젝트 보기");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    dialogBody.append(link);
  }
  showDialog(work.title, trigger);
}

portfolioContent.skills.forEach((skill) => {
  const li = element("li");
  li.append(picture(skill.image, ""), element("span", "", skill.name));
  $("#skill-list").append(li);
});
function renderWorks(selector, works, type) {
  works.forEach((work, index) => {
    const directUrl = work.directLink && work.url ? safeLink(work.url) : null;
    const button = element(directUrl ? "a" : "button", `${type}-card`);
    if (directUrl) {
      button.classList.add("is-site-link");
      button.href = directUrl;
      button.target = "_blank";
      button.rel = "noopener noreferrer";
    } else button.type = "button";
    button.setAttribute("aria-label", `${work.title} ${type === "reel" ? "영상" : "상세"} 보기`);
    if (directUrl) button.setAttribute("aria-label", `${work.title} · 페이지 온 웹사이트 새 탭으로 열기`);
    else button.setAttribute("aria-haspopup", "dialog");
    if (type === "project") {
      // 브랜딩 이미지와 독립된 흰색 박스: 파일을 교체해도 크기와 그림자를 유지합니다.
      const box = element("span", "project-image-box");
      if (work.image || work.coverVideo) {
        box.classList.add("has-cover");
        const viewport = element("span", "project-image-viewport");
        if (work.coverVideo) {
          const cover = element("video", "project-cover-video");
          cover.muted = true;
          cover.defaultMuted = true;
          cover.autoplay = !matchMedia("(prefers-reduced-motion: reduce)").matches;
          cover.loop = true;
          cover.playsInline = true;
          cover.preload = "metadata";
          cover.tabIndex = -1;
          cover.setAttribute("aria-hidden", "true");
          if (work.image) cover.poster = work.image;
          cover.src = work.coverVideo;
          viewport.append(cover);
        } else viewport.append(picture(work.image, work.title));
        box.append(viewport);
      }
      button.append(box);
      // 장식을 카드에 고정해 두면 추후 자동 스크롤에서도 함께 이동합니다.
      if (selector === "#brand-one" && index === 2) {
        for (const [src, className] of [
          ["assets/images/main/cat1.svg", "sticker brand-cat"],
          ["assets/images/main/butterfly.svg", "sticker brand-butterfly"],
        ]) {
          const sticker = picture(src, "");
          sticker.className = className;
          sticker.setAttribute("aria-hidden", "true");
          button.append(sticker);
        }
      }
      if (selector === "#brand-two" && index === 0) {
        const sticker = picture("assets/images/main/game_2.svg", "");
        sticker.className = "sticker brand-controller";
        sticker.setAttribute("aria-hidden", "true");
        button.append(sticker);
      }
    } else if (type === "visual") {
      const box = element("span", "visual-image-box");
      if (work.image) box.append(picture(work.image, work.title));
      button.append(box);
    } else if (work.image) button.append(picture(work.image, work.title));
    if (type === "project") button.append(element("h3", "", work.title));
    if (type === "reel") {
      const play = element("span", "play-icon");
      play.setAttribute("aria-hidden", "true");
      button.append(play);
    }
    if (!directUrl) button.addEventListener("click", () => openWork(work, button, type === "reel"));
    if (type === "reel") {
      const item = element("div", "reel-item");
      item.append(button);
      if (index === 1 || index === 3) {
        const sticker = picture(index === 1 ? "assets/images/main/character.png" : "assets/images/main/TV.svg", "");
        sticker.className = index === 1 ? "sticker reel-character" : "sticker tv";
        sticker.setAttribute("aria-hidden", "true");
        item.append(sticker);
      }
      $(selector).append(item);
    } else $(selector).append(button);
  });
}
renderWorks("#brand-one", portfolioContent.brandOne, "project");
renderWorks("#brand-two", portfolioContent.brandTwo, "project");
renderWorks("#visual-list", portfolioContent.visual, "visual");
renderWorks("#reel-list", portfolioContent.reels, "reel");

// 자동 스크롤 속도: 초당 이동할 px 값입니다.
const autoScrollSettings = [
  { selector: "#visual-list", works: portfolioContent.visual, speed: 22, draggable: true },
  { selector: "#reel-list", works: portfolioContent.reels, speed: 24 },
];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const scrollingRails = [];

function wrapScrollDistance(distance, cycleWidth) {
  return cycleWidth > 0 ? ((distance % cycleWidth) + cycleWidth) % cycleWidth : 0;
}

function setupAutoScroll({ selector, works, speed, draggable = false }) {
  const rail = $(selector);
  const originals = Array.from(rail.children);
  if (originals.length < 2) return;
  const section = rail.closest("section");
  const state = { rail, speed, originals, cycleWidth: 0, distance: 0, hovered: false, focused: false, visible: true, holdUntil: 0, pointerHeld: false };

  function duplicateCard(original, index) {
    const copy = original.cloneNode(true);
    copy.classList.add("auto-scroll-copy");
    copy.removeAttribute("id");
    copy.setAttribute("aria-hidden", "true");
    copy.tabIndex = -1;
    copy.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
    copy.querySelectorAll("a, button, [tabindex]").forEach(node => { node.tabIndex = -1; });
    // cloneNode는 팝업 클릭 이벤트를 복사하지 않으므로 다시 연결합니다.
    const trigger = copy.tagName === "BUTTON" ? copy : copy.querySelector(".reel-card");
    if (trigger?.tagName === "BUTTON") trigger.addEventListener("click", () => openWork(works[index], trigger, selector === "#reel-list"));
    copy.querySelectorAll("video").forEach(video => { video.muted = true; video.defaultMuted = true; });
    return copy;
  }

  const leading = document.createDocumentFragment();
  originals.forEach((card, index) => leading.append(duplicateCard(card, index)));
  rail.prepend(leading);
  // 앞뒤에 동일한 카드를 이어 붙여 처음과 끝 사이에 빈 구간이 생기지 않습니다.
  const initialCycle = originals.reduce((sum, card) => sum + card.getBoundingClientRect().width, 0);
  const extraSets = Math.max(2, Math.ceil(window.innerWidth / initialCycle) + 1);
  for (let set = 0; set < extraSets; set++) originals.forEach((card, index) => rail.append(duplicateCard(card, index)));
  rail.classList.add("auto-scroll-track");

  function measure() {
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    state.cycleWidth = originals.reduce((sum, card) => sum + card.getBoundingClientRect().width + gap, 0);
    state.distance = wrapScrollDistance(state.distance, state.cycleWidth);
    paint();
  }
  function paint() {
    rail.style.transform = `translate3d(${-state.cycleWidth - state.distance}px, 0, 0)`;
  }
  state.paint = paint;
  measure();
  new ResizeObserver(measure).observe(rail);
  new IntersectionObserver(([entry]) => { state.visible = entry.isIntersecting; }).observe(section);
  rail.addEventListener("pointerenter", event => { if (event.pointerType !== "touch") state.hovered = true; });
  rail.addEventListener("pointerleave", () => { state.hovered = false; });
  rail.addEventListener("focusin", event => {
    state.focused = !state.pointerHeld && event.target.matches(":focus-visible");
    const index = originals.findIndex(card => card === event.target || card.contains(event.target));
    if (index < 0) return;
    const box = originals[index].getBoundingClientRect();
    if (box.left < 16 || box.right > window.innerWidth - 16) {
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
      state.distance = originals.slice(0, index).reduce((sum, card) => sum + card.getBoundingClientRect().width + gap, 0);
      paint();
    }
  });
  rail.addEventListener("focusout", event => { state.focused = rail.contains(event.relatedTarget); });
  if (draggable) {
    rail.classList.add("is-draggable");
    let drag = null;
    let suppressClickUntil = 0;
    rail.addEventListener("dragstart", event => event.preventDefault());
    rail.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;
      state.pointerHeld = true;
      state.holdUntil = Infinity;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, distance: state.distance, active: false };
    });
    rail.addEventListener("pointermove", event => {
      if (!drag || drag.id !== event.pointerId) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.active && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        drag.active = true;
        rail.setPointerCapture(event.pointerId);
        rail.classList.add("is-dragging");
      }
      if (!drag.active) return;
      event.preventDefault();
      state.distance = wrapScrollDistance(drag.distance - dx, state.cycleWidth);
      paint();
    });
    function finishDrag(event) {
      if (!drag || drag.id !== event.pointerId) return;
      if (drag.active) suppressClickUntil = performance.now() + 400;
      if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
      drag = null;
      state.pointerHeld = false;
      state.holdUntil = performance.now() + 2500;
      rail.classList.remove("is-dragging");
    }
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
    window.addEventListener("blur", () => { if (drag) finishDrag({ pointerId: drag.id }); });
    rail.addEventListener("click", event => {
      if (performance.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
    rail.addEventListener("wheel", event => {
      const delta = event.deltaX || (event.shiftKey ? event.deltaY : 0);
      if (!delta) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerWidth : 1;
      state.distance = wrapScrollDistance(state.distance + delta * unit, state.cycleWidth);
      state.holdUntil = performance.now() + 2500;
      paint();
    }, { passive: false });
  } else {
    rail.addEventListener("pointerdown", () => { state.holdUntil = Infinity; state.pointerHeld = true; });
    const release = () => { if (state.pointerHeld) { state.pointerHeld = false; state.holdUntil = performance.now() + 1500; } };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);
  }
  scrollingRails.push(state);
}

autoScrollSettings.forEach(setupAutoScroll);
document.querySelectorAll(".branding .rail-wrap").forEach((viewport, index) => {
  viewport.tabIndex = 0;
  viewport.setAttribute("role", "region");
  viewport.setAttribute("aria-label", `브랜딩 ${index + 1} 작업물 가로 스크롤`);
});
let previousScrollTime;
function animateRails(now) {
  const elapsed = previousScrollTime === undefined ? 0 : Math.min((now - previousScrollTime) / 1000, 0.05);
  previousScrollTime = now;
  for (const state of scrollingRails) {
    if (document.hidden || reducedMotion.matches || dialog.open || !state.visible || state.hovered || state.focused || now < state.holdUntil) continue;
    state.distance = wrapScrollDistance(state.distance + state.speed * elapsed, state.cycleWidth);
    state.paint();
  }
  requestAnimationFrame(animateRails);
}
requestAnimationFrame(animateRails);

// 반복 카드의 영상도 화면에 보일 때만 재생합니다.
const coverVisibility = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting && !reducedMotion.matches) entry.target.play().catch(() => {});
    else entry.target.pause();
  }
});
document.querySelectorAll(".project-cover-video").forEach(video => coverVisibility.observe(video));

const menuButton = $(".menu-toggle");
function closeMenu() {
  $("#navigation").classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "메뉴 열기");
}
menuButton.addEventListener("click", () => {
  const open = $("#navigation").classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
});
document.querySelectorAll("#navigation a").forEach((link) => link.addEventListener("click", closeMenu));
// 섹션으로 이동하되 주소에는 index.html만 유지합니다.
function clearSectionHash() {
  if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
}
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
    if (link.classList.contains("skip-link")) {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
    clearSectionHash();
  });
});
if (location.hash) {
  const initialTarget = document.getElementById(location.hash.slice(1));
  clearSectionHash();
  initialTarget?.scrollIntoView({ behavior: "instant", block: "start" });
}
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
$(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener("close", () => {
  dialogBody.querySelector("video")?.pause();
  dialogBody.replaceChildren();
  document.body.classList.remove("modal-open");
  lastTrigger?.focus({ preventScroll: true });
});
$("#contact-open").addEventListener("click", (event) => {
  dialogBody.replaceChildren(element("p", "", portfolioContent.contact.message));
  const email = portfolioContent.contact.email.trim();
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const link = element("a", "email-link", email);
    link.href = `mailto:${encodeURIComponent(email)}`;
    dialogBody.append(link);
  } else dialogBody.append(element("p", "contact-note", "연락처를 준비하고 있습니다."));
  showDialog("CONTACT", event.currentTarget);
});
$("#copyright-year").textContent = new Date().getFullYear();

const header = $(".site-header");
const hero = $(".hero");
function updateHeaderText() {
  header.classList.toggle("on-content", hero.getBoundingClientRect().bottom <= header.offsetHeight);
}
window.addEventListener("scroll", updateHeaderText, { passive: true });
window.addEventListener("resize", updateHeaderText);
updateHeaderText();

const heroVideo = $(".hero-video");
if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
  heroVideo.autoplay = false;
  heroVideo.pause();
}
