import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <>
      {/* Header */}
      <div className="grid grid-cols-3 m-4">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* ROW 1 */}
      <div className="mx-4 my-2">
        <Skeleton className="h-[120px] w-full rounded-lg" />
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-4 h-fit">
        <div className="col-span-1 ml-4 mr-2">
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </div>
        <div className="col-span-3 mr-4 ml-2">
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </div>
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-2 my-2 h-fit">
        <div className="ml-4 mr-2">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
        <div className="mr-4 ml-2">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>

      {/* ROW 4 */}
      <div className="grid grid-cols-7 my-2 h-fit">
        <div className="ml-4 col-span-3 mr-2">
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
        <div className="mr-2 ml-2 col-span-2">
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </div>
    </>
  )
}
