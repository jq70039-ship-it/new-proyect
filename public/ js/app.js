const $ = selector =>
document.querySelector(selector);

let styles = [];

async function api(
url,
options = {}
) {
const response =
await fetch(
url,
options
);

const data =
await response
.json()
.catch(
() => ({})
);

if (!response.ok) {
throw new Error(
data.error ||
"Something went wrong"
);
}

return data;
}

async function loadWebsite() {

const [
settings,
styleData
] =
await Promise.all([
api("/api/settings"),
api("/api/styles")
]);

styles =
styleData;

$("#brandName").textContent =
settings.brand_name ||
"LUX INK";

$("#navigationBrand").textContent =
settings.brand_name ||
"LUX INK";

$("#artistName").textContent =
settings.artist_name ||
"Tattoo Artist";

$("#artistBio").textContent =
settings.artist_bio ||
"";

$("#artistLocation").textContent =
settings.location ||
"";

renderStyles();

renderBookingStyles();

}

function renderStyles() {

const container =
$("#styleList");

container.innerHTML =
styles
.map(
(
style,
index
) => {

```
      const image =
        style.hero_image
          ? `
            <img
              class="style-image"
              src="${style.hero_image}"
              alt="${style.name}"
            >
          `
          : `
            <div
              class="style-image"
            ></div>
          `;


      return `
        <article
          class="style-card"
        >

          <div
            class="style-number"
          >
            ${String(
              index + 1
            ).padStart(
              2,
              "0"
            )}
          </div>


          <div
            class="style-content"
          >

            <div
              class="style-information"
            >

              <h3>
                ${style.name}
              </h3>


              <p
                class="eyebrow"
              >
                ${
                  style.subtitle ||
                  ""
                }
              </p>


              <p>
                ${
                  style.description ||
                  ""
                }
              </p>


              <button
                class="luxury-button explore-style"
                data-id="${style.id}"
              >
                EXPLORE STYLE
              </button>

            </div>


            ${image}

          </div>

        </article>
      `;
    }
  )
  .join("");
```

document
.querySelectorAll(
".explore-style"
)
.forEach(
button => {
button.addEventListener(
"click",
() => {
openGallery(
Number(
button.dataset.id
)
);
}
);
}
);
}

function renderBookingStyles() {

const select =
$("#bookingStyle");

select.innerHTML =
`       <option value="">
        SELECT STYLE       </option>
    ` +
styles
.map(
style =>
`             <option
              value="${style.id}"             >
              ${style.name}             </option>
          `
)
.join("");
}

async function openGallery(
styleId
) {

const style =
styles.find(
item =>
item.id === styleId
);

if (!style) {
return;
}

const images =
await api(
`/api/styles/${styleId}/gallery`
);

const gallerySection =
$("#galleryView");

gallerySection
.classList
.remove(
"hidden"
);

const heroImage =
style.hero_image
? `         <img
          class="gallery-hero-image"
          src="${style.hero_image}"
          alt="${style.name}"         >
      `
: `         <div
          class="gallery-hero-image"         ></div>
      `;

$("#galleryHero").innerHTML =
`
${heroImage}

```
  <div>

    <p
      class="eyebrow"
    >
      ${
        style.subtitle ||
        ""
      }
    </p>


    <h2>
      ${style.name}
    </h2>


    <p>
      ${
        style.description ||
        ""
      }
    </p>

  </div>
`;
```

$("#galleryGrid").innerHTML =
images
.map(
image =>
`             <img
              class="gallery-item"
              src="${image.image_url}"
              alt="${image.title || style.name}"
              data-title="${image.title || ""}"
              data-description="${image.description || ""}"             >
          `
)
.join("");

document
.querySelectorAll(
".gallery-item"
)
.forEach(
image => {
image.addEventListener(
"click",
() => {
openLightbox(
image
);
}
);
}
);

gallerySection
.scrollIntoView({
behavior:
"smooth"
});
}

function openLightbox(
image
) {

$("#lightboxImage").src =
image.src;

$("#lightboxText").innerHTML =
` <h3>
${
image.dataset.title ||
""
} </h3>

```
  <p>
    ${
      image.dataset.description ||
      ""
    }
  </p>
`;
```

$("#lightbox")
.classList
.remove(
"hidden"
);
}

$("#closeGallery")
.addEventListener(
"click",
() => {
$("#galleryView")
.classList
.add(
"hidden"
);
}
);

$("#closeLightbox")
.addEventListener(
"click",
() => {
$("#lightbox")
.classList
.add(
"hidden"
);
}
);

$("#bookingForm")
.addEventListener(
"submit",

```
async event => {

  event.preventDefault();


  const message =
    $("#bookingMessage");


  message.textContent =
    "SENDING REQUEST...";


  try {

    const formData =
      new FormData(
        event.target
      );


    await api(
      "/api/bookings",
      {
        method:
          "POST",

        body:
          formData
      }
    );


    event.target.reset();


    message.textContent =
      "YOUR REQUEST HAS BEEN RECEIVED.";

  }

  catch (error) {

    message.textContent =
      error.message;

  }

}
```

);

$("#mobileMenuButton")
.addEventListener(
"click",
() => {

```
  $("#mobileMenu")
    .classList
    .toggle(
      "active"
    );


  document.body
    .classList
    .toggle(
      "menu-open"
    );

}
```

);

document
.querySelectorAll(
"#mobileMenu a"
)
.forEach(
link => {

```
  link.addEventListener(
    "click",
    () => {

      $("#mobileMenu")
        .classList
        .remove(
          "active"
        );


      document.body
        .classList
        .remove(
          "menu-open"
        );

    }
  );

}
```

);

loadWebsite()
.catch(
error => {
console.error(
error
);
}
);

