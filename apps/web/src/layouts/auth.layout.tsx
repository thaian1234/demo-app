import { PhoneCallIcon } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="relative hidden lg:block bg-amber-700">
                <img
                    src="/bg-ddv.png"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
                />
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <PhoneCallIcon className="size-4" />
                        </div>
                        DDV Inc.
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-lg">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
