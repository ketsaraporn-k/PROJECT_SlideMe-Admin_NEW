import swaggerJSDoc from "swagger-jsdoc";

// กำหนด options สำหรับ swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "[SlideMe(Admin)] API Document",
      version: "1.0.0",
      description:  `📌 **API Documentation for SlideMe(Admin)_Backend**\n\n` +
                    `👩‍💻 **นางสาวเกศราภรณ์ ใยบัว** | 🆔 **รหัส 67183473**\n\n` +
                    `🎓 **สาขาวิชาวิทยาการคอมพิวเตอร์และนวัตกรรมการพัฒนาซอฟต์แวร์**\n` +
                    `🏫 **คณะเทคโนโลยีสารสนเทศ มหาวิทยาลัยศรีปทุม**\n\n` +
                    `🚀 **Project: SlideMe(Admin) | Version 1.0.0**\n` +
                    `📝 **ตามมาตรฐาน OpenAPI 3.0**\n\n` +
                    `## 🔹 **API Categories**\n` +
                        `- 🔑 **userslogin** -- จำนวน **6 APIs**\n` +
                        `- 🖼  **filesbanneruploads** -- จำนวน **3 APIs**\n` +
                        `- 📢 **bannerinfo** -- จำนวน **4 API**\n\n` +
                    `🔍 **รายละเอียดของแต่ละ API แสดงไว้ตามด้านล่างนี้** ⬇️`,
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    tags: [
      {
        name: "userslogin",
        description: "User endpoints (6 APIs)",
      },
      {
        name: "filesbanneruploads",
        description: "File endpoints (3 APIs)",
      },
      {
        name: "bannerinfo",
        description: "Banner endpoints (4 APIs)",
      },
    ],
  },
  apis: [
    "./routers/usersRouter.js",
    "./routers/FilesBannerUploads.js",
    "./routers/bannerinfoRouter.js",
  ],
};

// สร้าง swaggerSpec
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
