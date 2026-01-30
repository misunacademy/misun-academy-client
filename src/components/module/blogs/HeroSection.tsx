import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-6">
      <div className="bg-secondary row-span-2 rounded-3xl">
        <h1>Stay Updated with our latest news!</h1>
        <Button>Subscribe</Button>
      </div>
      <div className="bg-background-secondary rounded-3xl grid grid-cols-3 p-3 gap-3">
        <div className="bg-gray-300 w-full aspect-[4/3] rounded-2xl"></div>
        <div className="col-span-2">
          <h1>The Latest in Tech: What You Need to Know</h1>
          <div>
            <p>1hr ago</p>
            <p>5 min read</p>
          </div>
          <p>
            Stay ahead of the curve with our daily dose of tech insights. From
            AI breakthroughs to the latest gadget launches, we bring you the
            stories that matter.
          </p>
        </div>
      </div>
      <div className="bg-background-secondary rounded-3xl grid grid-cols-3 p-3 gap-3">
        <div className="bg-gray-300 w-full aspect-[4/3] rounded-2xl"></div>
        <div className="bg-gray-300 w-full aspect-[4/3] rounded-2xl"></div>
        <div className="bg-gray-300 w-full aspect-[4/3] rounded-2xl"></div>
      </div>
    </div>
  );
}
