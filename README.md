This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app@latest`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, get a postgres database url.
Paste it inplace of

<pre> ```dotenv 
DATABASE_URL="postgresql://user:password@host:port/database" 
</pre>

Then get google client id and secret from ([Google Cloud Console](https://console.cloud.google.com/))
<pre> ```dotenv
GOOGLE_CLIENT_ID="your_google_client_id" 
GOOGLE_CLIENT_SECRET="your_google_client_secret" 
</pre>

Then get the cloudinary bucket cloud_name, api_key, api_secret from ([Cloudinary](https://console.cloudinary.com/))

<pre> ```dotenv
CLOUDINARY_CLOUD_NAME="your_cloudinary_name" 
CLOUDINARY_API_KEY="your_cloudinary_api_key" 
CLOUDINARY_API_SECRET="your_cloudinary_api_secret" 
</pre>

Create a next_auth secret
<pre> ```dotenv
NEXTAUTH_SECRET="your_nextauth_secret" 
</pre>

Default redirect uri
<pre> ```dotend
YOUTUBE_REDIRECT_URI="http://localhost:3000" ``` 
</pre>

Migrate database
```bash
pnpx prisma migrate dev --name "init"
```

Generate prisma client
```bash
pnpx prisma genereate
```

run the development server:

```bash
pnpm run dev
# or
pnpm dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
