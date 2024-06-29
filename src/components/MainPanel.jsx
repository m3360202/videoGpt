'use client';

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { downloadVTT, mergeCues, parseVTT, randomString, stringifyVTT } from "@/lib/utils";
import { useTasksStore, useBasicSettings } from "@/store/global";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { EditPanel } from "@/components/EditPanel";
import { subtitles } from "@/lib/test";
import { getTaskStatus, postOcrTask } from "@/app/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fragment, useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import TaskList from "./TaskList";
import VideoList from "./VideoList";
import SiteVideoList from "./SiteVideoList";
import { toast } from "sonner";

export default function MainPanel({ data }) {
  const { temporary_videos, tasks } = useTasksStore();
  const { style, fromLanguage, toLanguage, updateSetting } = useBasicSettings();

  // const handleChangeFiles = (e) => {
  //   console.log(e.target.files);
  //   Array.from(e.target.files).map((file) => addTask({
  //     id: randomString(),
  //     name: file.name,
  //     url: URL.createObjectURL(file),
  //     size: file.size,
  //     type: file.type,
  //     lastModified: file.lastModified,
  //     lastModifiedDate: file.lastModifiedDate,
  //     webkitRelativePath: file.webkitRelativePath,
  //     data: {
  //       audio_vtt: parseVTT(subtitles),
  //       ocr_vtt: parseVTT(subtitles),
  //     }
  //   }));
  // }

  const handleChangeStyle = (e) => {
    console.log(e.target.value);
    updateSetting('style', e.target.value);
  }

  // const handleDownload = (file) => {
  //   const vtt = mergeCues(file.data.audio_vtt, file.data.ocr_vtt);
  //   downloadVTT(stringifyVTT(vtt), file.name + '.vtt');
  // }

  return <div className="mt-8">
    <div className="">
      <div className="text-xl font-bold">AI短视频智能二创</div>
      <div className="mt-1">字幕翻译生成,字幕时间轴自动校验,OCR字幕提纯翻译,纯机器值守</div>
    </div>
    <div className="mt-6  p-8 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-fuchsia-300 grid grid-cols-2 gap-8">
      <div className="p-6 bg-white rounded-lg flex flex-col items-center">
        {/* <div className="text-slate-500">原始视频上传</div>
        <div className="text-slate-500">视频大小小于 5m,时长2-5分钟最佳</div>
        <div className="border border-dashed border-cyan-300 rounded-lg p-6 bg-cyan-50 flex-1 w-full mt-6 flex flex-col items-center justify-center text-cyan-500 relative">
          <div>点击添加视频文件</div>
          <div>支持mp4 mov格式</div>
          <input
            type="file"
            className="absolute opacity-0 size-full cursor-pointer"
            // onChange={handleChangeFiles}
            multiple
          />
        </div> */}
        {/* <div> */}
          <div className="mb-1">转译风格</div>
          <Textarea value={style} onChange={handleChangeStyle} />
        {/* </div> */}
      </div>
      <div className="p-6 bg-white rounded-lg space-y-3">
        
        <div className="flex flex-row items-center space-x-3">
          <div>原片语言</div>
          <Select value={fromLanguage} onValueChange={() => {
            toast.error('暂不支持');
          }}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="选择语言" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='zh-CN'>中文 zh-CN</SelectItem>
              <SelectItem value='en-US'>美式英语 en-US</SelectItem>
              <SelectItem value='en-GB'>英式英语 en-GB</SelectItem>
              <SelectItem value='fr-FR'>法语 fr-FR</SelectItem>
              <SelectItem value='es-ES'>西班牙语 es-ES</SelectItem>
              <SelectItem value='de-DE'>德语 de-DE</SelectItem>
              <SelectItem value='it-IT'>意大利语 it-IT</SelectItem>
              <SelectItem value='ja-JP'>日语 ja-JP</SelectItem>
              <SelectItem value='ko-KR'>韩语 ko-KR</SelectItem>
              <SelectItem value='ru-RU'>俄语 ru-RU</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row items-center space-x-3">
          <div>目标语言</div>
          <Select value={toLanguage} onValueChange={() => {
            toast.error('暂不支持');
          }}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="选择语言" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='en-US'>美式英语 en-US</SelectItem>
              <SelectItem value='en-GB'>英式英语 en-GB</SelectItem>
              <SelectItem value='fr-FR'>法语 fr-FR</SelectItem>
              <SelectItem value='es-ES'>西班牙语 es-ES</SelectItem>
              <SelectItem value='de-DE'>德语 de-DE</SelectItem>
              <SelectItem value='it-IT'>意大利语 it-IT</SelectItem>
              <SelectItem value='ja-JP'>日语 ja-JP</SelectItem>
              <SelectItem value='ko-KR'>韩语 ko-KR</SelectItem>
              <SelectItem value='ru-RU'>俄语 ru-RU</SelectItem>
              <SelectItem value='zh-CN'>中文 zh-CN</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
    <Tabs defaultValue="site_videos" className="mt-8 w-full flex-1">
      <TabsList className="">
        <TabsTrigger value="site_videos">待转换视频</TabsTrigger>
        <TabsTrigger value="task_videos">队列视频 ({temporary_videos.length})</TabsTrigger>
        <TabsTrigger value="all_tasks">所有任务 ({tasks.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="site_videos" className="flex-1">
        <SiteVideoList data={data} />
      </TabsContent>
      <TabsContent value="task_videos" className="flex-1">
        <VideoList />
      </TabsContent>
      <TabsContent value="all_tasks" className="flex-1">
        <div className="mt-6 text-sm text-red-500">* 请及时清理历史任务</div>
        <TaskList />
      </TabsContent>
    </Tabs>
  </div>
}