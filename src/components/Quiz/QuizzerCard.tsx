import {cn} from "@/lib/utils";
import React from "react";
import {Image} from "@nextui-org/react";

export const QuizzerCard = ({
    icon,
    name,
    bgColor,
    onClick,
    yourAnswer
}:{
    icon: string,
    name: string
    yourAnswer?: string;
    bgColor: "default" | "completed" | "wrong" | "correct";
    onClick?: () => void

}) => {

    const color = {
        default: "transparent",
        completed: "#180161",
        wrong: "#C63C51",
        correct: "#28A745",
    }[bgColor];

    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
                // animation styles
                "transition-all duration-200 ease-in-out hover:scale-[103%]",
                // light styles
                "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                // dark styles
                "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",

            )}
            style={{
                backgroundColor: color
            }}
            onClick={onClick}
        >
            <div className="flex flex-row items-center gap-3">
                <div
                    className="flex size-10 items-center justify-center rounded-2xl"
                    style={{
                        backgroundColor: "pink",
                    }}
                >
                    <Image
                        alt="Album cover"
                        className="object-cover"
                        height={35}
                        shadow="md"
                        src={icon}
                        width="100%"
                    />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <figcaption
                        className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
                        <span className="text-sm sm:text-lg">{name}</span>
                    </figcaption>
                    {yourAnswer && <span className={"text-green-500 font-bold"}>{yourAnswer.length >= 25 ? yourAnswer.substring(0, 25) + "..." : yourAnswer}</span>}
                </div>
            </div>
        </figure>
    );
};