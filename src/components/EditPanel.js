"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { convertTimeToSeconds, parseVTT, randomString } from "@/lib/utils";
import { useTasksStore, useBasicSettings } from "@/store/global";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrashIcon, ClockIcon, HashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function EditPanel({ file }) {
  const videoRef = useRef();
  const { updateTaskVTT } = useTasksStore();
  const [tab, setTab] = useState('audio');
  const [metadataLoaded, setMetadataLoaded] = useState(false);

  // useEffect(() => {
  //   updateVideoVTT('start');
  // }, []);

  useEffect(() => {
    if (tab && metadataLoaded) {
      updateVideoVTT('auto');
    }
  }, [tab, metadataLoaded]);

  const handleUpdateVTT = (index, value) => {
    file.data[`${tab}_vtt`][index].text = value;
    updateTaskVTT(file.id, `${tab}_vtt`, file.data[`${tab}_vtt`]);
    updateVideoVTT();
  }

  const handleDeleteVTT = (index) => {
    file.data[`${tab}_vtt`].splice(index, 1);
    updateTaskVTT(file.id, `${tab}_vtt`, file.data[`${tab}_vtt`]);
    updateVideoVTT();
  }

  const handleTabChange = (tab) => {
    setTab(tab);
  }

  const handleMetadataLoad = () => {
    setMetadataLoaded(true);
  };

  const updateVideoVTT = (tag = '') => {
    if (!metadataLoaded) return;
    const video = videoRef.current;

    // Clear existing tracks
    const track = video.textTracks[0];
    while (track?.cues?.length > 0) {
      track.removeCue(track.cues[0]);
    }

    // Add new cues
    file?.data?.[`${tab}_vtt`]?.forEach(cue => {
      const startSeconds = convertTimeToSeconds(cue.time.start);
      const endSeconds = convertTimeToSeconds(cue.time.end);
      const vttCue = new VTTCue(startSeconds, endSeconds, cue.text);
      track.addCue(vttCue);
    });
  }

  return (
    <div className="flex-1 my-6 p-8 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-fuchsia-300 grid grid-cols-2 gap-8 relative">
      <div className="p-6 bg-white rounded-lg flex flex-col items-center flex-1 overflow-y-auto h-[calc(100vh-280px)] ">
        <Tabs defaultValue="audio" value={tab} onValueChange={handleTabChange} className="w-full flex-1 flex flex-col">
          <TabsList className="absolute top-12 z-10">
            <TabsTrigger value="audio">对白字幕</TabsTrigger>
            <TabsTrigger value="ocr">场景字幕</TabsTrigger>
          </TabsList>
          <TabsContent value="audio" className="mt-12 flex-1 direction-vertical border divide-y">
            {file.data.audio_vtt.map((item, index) => <div className="relative h-20" key={index}>
              <div className="flex h-full items-center">
                <div className="flex h-full w-7 flex-col items-center justify-between border-r border-gray-200 py-3 text-base text-black/40">
                  <div className="flex w-full cursor-pointer justify-center transition hover:text-black active:scale-90" onClick={() => handleDeleteVTT(index)}>
                    <TrashIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="hidden h-full w-[7.7rem] flex-col items-start justify-between border-r border-gray-200 p-2 text-[13px] text-black/70 lg:flex">
                  <div className="flex w-full items-center gap-1">
                    <div className="flex w-3 justify-center text-xs">
                      <ClockIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 truncate">{item.time.start}</div>
                  </div>
                  <div className="flex w-full items-center gap-1">
                    <div className="flex w-3 justify-center text-xs">
                      <ClockIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 truncate">{item.time.end}</div>
                  </div>
                  <div className="flex w-full items-center gap-1">
                    <div className="flex w-3 justify-center text-xs">
                      <HashIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 truncate">{index + 1}</div>
                  </div>
                </div>
                <div className="relative flex h-full flex-1 flex-col subtitle-mode-2">
                  <div className="el-textarea text1 flex-1">
                    <textarea
                      className="min-h-[31px] resize-none size-full p-2 text-xs hover:border-none focus:border-none focus:outline-none"
                      rows="2"
                      maxLength="200"
                      tabIndex="0"
                      autoComplete="off"
                      placeholder="请输入主字幕"
                      value={item.text}
                      onChange={(e) => {
                        handleUpdateVTT(index, e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>)}
          </TabsContent>
          <TabsContent value="ocr" className="mt-12 flex-1 direction-vertical border divide-y">
            {file.data.ocr_vtt.map((item, index) => <div className="relative h-20" key={index}>
              <div className="flex h-full items-center">
                <div className="flex h-full w-7 flex-col items-center justify-between border-r border-gray-200 py-3 text-base text-black/40">
                  <div className="flex w-full cursor-pointer justify-center transition hover:text-black active:scale-90" onClick={() => handleDeleteVTT(index)}>
                    <TrashIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="hidden h-full w-[7.7rem] flex-col items-start justify-between border-r border-gray-200 p-2 text-[13px] text-black/70 lg:flex">
                  <div className="flex w-full items-center gap-1">
                    <div className="flex w-3 justify-center text-xs">
                      <ClockIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 truncate">{item.time.start}</div>
                  </div>
                  <div className="flex w-full items-center gap-1">
                    <div className="flex w-3 justify-center text-xs">
                      <ClockIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 truncate">{item.time.end}</div>
                  </div>
                  <div className="flex w-full items-center gap-1">
                    <div className="flex w-3 justify-center text-xs">
                      <HashIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 truncate">{index + 1}</div>
                  </div>
                </div>
                <div className="relative flex h-full flex-1 flex-col subtitle-mode-2">
                  <div className="el-textarea text1 flex-1">
                    <textarea
                      className="min-h-[31px] resize-none size-full p-2 text-xs hover:border-none focus:border-none focus:outline-none"
                      rows="2"
                      maxLength="200"
                      tabIndex="0"
                      autoComplete="off"
                      placeholder="请输入主字幕"
                      value={item.text}
                      onChange={(e) => {
                        handleUpdateVTT(index, e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>)}
          </TabsContent>
        </Tabs>
      </div>
      <div className="p-6 bg-white rounded-lg space-y-3">
        <div className="size-full flex flex-col">
          <div className="mb-1">效果预览</div>
          <video ref={videoRef} className="h-[calc(100vh-385px)]" controls onLoadedMetadata={handleMetadataLoad}>
            <source src="/test.mp4" type="video/mp4" />
            <track default kind="captions" src={''} srcLang="zh-CN" label="Chinese" />
          </video>
        </div>
      </div>
    </div>
  );
}
