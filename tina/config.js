import { defineConfig } from "tinacms";

const getSessionOnApi = async () => {
  const res = await fetch(`/api/auth/session`)
  console.log(res)
  return res.json();
}

const config = defineConfig({
  contentApiUrlOverride: "/api/gql",
  admin: {
    auth: {
      useLocalAuth: process.env.TINA_PUBLIC_IS_LOCAL === "true",

      // Uncomment this to use custom auth
      customAuth: true,
      authenticate: async () => {
        window.location.href = '/api/auth/signin?callbackUrl=/admin'

      },
      getToken: async () => {
        let sessionData = await getSessionOnApi();
        return sessionData?.accessToken ? { id_token: sessionData.accessToken } : '';
      },
      getUser: async () => {
        let sessionData = await getSessionOnApi();
        return sessionData?.user;
      },
      logout: async () => {
        window.location.href = '/api/auth/signout?callbackUrl=/'
      },
    },
  },
  // clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH || // custom branch env override
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || // Vercel branch env
    process.env.HEAD, // Netlify branch env
  // token: process.env.TINA_TOKEN || "foo",
  media: {
    loadCustomStore: async () => {
      const pack = await import("next-tinacms-cloudinary");
      return pack.TinaCloudCloudinaryMediaStore;
    },
  },
  build: {
    publicFolder: "public", // The public asset folder for your framework
    outputFolder: "admin", // within the public folder
  },
  schema: {
    collections: [
      {
        label: "Page Content",
        name: "page",
        path: "content/page",
        format: "mdx",
        fields: [
          {
            name: "body",
            label: "Main Content",
            type: "rich-text",
            isBody: true,
          },
          {
            name: "hero_image",
            label: "Hero Image",
            type: "image"
          }
        ],
        ui: {
          router: ({ document }) => {
            if (document._sys.filename === "home") {
              return `/`;
            }
            return undefined;
          },
        },
      },
      {
        label: "Blog Posts",
        name: "post",
        path: "content/post",
        fields: [
          {
            type: "string",
            label: "Title",
            name: "title",
          },
          {
            type: "string",
            label: "Blog Post Body",
            name: "body",
            isBody: true,
            ui: {
              component: "textarea",
            },
          },
        ],
        ui: {
          router: ({ document }) => {
            return `/posts/${document._sys.filename}`;
          },
        },
      },
    ],
  },
});

export default config;
