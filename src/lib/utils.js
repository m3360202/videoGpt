import OSS from "ali-oss"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function randomString(len = 16) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export async function getVideoMergedCues(vtt_urls) {
  const res1 = await fetch(vtt_urls[0]).then(res => res.text());
  const ocr_introduce_vtt = parseVTT(convertSrtToVtt(res1), (text) => `(ps: ${text})`);
  const res2 = await fetch(vtt_urls[1]).then(res => res.text());
  const ocr_subtitle_vtt = parseVTT(convertSrtToVtt(res2));
  return mergeCues(ocr_introduce_vtt, ocr_subtitle_vtt);
}

export function parseVTT(vttText, callback) {
  const lines = vttText.split('\n');
  const cues = [];
  let currentTime, currentText;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for cue start time and end time
    if (line.match(/-->/)) {
      const times = line.split(/ --> /);
      if (times.length == 2) {
        currentTime = {
          start: times[0],
          end: times[1]
        };
      }
    }
    // Check for cue text
    else if (currentTime && line.length > 0) {
      // 如果一行出现12个连续数字(备案号)，跳过
      if (containsEightConsecutiveDigits(line)) {
        continue;
      }

      // 如果字数太长，换行
      console.log('insertLineBreaks', 30);
      const newLine = insertLineBreaks(line, 30);
      currentText = currentText ? currentText + '\n' + newLine : newLine;
    }
    // Check for empty line
    else if (line.length === 0 && currentTime && currentText) {
      cues.push({
        time: currentTime,
        text: callback ? callback(currentText) : currentText
      });
      currentTime = null;
      currentText = null;
    }
  }

  return cues;
}

function insertLineBreaks(text, maxLineLength) {
  let result = '';
  while (text.length > maxLineLength) {
      let index = text.lastIndexOf(' ', maxLineLength);
      if (index === -1) {
          index = maxLineLength;
      }
      result += text.substring(0, index) + '\n';
      text = text.substring(index).trim();
  }
  result += text;
  return result;
}

export function mergeCues(cues1, cues2) {
  // Concatenate the two arrays
  const merged = cues1.concat(cues2);

  // Sort the merged array by start time
  merged.sort(function(a, b) {
    // Convert the start times to seconds for comparison
    const aTime = convertTimeToSeconds(a.time.start);
    const bTime = convertTimeToSeconds(b.time.start);

    return aTime - bTime;
  });

  return merged;
}

// Convert a VTT time string (HH:MM:SS.sss) to seconds
export function convertTimeToSeconds(timeString) {
  const parts = timeString.split(':');
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parseFloat(parts[2]);

  return hours * 3600 + minutes * 60 + seconds;
}


export function stringifyVTT(cues) {
  let vttText = 'WEBVTT\n\n';

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    vttText += cue.time.start + ' --> ' + cue.time.end;
    vttText += cue.text.startsWith('(ps') ? ' line:70%' : ' line:80%';
    vttText += '\n' + cue.text + '\n\n';
  }

  return vttText;
}

export function containsEightConsecutiveDigits(str) {
  const regex = /\d{12}/;
  return regex.test(str);
}

export function downloadVTT(vttText, filename) {
  // Create a new Blob object using the
  // result of the stringifyVTT function
  const blob = new Blob([vttText], {type: 'text/vtt'});

  // Create a link element
  const a = document.createElement('a');

  // Use URL.createObjectURL() to create a URL for the Blob object
  a.href = URL.createObjectURL(blob);

  // Set the download attribute of the link to the desired file name
  a.download = filename;

  // Trigger the download by simulating a click on the link
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function convertSrtToVtt(srtContent) {
  // 添加WEBVTT标记
  let vttContent = 'WEBVTT\n\n' + srtContent;

  // 将时间戳中的","替换为"."
  vttContent = vttContent.replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '\$1.\$2');

  // 返回VTT内容
  return vttContent;
}

const OSS_ACCESS_KEY_ID = 'LTAI5tPUSkKTuV7XymsBYj67';
const OSS_ACCESS_KEY_SECRET = 'X4BF2An7xqo0YhOYXmRlixC2dlq9bG';

const client = new OSS({
  region: 'oss-cn-hongkong', // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
  accessKeyId: OSS_ACCESS_KEY_ID, // 确保已设置环境变量OSS_ACCESS_KEY_ID。
  accessKeySecret: OSS_ACCESS_KEY_SECRET, // 确保已设置环境变量OSS_ACCESS_KEY_SECRET。
  bucket: 'duanjutv2', // 示例：'my-bucket-name'，填写存储空间名称。
});

export async function uploadFile(name, file) {
  try {
    const uploadResult = await client.put(name, file);
    // console.log('上传成功:', uploadResult);
    return uploadResult;
  } catch (error) {
    throw new Error(error.message);
    // console.error('发生错误:', error);
  }
}
