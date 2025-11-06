
-----


## fal-ai/workflow-utilities/auto-subtitle

Add automatic subtitles to videos

**Inference** | **Commercial use** | **Schema** | **LLMs** | **Playground** | **API**

### About

Automatically generate and add subtitles to video.

Uses speech-to-text to transcribe audio and adds karaoke-style subtitles with word-level highlighting. Supports multiple languages, Google Fonts, and customizable styling including animation effects.

This endpoint:

  * Extracts audio from video
  * Transcribes audio with word-level timing
  * Groups words into readable subtitle segments
  * Adds styled subtitles to video with customizable font and colors

## Table of contents

1.  [Calling the API](https://www.google.com/search?q=%231-calling-the-api)
      * [Install the client](https://www.google.com/search?q=%23install-the-client)
      * [Setup your API Key](https://www.google.com/search?q=%23setup-your-api-key)
      * [Submit a request](https://www.google.com/search?q=%23submit-a-request)
2.  [Authentication](https://www.google.com/search?q=%232-authentication)
      * [API Key](https://www.google.com/search?q=%23api-key)
3.  [Queue](https://www.google.com/search?q=%233-queue)
      * [Submit a request](https://www.google.com/search?q=%23submit-a-request-1)
      * [Fetch request status](https://www.google.com/search?q=%23fetch-request-status)
      * [Get the result](https://www.google.com/search?q=%23get-the-result)
4.  [Files](https://www.google.com/search?q=%234-files)
      * [Data URI (base64)](https://www.google.com/search?q=%23data-uri-base64)
      * [Hosted files (URL)](https://www.google.com/search?q=%23hosted-files-url)
      * [Uploading files](https://www.google.com/search?q=%23uploading-files)
5.  [Schema](https://www.google.com/search?q=%235-schema)
      * [Input](https://www.google.com/search?q=%23input)
      * [Output](https://www.google.com/search?q=%23output)
      * [Other types](https://www.google.com/search?q=%23other-types)

## 1\. Calling the API

### Install the client

The client provides a convenient way to interact with the model API.

```bash
npm install --save @fal-ai/client
```

> **Migrate to @fal-ai/client**
> The `@fal-ai/serverless-client` package has been deprecated in favor of `@fal-ai/client`. Please check the [migration guide](https://www.google.com/search?q=https://fal.ai/docs/reference/client-migration) for more information.

### Setup your API Key

Set `FAL_KEY` as an environment variable in your runtime.

```bash
export FAL_KEY="YOUR_API_KEY"
```

### Submit a request

The client API handles the API submit protocol. It will handle the request status updates and return the result when the request is completed.

```javascript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/workflow-utilities/auto-subtitle", {
  input: {
    video_url: "https://v3b.fal.media/files/b/kangaroo/oUCiZjQwEy6bIQdPUSLDF_output.mp4"
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});

console.log(result.data);
console.log(result.requestId);
```

## 2\. Authentication

The API uses an API Key for authentication. It is recommended you set the `FAL_KEY` environment variable in your runtime when possible.

### API Key

In case your app is running in an environment where you cannot set environment variables, you can set the API Key manually as a client configuration.

```javascript
import { fal } from "@fal-ai/client";
fal.config({
  credentials: "YOUR_FAL_KEY"
});
```

> **Protect your API Key**
> When running code on the client-side (e.g. in a browser, mobile app or GUI applications), make sure to not expose your **FAL\_KEY**. Instead, use a server-side proxy to make requests to the API. For more information, check out our [server-side integration guide](https://www.google.com/search?q=https://fal.ai/docs/guides/server-side-integration).

## 3\. Queue

### Long-running requests

For long-running requests, such as training jobs or models with slower inference times, it is recommended to check the **Queue status** and rely on **Webhooks** instead of blocking while waiting for the result.

### Submit a request

The client API provides a convenient way to submit requests to the model.

```javascript
import { fal } from "@fal-ai/client";

const { request_id } = await fal.queue.submit("fal-ai/workflow-utilities/auto-subtitle", {
  input: {
    video_url: "https://v3b.fal.media/files/b/kangaroo/oUCiZjQwEy6bIQdPUSLDF_output.mp4"
  },
  webhookUrl: "https://optional.webhook.url/for/results",
});
```

### Fetch request status

You can fetch the status of a request to check if it is completed or still in progress.

```javascript
import { fal } from "@fal-ai/client";

const status = await fal.queue.status("fal-ai/workflow-utilities/auto-subtitle", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b",
  logs: true,
});
```

### Get the result

Once the request is completed, you can fetch the result. See the [Output Schema](https://www.google.com/search?q=%23output) for the expected result format.

```javascript
import { fal } from "@fal-ai/client";

const result = await fal.queue.result("fal-ai/workflow-utilities/auto-subtitle", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b"
});

console.log(result.data);
console.log(result.requestId);
```

## 4\. Files

Some attributes in the API accept file URLs as input. Whenever that's the case you can pass your own URL or a Base64 data URI.

### Data URI (base64)

You can pass a Base64 data URI as a file input. The API will handle the file decoding for you. Keep in mind that for large files, this alternative although convenient can impact the request performance.

### Hosted files (URL)

You can also pass your own URLs as long as they are publicly accessible. Be aware that some hosts might block cross-site requests, rate-limit, or consider the request as a bot.

### Uploading files

We provide a convenient file storage that allows you to upload files and use them in your requests. You can upload files using the client API and use the returned URL in your requests.

```javascript
import { fal } from "@fal-ai/client";

const file = new File(["Hello, World!"], "hello.txt", { type: "text/plain" });
const url = await fal.storage.upload(file);
```

> **Auto uploads**
> The client will auto-upload the file for you if you pass a binary object (e.g. `File`, `Data`).
> Read more about file handling in our [file upload guide](https://www.google.com/search?q=https://fal.ai/docs/guides/file-uploads).

## 5\. Schema

### Input

| Field | Type | Required | Description | Default Value / Possible Enum Values |
| :--- | :--- | :--- | :--- | :--- |
| `video_url` | `string` | **\*required** | URL of the video file to add automatic subtitles to | None |
| `language` | `string` | | Language code for transcription (e.g., 'en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'ja', 'zh', 'ko') or 3-letter ISO code (e.g., 'eng', 'spa', 'fra') | Default: `"en"` |
| `font_name` | `string` | | Any Google Font name from [fonts.google.com](https://fonts.google.com) (e.g., 'Montserrat', 'Poppins', 'BBH Sans Hegarty') | Default: `"Montserrat"` |
| `font_size` | `integer` | | Font size for subtitles (TikTok style uses larger text) | Default: `100` |
| `font_weight` | `FontWeightEnum` | | Font weight (TikTok style typically uses bold or black) | Default: `"bold"`<br>Possible enum values: `normal`, `bold`, `black` |
| `font_color` | `FontColorEnum` | | Subtitle text color for non-active words | Default: `"white"`<br>Possible enum values: `white`, `black`, `red`, `green`, `blue`, `yellow`, `orange`, `purple`, `pink`, `brown`, `gray`, `cyan`, `magenta` |
| `highlight_color` | `HighlightColorEnum` | | Color for the currently speaking word (karaoke-style highlight) | Default: `"purple"`<br>Possible enum values: `white`, `black`, `red`, `green`, `blue`, `yellow`, `orange`, `purple`, `pink`, `brown`, `gray`, `cyan`, `magenta` |
| `stroke_width` | `integer` | | Text stroke/outline width in pixels (0 for no stroke) | Default: `3` |
| `stroke_color` | `StrokeColorEnum` | | Text stroke/outline color | Default: `"black"`<br>Possible enum values: `black`, `white`, `red`, `green`, `blue`, `yellow`, `orange`, `purple`, `pink`, `brown`, `gray`, `cyan`, `magenta` |
| `background_color` | `BackgroundColorEnum` | | Background color behind text ('none' or 'transparent' for no background) | Default: `"none"`<br>Possible enum values: `black`, `white`, `red`, `green`, `blue`, `yellow`, `orange`, `purple`, `pink`, `brown`, `gray`, `cyan`, `magenta`, `none`, `transparent` |
| `background_opacity` | `float` | | Background opacity (0.0 = fully transparent, 1.0 = fully opaque) | None |
| `position` | `PositionEnum` | | Vertical position of subtitles | Default: `"bottom"`<br>Possible enum values: `top`, `center`, `bottom` |
| `y_offset` | `integer` | | Vertical offset in pixels (positive = move down, negative = move up) | Default: `75` |
| `words_per_subtitle` | `integer` | | Maximum number of words per subtitle segment. Use 1 for single-word display, 2-3 for short phrases, or 8-12 for full sentences. | Default: `3` |
| `enable_animation` | `boolean` | | Enable animation effects for subtitles (bounce style entrance) | Default: `true` |

**Input Example:**

```json
{
  "video_url": "https://v3b.fal.media/files/b/kangaroo/oUCiZjQwEy6bIQdPUSLDF_output.mp4",
  "language": "en",
  "font_name": "Montserrat",
  "font_size": 100,
  "font_weight": "bold",
  "font_color": "white",
  "highlight_color": "purple",
  "stroke_width": 3,
  "stroke_color": "black",
  "background_color": "none",
  "position": "bottom",
  "y_offset": 75,
  "words_per_subtitle": 1,
  "enable_animation": true
}
```

### Output

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `video` | `File` | **\*required** | The video with automatic subtitles. |
| `transcription` | `string` | **\*required** | Full transcription text. |
| `subtitle_count` | `integer` | **\*required** | Number of subtitle segments generated. |

**Output Example:**

```json
{
  "video": {
    "file_size": 16789234,
    "file_name": "output.mp4",
    "content_type": "video/mp4",
    "url": "https://v3b.fal.media/files/b/monkey/HPBSoe-QsAxSIkDh7Zn76_output.mp4"
  },
  "transcription": "...",
  "subtitle_count": 42
}
```

### Other types

#### AudioFile

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `url` | `string` | **\*required** | URL of the audio file. |
| `content_type`| `string` | **\*required** | Content type of the audio file. |
| `file_name` | `string` | **\*required** | Name of the audio file. |
| `file_size` | `integer` | **\*required** | Size of the audio file in bytes. |

#### Image

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `url` | `string` | **\*required** | The URL where the file can be downloaded from. |
| `content_type`| `string` | | The mime type of the file. |
| `file_name` | `string` | | The name of the file. It will be auto-generated if not provided. |
| `file_size` | `integer` | | The size of the file in bytes. |
| `file_data` | `string` | | File data. |
| `width` | `integer` | | The width of the image in pixels. |
| `height` | `integer` | | The height of the image in pixels. |

#### File

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `url` | `string` | **\*required** | The URL where the file can be downloaded from. |
| `content_type`| `string` | | The mime type of the file. |
| `file_name` | `string` | | The name of the file. It will be auto-generated if not provided. |
| `file_size` | `integer` | | The size of the file in bytes. |
| `file_data` | `string` | | File data. |

#### SubtitleSegment

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `start` | `float` | **\*required** | Start time in seconds (e.g., 0.0 for beginning, 5.5 for 5.5 seconds). |
| `end` | `float` | **\*required** | End time in seconds (must be greater than start time). |
| `text` | `string` | **\*required** | Subtitle text to display (supports multiple lines with `<br>`). |

-----