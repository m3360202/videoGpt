import crypto from 'crypto';
import axios from 'axios';

export const appKey = "e28fcc5b293946e99077d2785b3f3bcc";
export const appSecret = "913a5a698422412fbf5c0adef0fd515b";

const url = "https://api.zhaoli.com/v-w-c/gateway/ve/work/free";

export function my_md5(str) {
  const md5 = crypto.createHash('md5');
  return md5.update(str).digest('hex');
}

export async function execOcrTask(tasks) {
  let body = JSON.stringify({
    "urls": tasks.map(task => task.video),
    "videoInpaintLang": "zh",
    "lang": "en",
    "needChineseOcclude": 14,
  });

  let sign = my_md5(my_md5(body) + appSecret);
  // console.log(sign);

  // Post with axios
  const instance = axios.create({
    headers: {
      'Content-type': 'application/json',
      'AppKey': appKey,
      'AppSign': sign,
    }
  });

  const response = await instance.post(url, body);
  // console.log(response.data);
  return response.data;
}

