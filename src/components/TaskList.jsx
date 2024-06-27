'use client';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTasksStore } from "@/store/global";
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
import { EditPanel } from "@/components/EditPanel";
import { getTaskStatus } from "@/app/actions";
import { Fragment } from "react";
import PublishVTTButton from "./PublishVTTButton";
import PublishAllButton from "./PublishAllButton";

export default function TaskList() {
  const { tasks, updateProgress, removeTask, setVideoVisible } = useTasksStore();

  const renderStatusText = (status) => {
    if (status === 0) {
      return '未开始';
    } else if (status === 1) {
      return '进行中';
    } else if (status === 2) {
      return '已完成';
    } else if (status === 3) {
      return '出错';
    }
  }

  return <div className="mt-4 rounded-xl border border-dashed border-cyan-300 p-4">
    <Table className="">
      {/* <TableCaption>任务信息</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead>任务ID</TableHead>
          <TableHead>视频数量</TableHead>
          <TableHead>进度</TableHead>
          <TableHead>状态</TableHead>
          <TableHead className="w-[300px]">视频名称</TableHead>
          <TableHead>插图</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-sm">
        {tasks.length === 0 && <TableRow>
          <TableCell colSpan="15"><div className="w-full my-16 text-center">没有历史任务</div></TableCell>
        </TableRow>}
        {tasks.reverse().map((task, index) => {
          return <Fragment key={task.id}>
            <TableRow key={task.id}>
              <TableCell className="font-medium text-sm">{task.id}</TableCell>
              <TableCell className="text-sm">{task.videos.length}</TableCell>
              <TableCell className="text-sm">{Number(task.progress.toFixed(2))}%</TableCell>
              <TableCell className="text-sm">{renderStatusText(task.status)}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="secondary" onClick={async () => {
                  const a = await getTaskStatus(task.ocr_id);
                  updateProgress(task.id, a.body.content);
                }}>刷新进度</Button>
                <Button variant="secondary" onClick={() => setVideoVisible(task.id, !task.video_visible)}>
                  {task.video_visible ? '收缩' : '展开'}
                </Button>
                <PublishAllButton task={task} />
                <Button variant="secondary" onClick={() => {
                  removeTask(task.id);
                }}>删除任务</Button>
              </TableCell>
            </TableRow>
            {task.video_visible && task.videos.map(video => <TableRow key={`${task.id}-${video.id}`}>
              <TableCell className="text-sm">{video.id}</TableCell>
              <TableCell className="text-sm"></TableCell>
              <TableCell className="text-sm">{video.progress || 0}%</TableCell>
              <TableCell className="text-sm"></TableCell>
              <TableCell className="text-sm">{video.name}</TableCell>
              <TableCell><img className="w-8" src={video.url} /></TableCell>
              <TableCell className="text-right space-x-2 text-xs">
                <PublishVTTButton task={task} video={video} />
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="text-xs" variant="secondary" disabled={video.progress < 100}>编辑</Button>
                  </SheetTrigger>
                  <SheetContent className="w-4/5 flex flex-col">
                    <SheetHeader>
                      <SheetTitle>编辑字幕</SheetTitle>
                      <SheetDescription>
                        可在左侧面板第三栏编辑相应字幕，请注意，编辑后不需保存即时生效
                      </SheetDescription>
                    </SheetHeader>
                    <EditPanel file={video} task={task} />
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button>关闭窗口</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </TableCell>
            </TableRow>)}
          </Fragment>;
        })}
      </TableBody>
    </Table>
  </div>
}