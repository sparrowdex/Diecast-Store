import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

// Fake auth function
const auth = (req) => ({ id: "fakeId" }); 

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  mediaUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on your server after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file ufsUrl", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, url: file.url, ufsUrl: file.ufsUrl };
    }),
};
