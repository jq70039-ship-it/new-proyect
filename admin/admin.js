const $ = selector =>
document.querySelector(selector);

function getToken() {
return localStorage.getItem(
"luxink_token"
);
}

function setToken(token) {
localStorage.setItem(
"luxink_token",
token
);
}

function clearToken() {
localStorage.removeItem(
"luxink_token"
);
}

async function api(
url,
options = {}
) {

const token =
getToken();

options.headers = {
...(options.headers || {}),
...(token
? {
Authorization:
`Bearer ${token}`
}
: {})
};

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
"Request failed"
);
}

return data;
}

/* LOGIN */

$("#loginForm")
.addEventListener(
"submit",

```
async event => {

  event.preventDefault();


  const formData =
    Object.fromEntries(
      new FormData(
        event.target
      )
    );


  try {

    const result =
      await api(
        "/api/auth/login",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(
              formData
            )
        }
      );


    setToken(
      result.token
    );


    showAdmin();

  }

  catch (error) {

    $("#loginMessage")
      .textContent =
        error.message;

  }

}
```

);

/* ADMIN LOAD */

async function showAdmin() {

if (!getToken()) {
return;
}

$("#loginView")
.classList
.add(
"hidden"
);

$("#adminView")
.classList
.remove(
"hidden"
);

await loadAdmin();
}

async function loadAdmin() {

const [
settings,
styles,
bookings
] =
await Promise.all([
api("/api/settings"),
api("/api/styles"),
api("/api/admin/bookings")
]);

loadSettings(
settings
);

await loadStyles(
styles
);

loadBookings(
bookings
);
}

/* SETTINGS */

function loadSettings(
settings
) {

Object
.entries(
settings
)
.forEach(
([key, value]) => {

```
    const input =
      document.querySelector(
        `#settingsForm [name="${key}"]`
      );


    if (input) {
      input.value =
        value;
    }

  }
);
```

}

$("#settingsForm")
.addEventListener(
"submit",

```
async event => {

  event.preventDefault();


  const data =
    Object.fromEntries(
      new FormData(
        event.target
      )
    );


  try {

    await api(
      "/api/admin/settings",
      {
        method:
          "PUT",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(
            data
          )
      }
    );


    alert(
      "Settings saved successfully."
    );

  }

  catch (error) {

    alert(
      error.message
    );

  }

}
```

);

/* STYLES */

async function loadStyles(
styles
) {

const container =
$("#stylesAdmin");

container.innerHTML =
"";

for (
const style
of styles
) {

```
const images =
  await api(
    `/api/styles/${style.id}/gallery`
  );


const element =
  document.createElement(
    "div"
  );


element.className =
  "style-admin";


const hero =
  style.hero_image
    ? `
      <img
        class="style-hero-preview"
        src="${style.hero_image}"
        alt="${style.name}"
      >
    `
    : "";


const gallery =
  images
    .map(
      image =>
        `
          <div
            class="gallery-card"
          >

            <img
              src="${image.image_url}"
              alt="${image.title || ""}"
            >


            <button
              class="delete-image"
              data-id="${image.id}"
            >
              DELETE
            </button>

          </div>
        `
    )
    .join("");


const uploadForm =
  images.length < 10
    ? `
      <form
        class="gallery-form"
        data-style-id="${style.id}"
      >

        <input
          type="text"
          name="title"
          placeholder="IMAGE TITLE"
        >


        <input
          type="text"
          name="description"
          placeholder="IMAGE DESCRIPTION"
        >


        <input
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/webp"
          required
        >


        <button
          type="submit"
        >
          ADD IMAGE
        </button>

      </form>
    `
    : `
      <p>
        Gallery limit reached.
      </p>
    `;


element.innerHTML =
  `
    <h2>
      ${style.name}
    </h2>


    ${hero}


    <form
      class="style-form"
      data-style-id="${style.id}"
    >

      <input
        type="text"
        name="name"
        value="${style.name}"
      >


      <input
        type="text"
        name="subtitle"
        value="${style.subtitle || ""}"
      >


      <textarea
        name="description"
      >${style.description || ""}</textarea>


      <input
        type="number"
        name="position"
        value="${style.position}"
      >


      <label>
        CHANGE HERO IMAGE
      </label>


      <input
        type="file"
        name="hero_image"
        accept="image/jpeg,image/png,image/webp"
      >


      <button
        type="submit"
      >
        SAVE STYLE
      </button>

    </form>


    <p
      class="gallery-title"
    >

      GALLERY

      <span
        class="gallery-count"
      >
        (${images.length}/10)
      </span>

    </p>


    <div
      class="gallery-admin"
    >
      ${gallery}
    </div>


    ${uploadForm}
  `;


container.appendChild(
  element
);
```

}

attachStyleEvents();
}

function attachStyleEvents() {

document
.querySelectorAll(
".style-form"
)
.forEach(
form => {

```
    form.addEventListener(
      "submit",

      async event => {

        event.preventDefault();


        const styleId =
          form.dataset
            .styleId;


        try {

          await api(
            `/api/styles/${styleId}`,
            {
              method:
                "PUT",

              body:
                new FormData(
                  form
                )
            }
          );


          await loadAdmin();

        }

        catch (error) {

          alert(
            error.message
          );

        }

      }
    );

  }
);
```

document
.querySelectorAll(
".gallery-form"
)
.forEach(
form => {

```
    form.addEventListener(
      "submit",

      async event => {

        event.preventDefault();


        const styleId =
          form.dataset
            .styleId;


        try {

          await api(
            `/api/styles/${styleId}/gallery`,
            {
              method:
                "POST",

              body:
                new FormData(
                  form
                )
            }
          );


          await loadAdmin();

        }

        catch (error) {

          alert(
            error.message
          );

        }

      }
    );

  }
);
```

document
.querySelectorAll(
".delete-image"
)
.forEach(
button => {

```
    button.addEventListener(
      "click",

      async () => {

        const confirmation =
          confirm(
            "Delete this image?"
          );


        if (!confirmation) {
          return;
        }


        try {

          await api(
            `/api/gallery/${button.dataset.id}`,
            {
              method:
                "DELETE"
            }
          );


          await loadAdmin();

        }

        catch (error) {

          alert(
            error.message
          );

        }

      }
    );

  }
);
```

}

/* BOOKINGS */

function loadBookings(
bookings
) {

const container =
$("#bookings");

if (
bookings.length === 0
) {

```
container.innerHTML =
  "<p>No bookings yet.</p>";

return;
```

}

container.innerHTML =
bookings
.map(
booking => {

```
      const reference =
        booking.reference_image
          ? `
            <p>

              <a
                class="reference-link"
                href="${booking.reference_image}"
                target="_blank"
              >
                VIEW REFERENCE IMAGE
              </a>

            </p>
          `
          : "";


      return `
        <div
          class="booking-row"
        >

          <div>

            <strong>
              ${booking.name}
            </strong>


            <p>
              ${booking.email}
            </p>


            <p>
              ${
                booking.phone ||
                ""
              }
            </p>


            <p>

              ${
                booking.style_name ||
                "No style selected"
              }

              ·

              ${
                booking.body_area ||
                ""
              }

              ·

              ${
                booking.tattoo_size ||
                ""
              }

            </p>


            <p>
              ${
                booking.description ||
                ""
              }
            </p>


            ${reference}

          </div>


          <select
            class="booking-status"
            data-id="${booking.id}"
          >

            <option
              value="pending"
              ${
                booking.status ===
                "pending"
                  ? "selected"
                  : ""
              }
            >
              pending
            </option>


            <option
              value="confirmed"
              ${
                booking.status ===
                "confirmed"
                  ? "selected"
                  : ""
              }
            >
              confirmed
            </option>


            <option
              value="completed"
              ${
                booking.status ===
                "completed"
                  ? "selected"
                  : ""
              }
            >
              completed
            </option>


            <option
              value="cancelled"
              ${
                booking.status ===
                "cancelled"
                  ? "selected"
                  : ""
              }
            >
              cancelled
            </option>

          </select>

        </div>
      `;
    }
  )
  .join("");
```

document
.querySelectorAll(
".booking-status"
)
.forEach(
select => {

```
    select.addEventListener(
      "change",

      async () => {

        try {

          await api(
            `/api/admin/bookings/${select.dataset.id}`,
            {
              method:
                "PATCH",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  {
                    status:
                      select.value
                  }
                )
            }
          );

        }

        catch (error) {

          alert(
            error.message
          );

        }

      }
    );

  }
);
```

}

/* LOGOUT */

$("#logoutButton")
.addEventListener(
"click",

```
() => {

  clearToken();

  location.reload();

}
```

);

/* INITIAL LOAD */

if (getToken()) {

showAdmin()
.catch(
() => {

```
    clearToken();

    location.reload();

  }
);
```

}

