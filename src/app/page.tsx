"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { FlipWords } from "@/components/ui/text-animations";
import {ArticleList} from "@/components/home/ArticleList";
import {useState} from "react";
function Page() {

    const [type, setType] = useState<string | undefined>(undefined);
    const [tempStorage, setTempStorage] = useState<string | undefined>(undefined);
    const placeholders = [
        "What's the first rule of Fight Club?",
        "Who is Tyler Durden?",
        "Where is Andrew Laeddis Hiding?",
        "Write a Javascript method to reverse a string",
        "How to assemble your own PC?",
    ];
    const words = ["Java", "Python", "TypeScript", "Next.js"];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setType(e.target.value);
    };
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setType(tempStorage);
        setTempStorage(undefined);
    };

    return (
       <main className={"w-full h-full"}>
           <div className={"w-full h-full flex flex-col gap-y-20 items-center justify-center mt-[15%]"}>
               <PlaceholdersAndVanishInput
                   placeholders={placeholders}
                   onChange={handleChange}
                   onSubmit={onSubmit}
               />
               <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
                   Start with
                   <FlipWords words={words} duration={1500}/> <br/>
               </div>
               <article className={"w-full h-full max-w-[1200px]"}>
                   <ArticleList type={type}/>
               </article>
           </div>
       </main>
    );
}

export default Page;