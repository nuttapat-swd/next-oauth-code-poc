# POC Oauth2 Authorization Flow (Keycloak)
## 🎯 **What is it?**  
A front-end built with Next.js, powered by *__99% Vibe Coding__* 😂, and visualized with a sequence diagram.

## 📚 **Purpose**  
To learn and demonstrate the **OAuth2 Authorization Code Flow** using Keycloak.

## 🛠️ **Features**
- Login with Keycloak
- Retrieve Authorization Code
- Exchange Code for Access Token
- Call a protected API
- Logout

![image](https://github.com/user-attachments/assets/0897877f-3da5-45c4-99fb-1f4e72fd5235)

---

## 🚀 Getting Started

1. Create a `.env.local` file with the following variables:
```.env
NEXT_PUBLIC_KEYCLOAK_BASE_URL=
NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI=
NEXT_PUBLIC_KEYCLOAK_REALM=
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=
NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET=
NEXT_PUBLIC_RESOURCE_API_URL=
```
2. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


## 🖼️ Example
![image](https://github.com/user-attachments/assets/41a15061-db30-42c4-a3aa-83430ab8cb42)
![image](https://github.com/user-attachments/assets/f81a999f-8373-4d4a-bb88-7d239c7d96b9)
![image](https://github.com/user-attachments/assets/01fc0baf-ad82-4ffb-903f-45fe2c2a9c58)
