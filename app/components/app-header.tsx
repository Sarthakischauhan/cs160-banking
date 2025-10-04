import { Landmark } from "lucide-react";

export function AppHeader() {
  return (
    <>
      <div className="grid grid-cols-3 w-full h-[70px] px-10">
        <div className="flex flex-row items-center gap-4">
          <Landmark className="h-full" size="40px"/>
          <span className="font-bold text-4xl">Online Bank</span>
        </div>
        <div className="flex flex-row justify-center items-center gap-4"> 
            <span>Protected Page</span>
            <a href="/protected">
                <div className="border-1 border-black py-2 px-4 rounded-lg hover:bg-gray-300">
                    Protected
                </div>
            </a>
        </div>
        <div className="w-full flex flex-row justify-end items-center gap-4">
            <span>Administrator Page</span>
            <a href="/admin">
                <div className="border-1 border-black py-2 px-4 rounded-lg hover:bg-gray-300">
                    Admin
                </div>
            </a>
        </div>
      </div>
    </>
  );
}
