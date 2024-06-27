'use server'

import { appKey, appSecret, execOcrTask, my_md5 } from "@/lib/cut"
import { stringifyVTT, uploadFile } from "@/lib/utils";
import { VideoEpisode } from "@/sutando";
import axios from "axios";

export async function postOcrTask(tasks) {
  return await execOcrTask(tasks);
}

export async function getTaskStatus(taskId) {
  const url = "https://api.zhaoli.com/v-w-c/gateway/ve/work/status";

  let body = JSON.stringify({
    "idProjects": [taskId],
  });

  let sign = my_md5(my_md5(body) + appSecret);
  console.log(sign);

  // Post with axios
  const instance = axios.create({
    headers: {
      'Content-type': 'application/json',
      'AppKey': appKey,
      'AppSign': sign,
    }
  });

  const response = await instance.post(url, body);
  console.log(response.data);
  return response.data;
}

export async function publishVTT(id, filename, vtt) {
  const buffer = Buffer.from(stringifyVTT(vtt));
  await uploadFile(filename, buffer);
  await VideoEpisode.query().where("id", id).update({
    subtitles: `https://duanjutv2.oss-cn-hongkong.aliyuncs.com${filename}`,
  });
  return true;
}

export async function publishAllVTT(vtts) {
  return await Promise.all(vtts.map((vtt) => publishVTT(vtt.id, vtt.name, vtt.cues)));
}