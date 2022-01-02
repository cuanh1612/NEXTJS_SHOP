/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    "BASE_URL": "https://nextjs-shop-9u1ey5787-cuanh1612.vercel.app/",
    "MONGODB_URL": "mongodb+srv://admin:huy16120101@cluster0.rwzsn.mongodb.net/NEXT_SHOP?retryWrites=true&w=majority",
    "ACCESS_TOKEN_SECRET": "Ze]dg/hFWb5#?CV}}CfxC8!/Ha`T/+Z4EfK-^sQp33?^FXhz@*",
    "REFRESH_TOKEN_SECRET": "!3}{bt33b~Z'prh/@:W6B^amR$U4Wm/F`R4#/4Ez/3RkJgBUQZ",
    "PAYPAL_CLIENT_ID": "AVzjKAOPxwAcJRLYfZx_QUPBgV7_7sjGsQSAekq4yu-IOVR8OJkDhaqPN0BHIieeV9CX52QZkpYYgR9x",
    "CLOUD_UPDATE_PRESET": "NEXT_SHOP",
    "CLOUD_NAME": "dmftfub2f",
    "CLOUD_API_KEY": "717254217725861",
    "CLOUD_API": "https://api.cloudinary.com/v1_1/dmftfub2f/image/upload"
  },
  images: {
    domains: ['source.unsplash.com', 'res.cloudinary.com'],
  }
}
