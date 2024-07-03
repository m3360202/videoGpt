import { Button } from "@/components/ui/button";
import MainPanel from "@/components/MainPanel";
import { VideoEpisode } from "@/sutando";

export default async function Home({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 15;
  const videos = await VideoEpisode.query().with('videox').paginate(page, limit);
  console.log('version:20240703')
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <header className="w-full border-b border-b-slate-200">
        <div className="max-w-screen-xl mx-auto flex flex-row items-center justify-between py-3">
          <h1 className="text-2xl font-bold">Video GPT</h1>
          <div className="flex flex-row items-center space-x-2">
            <Button asChild>
              <a href="https://hypergpt.aliensoft.com.cn/" target="_blank">Hyper GPT</a>
            </Button>
          </div>
        </div>
      </header>
      <div className="max-w-screen-xl mx-auto w-full flex-1 my-4 flex flex-col">
        <MainPanel data={videos.toData()} />
      </div>
      <footer className="max-w-screen-xl mx-auto flex flex-row items-center justify-center py-4 mt-4">
        Coded by <a href="#" className="ml-2 underline">重庆爱望科技有限公司</a>
      </footer>
    </main>
  );
}
