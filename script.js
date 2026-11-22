const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");

function setNavigationOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  primaryNavigation.classList.toggle("is-open", isOpen);
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  setNavigationOpen(!isExpanded);
});

primaryNavigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setNavigationOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setNavigationOpen(false);
    menuToggle.focus();
  }
});

const gainGallery = document.querySelector(".gain-gallery");
const lightbox = document.querySelector("#gain-lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxClose = lightbox.querySelector(".lightbox-close");
const lightboxPrevious = lightbox.querySelector(".lightbox-previous");
const lightboxNext = lightbox.querySelector(".lightbox-next");
const lightboxPosition = lightbox.querySelector(".lightbox-position");
const galleryItems = [...gainGallery.querySelectorAll("[data-gallery-item]")];

let activeThumbnail = null;
let activeGalleryIndex = 0;
let previousScrollPosition = 0;
let touchStart = null;

function showGalleryImage(index) {
  const item = galleryItems[index];
  const thumbnail = item.querySelector("img");
  const source = item.dataset.fullSrc || thumbnail?.currentSrc || thumbnail?.src;
  const alternativeText = item.dataset.alt || thumbnail?.alt;

  if (!source || !alternativeText?.trim()) {
    console.error("Each GAIN gallery image needs a source and descriptive alt text.");
    return false;
  }

  activeGalleryIndex = index;
  lightboxImage.src = source;
  lightboxImage.alt = alternativeText;
  lightboxPosition.textContent = `Image ${index + 1} of ${galleryItems.length}`;
  lightboxPrevious.disabled = galleryItems.length < 2;
  lightboxNext.disabled = galleryItems.length < 2;
  return true;
}

function moveGalleryImage(direction) {
  if (galleryItems.length < 2) {
    return;
  }

  const nextIndex = (activeGalleryIndex + direction + galleryItems.length) % galleryItems.length;
  showGalleryImage(nextIndex);
}

function openLightbox(thumbnail, index) {
  if (!showGalleryImage(index)) {
    return;
  }

  activeThumbnail = thumbnail;
  previousScrollPosition = window.scrollY;
  document.body.style.setProperty("--lightbox-scroll-y", `-${previousScrollPosition}px`);
  document.documentElement.classList.add("lightbox-open");
  document.body.classList.add("lightbox-open");
  lightbox.showModal();
  lightboxClose.focus();
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(item, index));
});

lightboxClose.addEventListener("click", () => lightbox.close());
lightboxPrevious.addEventListener("click", () => moveGalleryImage(-1));
lightboxNext.addEventListener("click", () => moveGalleryImage(1));

lightbox.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    lightbox.close();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveGalleryImage(-1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    moveGalleryImage(1);
  }
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

lightbox.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
  document.body.classList.remove("lightbox-open");
  document.body.style.removeProperty("--lightbox-scroll-y");
  window.scrollTo(0, previousScrollPosition);
  document.documentElement.classList.remove("lightbox-open");
  activeThumbnail?.focus({ preventScroll: true });
  activeThumbnail = null;
});

lightboxImage.addEventListener("touchstart", (event) => {
  if (event.touches.length !== 1) {
    touchStart = null;
    return;
  }

  const touch = event.touches[0];
  touchStart = { x: touch.clientX, y: touch.clientY };
}, { passive: true });

lightboxImage.addEventListener("touchend", (event) => {
  if (!touchStart || event.changedTouches.length !== 1) {
    touchStart = null;
    return;
  }

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStart.x;
  const deltaY = touch.clientY - touchStart.y;
  touchStart = null;

  if (Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
    moveGalleryImage(deltaX < 0 ? 1 : -1);
  }
}, { passive: true });

lightboxImage.addEventListener("touchcancel", () => {
  touchStart = null;
}, { passive: true });

const creativeSlides = [
  {
    type: "video",
    title: "Robot with a VR headset",
    category: "Short-form video",
    caption: "A robot figure wearing a VR headset.",
    src: "assets/creative/media/robot-headset.mp4",
    poster: "assets/creative/media/robot-headset-poster.png"
  },
  {
    type: "instagram",
    title: "Instagram Reel",
    category: "Instagram Reel",
    caption: "Shared by @gain.n0w and @adham_elshark_",
    url: "https://www.instagram.com/reel/Ded9NhZRDVR/",
    embedUrl: "https://www.instagram.com/reel/Ded9NhZRDVR/embed/"
  },
  {
    type: "instagram",
    title: "Instagram Reel",
    category: "Instagram Reel",
    caption: "Shared by @adham_elshark_",
    url: "https://www.instagram.com/reel/DeZpySZsOtj/",
    embedUrl: "https://www.instagram.com/reel/DeZpySZsOtj/embed/"
  },
  {
    type: "instagram",
    title: "Instagram post",
    category: "Instagram post",
    caption: "Shared by @zuyd_hogeschool",
    url: "https://www.instagram.com/p/DfrHviDjfT3/",
    embedUrl: "https://www.instagram.com/p/DfrHviDjfT3/embed/"
  }
];

const creativeSlideshow = document.querySelector(".creative-slideshow");
const creativeMediaFrame = document.querySelector("#creative-media-frame");
const creativeCounter = document.querySelector(".creative-counter");
const creativeCategory = document.querySelector(".creative-category");
const creativeCaption = document.querySelector(".creative-caption");
const creativeExpand = document.querySelector(".creative-expand");
const creativeProgressButtons = [...document.querySelectorAll(".creative-progress button")];
const creativeLightbox = document.querySelector("#creative-lightbox");
const creativeLightboxMedia = document.querySelector("#creative-lightbox-media");
const creativeLightboxClose = document.querySelector(".creative-lightbox-close");
const creativeLightboxPrevious = document.querySelector(".creative-lightbox-previous");
const creativeLightboxNext = document.querySelector(".creative-lightbox-next");
const creativeLightboxPosition = document.querySelector(".creative-lightbox-position");

let activeCreativeIndex = 0;
let creativeLightboxOpener = null;
let previousCreativeScrollPosition = 0;

function createCreativeMedia(slide, openImage) {
  if (slide.type === "instagram") {
    const frame = document.createElement("iframe");
    frame.src = slide.embedUrl;
    frame.title = `${slide.title}, ${slide.caption}`;
    frame.loading = "lazy";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.allow = "encrypted-media; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    return frame;
  }

  if (slide.type === "image") {
    const button = document.createElement("button");
    const image = document.createElement("img");
    button.className = "creative-image-open";
    button.type = "button";
    button.setAttribute("aria-label", `Open image: ${slide.title}`);
    image.src = slide.src;
    image.alt = slide.alt;
    button.append(image);
    if (openImage) {
      button.addEventListener("click", openImage);
    }
    return button;
  }

  if (slide.type === "video") {
    const video = document.createElement("video");
    const source = document.createElement("source");
    video.setAttribute("aria-label", slide.title);
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.poster = slide.poster;
    source.src = slide.src;
    source.type = "video/mp4";
    video.append(source);
    return video;
  }

  throw new Error(`Unsupported creative media type: ${slide.type}`);
}

function updateCreativeLightbox() {
  const slide = creativeSlides[activeCreativeIndex];
  creativeLightboxMedia.replaceChildren(createCreativeMedia(slide));
  creativeLightboxPosition.textContent =
    `${String(activeCreativeIndex + 1).padStart(2, "0")} / ${String(creativeSlides.length).padStart(2, "0")}`;
}

function renderCreativeSlide(index) {
  activeCreativeIndex = (index + creativeSlides.length) % creativeSlides.length;
  const slide = creativeSlides[activeCreativeIndex];

  creativeMediaFrame.replaceChildren(
    createCreativeMedia(slide, () => openCreativeLightbox(creativeMediaFrame.querySelector("button")))
  );
  creativeCategory.textContent = slide.category;
  creativeCaption.textContent = slide.caption;
  creativeCounter.textContent =
    `${String(activeCreativeIndex + 1).padStart(2, "0")} / ${String(creativeSlides.length).padStart(2, "0")}`;

  creativeSlideshow.querySelector(".creative-original-link")?.remove();
  if (slide.url) {
    const link = document.createElement("a");
    link.className = "creative-original-link";
    link.href = slide.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open original on Instagram";
    creativeCaption.after(link);
  }

  creativeProgressButtons.forEach((button, buttonIndex) => {
    if (buttonIndex === activeCreativeIndex) {
      button.setAttribute("aria-current", "true");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  if (creativeLightbox.open) {
    updateCreativeLightbox();
  }
}

function moveCreativeSlide(direction) {
  renderCreativeSlide(activeCreativeIndex + direction);
}

function openCreativeLightbox(opener) {
  creativeLightboxOpener = opener;
  previousCreativeScrollPosition = window.scrollY;
  document.body.style.setProperty("--lightbox-scroll-y", `-${previousCreativeScrollPosition}px`);
  document.documentElement.classList.add("lightbox-open");
  document.body.classList.add("lightbox-open");
  updateCreativeLightbox();
  creativeLightbox.showModal();
  creativeLightboxClose.focus();
}

document.querySelector(".creative-previous").addEventListener("click", () => moveCreativeSlide(-1));
document.querySelector(".creative-next").addEventListener("click", () => moveCreativeSlide(1));
creativeExpand.addEventListener("click", () => openCreativeLightbox(creativeExpand));
creativeProgressButtons.forEach((button, index) => {
  button.addEventListener("click", () => renderCreativeSlide(index));
});

creativeLightboxClose.addEventListener("click", () => creativeLightbox.close());
creativeLightboxPrevious.addEventListener("click", () => moveCreativeSlide(-1));
creativeLightboxNext.addEventListener("click", () => moveCreativeSlide(1));
creativeLightbox.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    creativeLightbox.close();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveCreativeSlide(-1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    moveCreativeSlide(1);
  }
});
creativeLightbox.addEventListener("click", (event) => {
  if (event.target === creativeLightbox) {
    creativeLightbox.close();
  }
});
creativeLightbox.addEventListener("close", () => {
  creativeLightboxMedia.replaceChildren();
  document.body.classList.remove("lightbox-open");
  document.body.style.removeProperty("--lightbox-scroll-y");
  window.scrollTo(0, previousCreativeScrollPosition);
  document.documentElement.classList.remove("lightbox-open");
  creativeLightboxOpener?.focus({ preventScroll: true });
  creativeLightboxOpener = null;
});

function enableCreativeSwipe(element) {
  let start = null;

  element.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) {
      start = null;
      return;
    }

    start = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });

  element.addEventListener("touchend", (event) => {
    if (!start || event.changedTouches.length !== 1) {
      start = null;
      return;
    }

    const deltaX = event.changedTouches[0].clientX - start.x;
    const deltaY = event.changedTouches[0].clientY - start.y;
    start = null;

    if (Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
      moveCreativeSlide(deltaX < 0 ? 1 : -1);
    }
  }, { passive: true });

  element.addEventListener("touchcancel", () => {
    start = null;
  }, { passive: true });
}

enableCreativeSwipe(creativeSlideshow);
enableCreativeSwipe(creativeLightbox);
renderCreativeSlide(0);
