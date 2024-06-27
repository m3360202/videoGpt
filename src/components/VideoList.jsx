'use client';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { randomString } from "@/lib/utils";
import { useTasksStore } from "@/store/global";
import { postOcrTask } from "@/app/actions";
import { useState } from "react";
import { LoaderCircleIcon } from "lucide-react";

export default function VideoList() {
  const { addTask, removeTemporaryVideo, temporary_videos, resetTemporaryVideos } = useTasksStore();
  const [starting, setStarting] = useState(false);

  const handleStartTask = async () => {
    if (temporary_videos.length === 0) {
      return;
    }

    if (starting) {
      return;
    }

    setStarting(true);
    const ocrRes = await postOcrTask(temporary_videos);
    // const res = await postAudioTask(tasks);
    console.log(ocrRes);
    addTask({
      id: randomString(),
      ocr_id: ocrRes?.body?.idProject,
      audio_id: null,
      progress: 0,
      videos: temporary_videos,
    });

    resetTemporaryVideos();
    setStarting(false);
  }

  const handleRemoveVideo = (video) => {
    removeTemporaryVideo(video);
  }
  
  return <>
    <div className="pt-4 flex flex-row-reverse items-center gap-3">
      <Button onClick={handleStartTask} disabled={starting}>
        {starting && <LoaderCircleIcon className="w-4 h-4 animate-spin mr-2" />}
        开始任务
      </Button>
      <Button variant="secondary" onClick={resetTemporaryVideos}>清空队列</Button>
    </div>
    <div className="mt-8 rounded-xl border border-dashed border-cyan-300 p-4">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">视频名称</TableHead>
            <TableHead>插图</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-sm">
          {temporary_videos.length === 0 && <TableRow>
            <TableCell colSpan="5"><div className="w-full my-16 text-center">队列中还没有添加视频</div></TableCell>
          </TableRow>}
          {temporary_videos.map((video, index) => (<TableRow key={video.id}>
            <TableCell className="font-medium text-sm">{video.name}</TableCell>
            <TableCell><img className="w-12" src={video.url} /></TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="secondary" onClick={() => {
                handleRemoveVideo(video);
              }}>移出队列</Button>
            </TableCell>
          </TableRow>))}
        </TableBody>
      </Table>
    </div>
  </>
}