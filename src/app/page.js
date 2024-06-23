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

export default function Home() {
  const { tasks, addTask, removeTask } = useTasksStore();
  const { style, fromLanguage, toLanguage, updateSetting } = useBasicSettings();

  const handleChangeFiles = (e) => {
    console.log(e.target.files);
    Array.from(e.target.files).map((file) => addTask({
      id: randomString(),
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      webkitRelativePath: file.webkitRelativePath,
      data: {
        audio_vtt: parseVTT(subtitles),
        ocr_vtt: parseVTT(subtitles),
      }
    }));
  }

  const handleChangeStyle = (e) => {
    console.log(e.target.value);
    updateSetting('style', e.target.value);
  }

  const handleDownload = (file) => {
    const vtt = mergeCues(file.data.audio_vtt, file.data.ocr_vtt);
    downloadVTT(stringifyVTT(vtt), file.name + '.vtt');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <header className="w-full border-b border-b-slate-200">
        <div className="max-w-screen-xl mx-auto flex flex-row items-center justify-between py-3">
          <h1 className="text-2xl font-bold">Video GPT</h1>
          <div className="flex flex-row items-center space-x-2">
            <Button>Hyper GPT</Button>
          </div>
        </div>
      </header>
      <div className="max-w-screen-xl mx-auto w-full flex-1 my-4 flex flex-col">
        <div className="mt-8">
          <div className="">
            <div className="text-xl font-bold">AI短视频智能二创</div>
            <div className="mt-1">字幕翻译生成,字幕时间轴自动校验,OCR字幕提纯翻译,纯机器值守</div>
          </div>
          <div className="mt-6  p-8 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-fuchsia-300 grid grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-lg flex flex-col items-center">
              <div className="text-slate-500">原始视频上传</div>
              <div className="text-slate-500">视频大小小于 5m,时长2-5分钟最佳</div>
              <div className="border border-dashed border-cyan-300 rounded-lg p-6 bg-cyan-50 flex-1 w-full mt-6 flex flex-col items-center justify-center text-cyan-500 relative">
                <div>点击添加视频文件</div>
                <div>支持mp4 mov格式</div>
                <input
                  type="file"
                  className="absolute opacity-0 size-full cursor-pointer"
                  onChange={handleChangeFiles}
                  multiple
                />
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg space-y-3">
              <div>
                <div className="mb-1">转译风格</div>
                <Textarea value={style} onChange={handleChangeStyle} />
              </div>
              <div className="flex flex-row items-center space-x-3">
                <div>原片语言</div>
                <Select value={fromLanguage} >
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
                <Select value={toLanguage}>
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
              <div className="pt-4 flex flex-row-reverse items-center gap-3">
                <Button>开始转译</Button>
                <Button variant="secondary">重置所有</Button>
              </div>
            </div>
          </div>
          <div className="mt-8 rounded-xl border border-dashed border-cyan-300 p-4">
            <Table className="">
              {/* <TableCaption>任务信息</TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">视频名称</TableHead>
                  <TableHead>大小</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-sm">
                {tasks.map((task, index) => (<TableRow key={task.id}>
                  <TableCell className="font-medium text-sm">{task.name}</TableCell>
                  <TableCell>{task.size}</TableCell>
                  <TableCell><img src={task.url} /></TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="secondary" onClick={() => handleDownload(task)}>下载</Button>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="secondary">编辑</Button>
                      </SheetTrigger>
                      <SheetContent className="w-4/5 flex flex-col">
                        <SheetHeader>
                          <SheetTitle>编辑字幕</SheetTitle>
                          <SheetDescription>
                            可在左侧面板第三栏编辑相应字幕，请注意，编辑后不需保存即时生效
                          </SheetDescription>
                        </SheetHeader>
                        <EditPanel file={task} />
                        <SheetFooter>
                          <SheetClose asChild>
                            <Button>关闭窗口</Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                    <Button variant="secondary" onClick={() => {
                      removeTask(task.id);
                    }}>删除</Button>
                  </TableCell>
                </TableRow>))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <footer className="max-w-screen-xl mx-auto flex flex-row items-center justify-center py-4">
        Coded by <a href="#" className="ml-2 underline">重庆爱望科技有限公司</a>
      </footer>
    </main>
  );
}
