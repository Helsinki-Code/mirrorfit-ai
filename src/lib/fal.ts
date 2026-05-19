const FAL_BASE = "https://fal.run";

type FalImage = {
  url: string;
  width?: number;
  height?: number;
  content_type?: string;
  file_name?: string;
};

type FalResponse = {
  images?: FalImage[];
};

function getFalHeaders() {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("Missing FAL_KEY");
  return {
    Authorization: `Key ${key}`,
    "Content-Type": "application/json",
  };
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 45_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function runFalGptImage2Edit(input: {
  prompt: string;
  imageUrls: string[];
}) {
  const response = await fetchWithTimeout(`${FAL_BASE}/openai/gpt-image-2/edit`, {
    method: "POST",
    headers: getFalHeaders(),
    body: JSON.stringify({
      prompt: input.prompt,
      image_urls: input.imageUrls,
      image_size: "auto",
      quality: "auto",
      num_images: 1,
      output_format: "png",
    }),
  });
  const payload = (await response.json()) as FalResponse;
  if (!response.ok || !payload.images?.[0]?.url) {
    throw new Error(
      `fal.openai.gpt-image-2.edit failed (${response.status}): ${JSON.stringify(payload).slice(
        0,
        400,
      )}`,
    );
  }
  return payload.images[0].url;
}

export async function runFalNanoBananaEdit(input: {
  prompt: string;
  imageUrls: string[];
}) {
  const response = await fetchWithTimeout(`${FAL_BASE}/fal-ai/nano-banana-pro/edit`, {
    method: "POST",
    headers: getFalHeaders(),
    body: JSON.stringify({
      prompt: input.prompt,
      image_urls: input.imageUrls,
      num_images: 1,
      output_format: "png",
      aspect_ratio: "auto",
      resolution: "1K",
      safety_tolerance: "4",
      limit_generations: true,
      enable_web_search: false,
    }),
  });
  const payload = (await response.json()) as FalResponse;
  if (!response.ok || !payload.images?.[0]?.url) {
    throw new Error(
      `fal.nano-banana.edit failed (${response.status}): ${JSON.stringify(payload).slice(0, 400)}`,
    );
  }
  return payload.images[0].url;
}

export async function runFalReveEdit(input: { prompt: string; imageUrl: string }) {
  const response = await fetchWithTimeout(`${FAL_BASE}/fal-ai/reve/edit`, {
    method: "POST",
    headers: getFalHeaders(),
    body: JSON.stringify({
      prompt: input.prompt,
      image_url: input.imageUrl,
      num_images: 1,
      output_format: "png",
    }),
  });
  const payload = (await response.json()) as FalResponse;
  if (!response.ok || !payload.images?.[0]?.url) {
    throw new Error(
      `fal.reve.edit failed (${response.status}): ${JSON.stringify(payload).slice(0, 400)}`,
    );
  }
  return payload.images[0].url;
}
