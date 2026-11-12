import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { render } from 'react-email';
import PurchaseReceiptEmail, {
  purchaseReceiptPreviewProps,
} from '../email/purchase-receipt';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

async function main() {
  const port = Number(process.env.PORT) || 3001;
  const origin = `http://localhost:${port}`;
  process.env.NEXT_PUBLIC_SERVER_URL = origin;

  const html = await render(
    <PurchaseReceiptEmail {...purchaseReceiptPreviewProps} />
  );
  const publicDir = path.resolve(process.cwd(), 'public');

  createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0] || '/');

    if (urlPath !== '/') {
      const filePath = path.resolve(publicDir, `.${urlPath}`);
      if (
        !filePath.startsWith(publicDir) ||
        !existsSync(filePath) ||
        !statSync(filePath).isFile()
      ) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] ?? 'application/octet-stream',
      });
      createReadStream(filePath).pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
    });
    res.end(html);
  }).listen(port, () => {
    console.log(`Purchase receipt preview: ${origin}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
