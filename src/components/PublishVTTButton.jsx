import { useState } from "react";
import { Button } from "./ui/button";
import { LoaderCircleIcon } from "lucide-react";
import { publishVTT } from "@/app/actions";
import { toast } from "sonner";
import { convertSrtToVtt, parseVTT } from "@/lib/utils";
import { useTasksStore } from "@/store/global";

export default function PublishVTTButton({ task, video }) {
  const [uploading, setUploading] = useState(false);
  const { updateTaskVTT } = useTasksStore();
  const handlePublish = async (video) => {
    if (uploading) {
      return;
    }

    setUploading(true);
    const url = new URL(video.video);
    const filename = decodeURI(url.pathname).replace('.mp4', '.vtt');
    try {
      let ocr_vtt = video.data.ocr_vtt;
      if (!ocr_vtt) {
        const res = await fetch(video.data.ocr_url).then(res => res.text());
        ocr_vtt = parseVTT(convertSrtToVtt(res));
        updateTaskVTT(task.id, video.id, 'ocr_vtt', ocr_vtt);
      }

      await publishVTT(video.id, filename, ocr_vtt);
      toast.success("发布成功", {
        description: `${video.id} 字幕发布成功！`,
      });
    } catch (e) {
      toast.error("发布失败", {
        description: '请稍后重试',
      });
    } finally {
      setUploading(false);
    }
  }

  return <Button
    className="text-xs" 
    variant="secondary" 
    disabled={video.progress < 100 || uploading}
    onClick={() => handlePublish(video)}
  >
    {uploading && <LoaderCircleIcon className="w-3 h-3 animate-spin mr-2" />}
    发布字幕
  </Button>
}