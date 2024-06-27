'use client';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTasksStore } from "@/store/global";
import { Page } from "./Page";

export default function SiteVideoList({ data }) {
  const { addTemporaryVideo } = useTasksStore(store => ({
    addTemporaryVideo: store.addTemporaryVideo
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
  }

  return <div className="mt-4 rounded-xl border border-dashed border-cyan-300 p-4">
    <Table className="">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead className="w-[300px]">视频名称</TableHead>
          <TableHead>插图</TableHead>
          {/* <TableHead>视频文件</TableHead> */}
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-sm">
        {data.data.map((video, index) => (<TableRow key={video.id}>
          <TableCell className="font-medium text-sm">{video.id}</TableCell>
          <TableCell className="font-medium text-sm">{video.name}</TableCell>
          <TableCell><img className="w-12" src={video.image} /></TableCell>
          {/* <TableCell>{video.video}</TableCell> */}
          <TableCell className="text-right space-x-2">
            <Button variant="secondary" onClick={() => handleAddVideo(video)}>添加到队列</Button>
          </TableCell>
        </TableRow>))}
      </TableBody>
    </Table>
    <Page paginator={data} />
  </div>
}