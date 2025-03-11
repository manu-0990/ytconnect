#yt-connect

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app@latest`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, get a postgres database url and paste it in place of

```dotenv
DATABASE_URL="postgresql://user:password@host:port/database" 
```

Then get google client id and secret from ([Google Cloud Console](https://console.cloud.google.com/))
```dotenv
GOOGLE_CLIENT_ID="your_google_client_id" 
GOOGLE_CLIENT_SECRET="your_google_client_secret" 
```

Then get the cloudinary bucket cloud_name, api_key, api_secret from ([Cloudinary](https://console.cloudinary.com/))

```dotenv
CLOUDINARY_CLOUD_NAME="your_cloudinary_name" 
CLOUDINARY_API_KEY="your_cloudinary_api_key" 
CLOUDINARY_API_SECRET="your_cloudinary_api_secret" 
```

Create a next_auth secret
```dotenv
NEXTAUTH_SECRET="your_nextauth_secret" 
```

Default redirect uri
```dotenv
YOUTUBE_REDIRECT_URI="http://localhost:3000" 
```

Migrate your database
```bash
pnpx prisma migrate dev --name "add-preffered-name"
```

Generate prisma client
```bash
pnpx prisma generate
```

Run the development server:

```bash
pnpm run dev
or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
