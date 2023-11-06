# Finance

Finance is a personal dashboard to help me log and aggregate my financial data from various sources.

## The Idea

I need to collect statements from various places where API access (like Plaid) is not easily available. However, all this information still needs to be itemized and logged on a monthly basis.

`Finance` allows me to upload different kinds of statements and use OCR & ChatGPT to extract data from them. Then, I can record all my expenses and invoices to make sure I don't overspend.

## Note:

The following environment variables must be configured in the Next.JS app:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

The IAM user configured with those credentials must have access to S3 and Textract. The bucket itself must ahve the following CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```
