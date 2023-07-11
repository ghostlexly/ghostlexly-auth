# ✨ ghostlexly-auth ✨

The best, tiny, robust, customizable, and easy authentication for Next.js + Express.js stack.

## Features

- 🐣 - Easy to use
- 📝 - Login & Logout
- 🔒 - JWT Secured Cookie
- 💅 - Maintain user session and access user session data
- 🤖 - Fetch module with Axios included (with authorization header)
- 💻 - SSR ready
- 🔥 - Battle-tested on 100k/user websites
- 🔑 - Compatible with [PassportJS](https://www.passportjs.org/) and [Auth0](https://auth0.com/)
- ✅ - Module written in TypeScript

## Installation

### Install package

```
yarn add ghostlexly-auth
```

### Add Context provider to your application

We need to wrap our application with the `ghostlexly-auth` context provider so that we can fetch user data within our application.

Add the context provider inside your **\_app.tsx** file.

**Example**

```tsx
// /pages/_app.tsx

import { GhostlexlyAuthProvider } from "ghostlexly-auth";

function MyApp({ Component, pageProps, router }) {
  return (
    <GhostlexlyAuthProvider {...pageProps}>
      <Component {...pageProps} />
    </GhostlexlyAuthProvider>
  );
}

export default MyApp;
```

**You can configure the provider like you wish**

```tsx
<GhostlexlyAuthProvider {...pageProps} userDataUrl="/api/me" cookieExpireInDays="7">
  <Component {...pageProps} />
</GhostlexlyAuthProvider>
```

### `GhostLexlyAuthProvider` options:

- **userDataUrl**: The URL path to your API from which we will fetch the user's session data that we can later access using `auth.session`.
- **cookieExpireInDays**: Cookie's expiration time in number of days. (31 by default)

### Login the user

We first need to declare a `auth` variable with the `useAuth` hook.
Then, we can call `signIn()` method to login the user.

**Important**: The `signIn()` method requires your api endpoint to return `access_token` in the response.
This token will be used later in a `Authorization` header, while fetching user data.

**Example**

```tsx
import { useAuth } from "ghostlexly-auth";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth(); // 👈 here

  const onSubmit = async (data) => {
    auth
      .signIn("/api/login", { email: data.email, password: data.password })
      .then((res) => {
        router.push("/member-area/"); // 👈 redirect to this path if the login is successful
      })
      .catch((err) => {
        alert("Invalid user infos !"); // 👈 return an error if the credentials are invalid
      });
  };
}
```

**Example api endpoint response**

The api endpoint return a JWT Token that will be used later on `Authorization` header.

```json
// https://localhost/api/login
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODkxMTExNDYsImV4cCI6MTY4OTcxNTk0Nn0.-ELIPUuYVfPOL3wXe-yCIU-TsSXUS4DXBuzirfdfTOg"
}
```

---

The `signIn()` method returns a promise.
It resolves to the user's session data if the login is successful.
If the API does not return a 200 response, it will return an error.

You can provide two parameters to the `signIn` method:

- **url**: The path of the API to call for the login.
- **data**: The data to be sent to the API.

### Logout the user

We first need to declare a `auth` variable with the `useAuth` hook.
Then, we can call `signOut()` method to logout the user.

**Example**

```tsx
export default function LogoutPage() {
  const auth = useAuth();
  auth.signOut({ redirectUrl: "/member-area/login" });
}
```

The `signOut()` method remove the user's cookie and redirect to a path.

You can provide one parameter to the `signOut()` method:

- **redirectUrl**: The path to redirect the user to.

### Get user session

The `session` object in `useAuth` hook is the easiest way to check if someone is signed in and get his data.

We first need to declare a `auth` variable with the `useAuth` hook.
Then, we can call `session` object to access the user session.

**Example**

```tsx
export default function ExamplePage() {
  const auth = useAuth();

  console.log(auth.session.status); // 👈 user's session status (if the user is logged in or not)
  console.log(auth.session.data); // 👈 access user session data

  return (
    <div>
      {auth.session.status === "authenticated" && <h1>I'm logged in !</h1>}

      {auth.session.status === "unauthenticated" && <h1>I'm not logged in.</h1>}
    </div>
  );
}
```

`auth.session` returns an object containing two values: data and status:

- **data**: This can be two values: Session / null.
  - when the session hasn't been fetched yet, data will be `null`
  - in case of success, data will be `Session`.
- **status**: Enum mapping to two possible session states: `"authenticated" | "unauthenticated"`

### Retrieve user's Access Token

**Client side:**

```tsx
import { getAccessToken } from "ghostlexly-auth";

export default TestPage() {
    const accessToken = getAccessToken();
    console.log(accessToken);
}
```

**Server side:**

```tsx
import { getAccessToken } from "ghostlexly-auth";

export async function getServerSideProps({ req }) {
  const accessToken = getAccessToken(req);
  console.log(accessToken);
}
```

### Call the api with the `Authorization` header and `Axios`

This request will automatically include an `Authorization` header with your access token.

The `api()` method accepts a `req` parameter for the SSR.

```tsx
import { api } from "ghostlexly-auth";

export default TestPage() {
    const onSubmit = () => {
        api().get("https://dummyjson.com/products");

        api().post("/api/register", { email: "test@email.com"});
    }
}
```

More informations on [Axios](https://github.com/axios/axios)
