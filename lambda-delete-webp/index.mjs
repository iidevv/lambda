import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const S3 = new S3Client();
const DEST_BUCKET = process.env.DEST_BUCKET;

export const handler = async (event, context) => {
  const { eventName, s3 } = event.Records[0];
  const srcBucket = s3.bucket.name;
  const srcKey = decodeURIComponent(s3.object.key.replace(/\+/g, " "));

  console.log(`Event triggered: ${eventName} - ${srcBucket}/${srcKey}`);

  if (eventName === "ObjectRemoved:Delete") {
    try {
      // Replace the extension with .webp to find the corresponding WebP image in the destination bucket
      const webpKey = srcKey.replace(/\.[^/.]+$/, ".webp");

      // Delete the corresponding WebP image from the destination bucket
      await S3.send(
        new DeleteObjectCommand({
          Bucket: DEST_BUCKET,
          Key: webpKey,
        })
      );

      console.log(`Successfully deleted WebP image: ${DEST_BUCKET}/${webpKey}`);
    } catch (error) {
      console.error(`Failed to delete WebP image: ${error}`);
    }
  }
};
