'use client';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTasksStore } from "@/store/global";
import { Page } from "./Page";
import { toast } from "sonner";

export default function SiteVideoList({ data }) {
  const { temporary_videos, addTemporaryVideo } = useTasksStore(store => ({
    addTemporaryVideo: store.addTemporaryVideo,
    temporary_videos: store.temporary_videos
  }));


  const handleAddVideo = (video) => {
    addTemporaryVideo({
      id: video.id,
      name: video.name,
      url: video.image,
      video: video.video,
      data: {
        audio_vtt: null,
        ocr_vtt: null,
      }
    });
    toast.success('添加成功', {
      description: `${video.id} 已添加到队列`
    });
  }

  return <div className="mt-4 rounded-xl border border-dashed border-cyan-300 p-4">
    <Table className="">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead className="w-[300px]">剧集</TableHead>
          <TableHead className="w-[300px]">视频名称</TableHead>
          <TableHead>插图</TableHead>
          {/* <TableHead>视频文件</TableHead> */}
          <TableHead>已上传字幕</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-sm">
        {data.data.map((video, index) => (<TableRow key={video.id}>
          <TableCell className="font-medium text-sm">{`${video.vid}-${index}`}</TableCell>
          <TableCell className="font-medium text-sm">{video?.videox?.title}</TableCell>
          <TableCell className="font-medium text-sm">{video.name}</TableCell>
          <TableCell><img className="w-12" src={video.image} /></TableCell>
          {/* <TableCell>{video.vid}</TableCell> */}
          <TableCell>{video.subtitles ? (
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">已上传</span>
          ) : (
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">未上传</span>
          )}</TableCell>
          <TableCell className="text-right space-x-2">
            {temporary_videos.length > 0 && temporary_videos.find((item) => item.id === video.id) ? (
              <Button variant="secondary" className="bg-green-500 text-white hover:bg-green-300" >已添加</Button>
            ) : (
              <Button variant="secondary" onClick={() => handleAddVideo(video)}>添加到队列</Button>
            )}
          </TableCell>
        </TableRow>))}
      </TableBody>
    </Table>
    <Page paginator={data} />
  </div>
}