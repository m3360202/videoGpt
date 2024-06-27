import { useState } from "react";
import { Button } from "./ui/button";
import { LoaderCircleIcon } from "lucide-react";
import { publishAllVTT } from "@/app/actions";
import { toast } from "sonner";
import { useTasksStore } from "@/store/global";
import { convertSrtToVtt, parseVTT } from "@/lib/utils";

export default function PublishAllButton({ task }) {
  const [uploading, setUploading] = useState(false);
  const { updateTaskVTT } = useTasksStore();
  const handlePublishAll = async () => {
    if (uploading) {
      return;
    }

    setUploading(true);

    try {
      const vtts = await Promise.all(task.videos.map(async video => {
        let ocr_vtt = video.data.ocr_vtt;
        if (!ocr_vtt) {
          const res = await fetch(video.data.ocr_url).then(res => res.text());
          ocr_vtt = parseVTT(convertSrtToVtt(res));
          // updateTaskVTT(task.id, video.id, 'ocr_vtt', ocr_vtt);
        }

        const url = new URL(video.video);
        const filename = decodeURI(url.pathname).replace('.mp4', '.vtt');
        return {
          id: video.id,
          name: filename,
          cues: ocr_vtt,
        }
      }));

      await publishAllVTT(vtts);

      toast.success("发布成功", {
        description: `${task.id} 字幕发布成功！`,
      });
    } catch (e) {
      toast.error("发布失败", {
        description: `${task.id} 字幕发布失败，请重试`,
      });
    } finally {
      setUploading(false);
    }
    
    
  }

  return <Button
    className="text-sm" 
    variant="secondary" 
    disabled={task.progress < 100 || uploading}
    onClick={handlePublishAll}
  >
    {uploading && <LoaderCircleIcon className="w-4 h-4 animate-spin mr-2" />}
    发布全部字幕
  </Button>
}