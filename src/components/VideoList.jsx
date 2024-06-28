'use client';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { randomString } from "@/lib/utils";
import { useTasksStore } from "@/store/global";
import { postOcrTask } from "@/app/actions";
import { useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "./ui/slider";

export default function VideoList() {
  const { addTask, removeTemporaryVideo, temporary_videos, resetTemporaryVideos, ocrRegion, setOcrRegion } = useTasksStore();
  const [starting, setStarting] = useState(false);

  const handleStartTask = async () => {
    if (temporary_videos.length === 0) {
      toast.error('队列中还没有添加视频');
      return;
    }

    if (starting) {
      return;
    }

    setStarting(true);
    const ocrRes = await postOcrTask(temporary_videos, ocrRegion);
    // const res = await postAudioTask(tasks);
    console.log(ocrRes);
    addTask({
      id: randomString(),
      ocr_introduce_id: ocrRes?.[0]?.body?.idProject,
      ocr_subtitle_id: ocrRes?.[1]?.body?.idProject,
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
    <div className="mt-8 rounded-xl border border-dashed border-cyan-300 p-4 flex flex-row gap-3">
      <div className="w-[300px] mb-4">
        <div className="flex flex-col text-sm h-[526px]">
          <div className={`text-cyan-600 bg-cyan-50 flex items-center justify-center`} style={{
            height: `${ocrRegion}%`
          }}>出场介绍区 ({ocrRegion}%)</div>
          <div className="flex-1 text-fuchsia-600 bg-fuchsia-50 flex items-center justify-center">视频字幕区</div>
        </div>
        <div className="text-sm mt-4 mb-2">区域调整</div>
        <Slider value={[ocrRegion]} max={100} step={1} onValueChange={value => setOcrRegion(value[0])} />
      </div>
      <Table className="flex-1">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
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
            <TableCell className="font-medium text-sm">{video.id}</TableCell>
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