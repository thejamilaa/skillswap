import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export function getR2Client() {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

export async function uploadToR2(
  file: File,
  folder = 'avatars'
): Promise<{ url?: string; error?: string }> {
  try {
    const s3 = getR2Client()
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'skillswap-avatars'
    const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL

    if (!s3 || !publicUrl) {
      return {
        error:
          'Cloudflare R2 konfiguratsiyasi toliq emas (.env.local da CLOUDFLARE_R2_* sozlamalarini tekshiring)',
      }
    }

    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type || 'image/jpeg',
    })

    await s3.send(command)

    const cleanPublicUrl = publicUrl.replace(/\/$/, '')
    const finalUrl = `${cleanPublicUrl}/${fileName}`

    return { url: finalUrl }
  } catch (err: any) {
    console.error('R2 upload error:', err)
    return { error: 'Rasm yuklashda xatolik: ' + (err.message || 'Nomaʼlum xatolik') }
  }
}
