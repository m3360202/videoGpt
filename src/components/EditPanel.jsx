"use client";

import { cn, convertTimeToSeconds, getVideoMergedCues, secondsDifference } from "@/lib/utils";
import { useTasksStore } from "@/store/global";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TrashIcon, ClockIcon, HashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function EditPanel({ task, file }) {
  const videoRef = useRef();
  const { updateTaskVTT } = useTasksStore();
  const [tab, setTab] = useState('ocr');
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  // useEffect(() => {
  //   updateVideoVTT('start');
  // }, []);

  useEffect(() => {
    if (file.data.ocr_introduce_url && file.data.ocr_subtitle_url && !file.data.ocr_vtt) {
      async function main() {
        console.log('', [file.data.ocr_introduce_url, file.data.ocr_subtitle_url])
        const ocr_vtt = await getVideoMergedCues([file.data.ocr_introduce_url, file.data.ocr_subtitle_url]);
        console.log('file.data.ocr_vtt', ocr_vtt)
        updateTaskVTT(task.id, file.id, 'ocr_vtt', ocr_vtt);
        updateVideoVTT();
      }
      main();
    }
  }, []);

  useEffect(() => {
    if (tab && metadataLoaded) {
      updateVideoVTT();
    }
  }, [tab, metadataLoaded]);

  const handleUpdateVTT = (index, value) => {
    file.data[`${tab}_vtt`][index].text = value;
    updateTaskVTT(task.id, file.id, `${tab}_vtt`, file.data[`${tab}_vtt`]);
    updateVideoVTT();
  }

  const handleDeleteVTT = (index) => {
    file.data[`${tab}_vtt`].splice(index, 1);
    updateTaskVTT(task.id, file.id, `${tab}_vtt`, file.data[`${tab}_vtt`]);
    updateVideoVTT();
  }

  const handleUpdataTime = (index, key, value) => {
    console.log(index, key, value)
    file.data[`${tab}_vtt`][index].time[key] = value;
    updateTaskVTT(task.id, file.id, `${tab}_vtt`, file.data[`${tab}_vtt`]);
    updateVideoVTT();
  }

  const handleTabChange = (tab) => {
    setTab(tab);
  }

  const handleMetadataLoad = () => {
    setMetadataLoaded(true);
  };

  const updateVideoVTT = () => {
    setTimeout(() => {
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
        // vttCue.line = '-30%';
        // vttCue.lineAlign = "start";
        // vttCue.positionAlign = 'middle';
        track.addCue(vttCue);
      });
    }, 200);
  }
  useEffect(() => {
    const video = videoRef.current
    let interval = setInterval(() => {
      if (video) {
        video.controls = true
      }
    },100)
    return (
      () => {
        clearInterval(interval)
      }
    )
  }, [])
  
  return (
    <div className="flex-1 my-6 p-8 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-fuchsia-300 grid grid-cols-2 gap-8 relative">
      <div className="p-6 bg-white rounded-lg flex flex-col items-center flex-1 overflow-y-auto h-[calc(100vh-280px)] ">
        <Tabs defaultValue="ocr" value={tab} onValueChange={handleTabChange} className="w-full flex-1 flex flex-col">
          {/* <TabsList className="absolute top-12 z-10">
            <TabsTrigger value="audio">对白字幕</TabsTrigger>
            <TabsTrigger value="ocr">场景字幕</TabsTrigger>
          </TabsList> */}
          {/* <TabsContent value="audio" className="mt-12 flex-1 direction-vertical border divide-y">
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
          </TabsContent> */}
          <TabsContent value="ocr" className="flex-1 direction-vertical border divide-y">
            {!file.data.ocr_vtt && <div className="size-full flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>}
            {file.data.ocr_vtt?.map((item, index) => <div className="relative h-20" key={index}>
              <div className="flex h-full items-center">
                <div className="flex h-full w-7 flex-col items-center justify-between border-r border-gray-200 py-3 text-base text-black/40">
                  <div className="flex w-full cursor-pointer justify-center transition hover:text-black active:scale-90" onClick={() => handleDeleteVTT(index)}>
                    <TrashIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="hidden h-full w-[7.7rem] flex-col items-start justify-between border-r border-gray-200 p-2 text-[13px] text-black/70 lg:flex gap-0.5">
                  <div className="flex w-full items-center gap-1">
                    <div className="flex w-3 justify-center text-xs">
                      <ClockIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 truncate">
                      <input
                        className="w-full px-1 py-0.5 rounded bg-slate-100 focus-visible:outline-none"
                        value={item.time.start}
                        onChange={(e) => handleUpdataTime(index, 'start', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex w-full items-center gap-1">
                    <div className="flex w-3 justify-center text-xs">
                      <ClockIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 truncate">
                      <input
                        className="w-full px-1 py-0.5 rounded bg-slate-100 focus-visible:outline-none"
                        value={item.time.end}
                        onChange={(e) => handleUpdataTime(index, 'end', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex w-full items-center gap-1">
                    <div className="flex w-3 justify-center text-xs">
                      <HashIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 truncate">{index + 1} ({secondsDifference(item.time.start, item.time.end) / 1000}秒)</div>
                  </div>
                </div>
                <div className="relative flex h-full flex-1 flex-col subtitle-mode-2">
                  <div className="el-textarea text1 flex-1">
                    <textarea
                      className={cn(
                        "min-h-[31px] resize-none size-full p-2 text-xs hover:border-none focus:border-none focus:outline-none",
                        secondsDifference(item.time.start, item.time.end) < 800 ? ' text-red-500' : ''
                      )}
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
          <div className="mb-1">效果预览 - {file.name}</div>
          <video ref={videoRef} className="w-[300px] h-[calc(100vh-345px)]" controls onLoadedMetadata={handleMetadataLoad}>
            <source src={file.video} type="video/mp4" />
            <track default kind="captions" src={''} srcLang="zh-CN" label="Chinese" />
          </video>
        </div>
      </div>
    </div>
  );
}
